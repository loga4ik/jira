import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/server";
import { createTestStore } from "../../../test/createTestStore";
import { ivan } from "../../../test/fixtures";
import { setAccessToken } from "../userApi/authToken";
import { projectApi } from "./projectApi";
import { userApi } from "../userApi";

/*
 * Главное, что даёт RTK Query по сравнению с ручными fetch, — теги.
 * Запрос списка «помечен» тегом Project/LIST, а мутации этот тег «сбрасывают».
 * Тогда список, на который кто-то подписан (открыта главная), перезапрашивается
 * сам — компонентам не нужно знать друг о друге.
 *
 * Подписку здесь создаёт dispatch(initiate(...)) — так же делает
 * useGetUserProjectsQuery внутри компонента.
 */

const project = (id: number) => ({
  id,
  title: `P${id}`,
  description: "",
  img: "",
  owner_id: ivan.id,
});

let listCalls: number;

beforeEach(() => {
  setAccessToken("access-1");
  listCalls = 0;
  server.use(
    http.get("/api/project/getUserProjects/:id", () => {
      listCalls++;
      return HttpResponse.json({ owner: [project(5)], working: [] });
    }),
  );
});

/** Store, в котором главная страница «открыта»: список загружен и есть подписчик. */
const storeWithOpenList = async () => {
  const store = createTestStore();
  await store.dispatch(projectApi.endpoints.getUserProjects.initiate(ivan.id));
  expect(listCalls).toBe(1);
  return store;
};

describe("projectApi: кэш списка проектов", () => {
  it("повторный запрос того же списка берётся из кэша", async () => {
    const store = await storeWithOpenList();

    await store.dispatch(projectApi.endpoints.getUserProjects.initiate(ivan.id));

    expect(listCalls).toBe(1);
  });

  it("после создания проекта список перезапрашивается", async () => {
    server.use(
      http.post("/api/project/create", () =>
        HttpResponse.json({ project: project(6), tasks: [], subtasks: [] }),
      ),
    );
    const store = await storeWithOpenList();

    await store.dispatch(
      projectApi.endpoints.createProject.initiate({
        title: "P6",
        description: "",
        tasks: [],
      }),
    );

    await vi.waitFor(() => expect(listCalls).toBe(2));
  });

  it("после удаления проекта список перезапрашивается", async () => {
    server.use(
      http.delete("/api/project/5", () => new HttpResponse(null, { status: 204 })),
    );
    const store = await storeWithOpenList();

    const result = await store.dispatch(
      projectApi.endpoints.deleteProject.initiate(5),
    );

    expect(result.error).toBeUndefined();
    await vi.waitFor(() => expect(listCalls).toBe(2));
  });

  it("если удалить не вышло — список не трогаем", async () => {
    server.use(
      http.delete("/api/project/5", () =>
        HttpResponse.json({ message: "Нет доступа к проекту" }, { status: 403 }),
      ),
    );
    const store = await storeWithOpenList();

    const result = await store.dispatch(
      projectApi.endpoints.deleteProject.initiate(5),
    );

    expect(result.error).toMatchObject({ status: 403 });
    // даём время возможному перезапросу — его быть не должно
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(listCalls).toBe(1);
  });

  it("выход стирает проекты прошлого пользователя из кэша", async () => {
    server.use(http.delete("/api/user/logOut", () => HttpResponse.json({})));
    const store = await storeWithOpenList();

    await store.dispatch(userApi.endpoints.logout.initiate());

    const cached = projectApi.endpoints.getUserProjects.select(ivan.id)(
      store.getState(),
    );
    expect(cached.data).toBeUndefined();
  });
});

describe("projectApi: страница проекта", () => {
  const tasksResponse = (status_id: number) => ({
    tasks: [{ id: 10, project_id: 5, title: "Вёрстка", description: "" }],
    subtasks: [{ id: 100, task_id: 10, title: "Шапка", user_id: 2, status_id }],
  });

  it("смена подзадачи правит кэш задач на месте, без перезапроса", async () => {
    let tasksCalls = 0;
    server.use(
      http.get("/api/task/getTasksAndSubtasks/5", () => {
        tasksCalls++;
        return HttpResponse.json(tasksResponse(1));
      }),
      http.put("/api/subtask/addUserInSubtaskRename", async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ ...body, task_id: 10 });
      }),
    );
    const store = createTestStore();
    await store.dispatch(projectApi.endpoints.getTasks.initiate(5));

    await store.dispatch(
      projectApi.endpoints.updateSubtask.initiate({
        projectId: 5,
        id: 100,
        title: "Шапка",
        user_id: 2,
        status_id: 3,
      }),
    );

    // правка кэша асинхронная (как upsertQueryData у входа) — ждём
    await vi.waitFor(() =>
      expect(
        projectApi.endpoints.getTasks.select(5)(store.getState()).data?.subtasks[0]
          .status_id,
      ).toBe(3),
    );
    expect(tasksCalls).toBe(1);
  });

  it("добавление участника перезапрашивает команду и свободных", async () => {
    const counts = { team: 0, free: 0 };
    server.use(
      http.get("/api/team/5", () => {
        counts.team++;
        return HttpResponse.json([]);
      }),
      http.post("/api/project/getFreeUsers", () => {
        counts.free++;
        return HttpResponse.json([]);
      }),
      http.put("/api/team/create", () => HttpResponse.json({})),
    );
    const store = createTestStore();
    await store.dispatch(projectApi.endpoints.getTeam.initiate(5));
    await store.dispatch(projectApi.endpoints.getFreeUsers.initiate(5));

    await store.dispatch(
      projectApi.endpoints.addMember.initiate({ projectId: 5, userId: 2 }),
    );

    await vi.waitFor(() => expect(counts).toEqual({ team: 2, free: 2 }));
  });

  it("удаление участника перезапрашивает и задачи: с подзадач снят исполнитель", async () => {
    const counts = { team: 0, tasks: 0 };
    server.use(
      http.get("/api/team/5", () => {
        counts.team++;
        return HttpResponse.json([]);
      }),
      http.get("/api/task/getTasksAndSubtasks/5", () => {
        counts.tasks++;
        return HttpResponse.json(tasksResponse(1));
      }),
      http.delete("/api/team/deleteUser/2", () => HttpResponse.json({})),
    );
    const store = createTestStore();
    await store.dispatch(projectApi.endpoints.getTeam.initiate(5));
    await store.dispatch(projectApi.endpoints.getTasks.initiate(5));

    await store.dispatch(
      projectApi.endpoints.removeMember.initiate({ projectId: 5, userId: 2 }),
    );

    await vi.waitFor(() => expect(counts).toEqual({ team: 2, tasks: 2 }));
  });

  it("кэш у каждого проекта свой: данные проекта 5 не видны как проект 7", async () => {
    server.use(
      http.get("/api/project/:id", ({ params }) =>
        HttpResponse.json([{ id: Number(params.id), title: `P${params.id}` }]),
      ),
    );
    const store = createTestStore();
    await store.dispatch(projectApi.endpoints.getProject.initiate(5));

    // проект 7 ещё не загружен — пусто, а не «P5», как было со слайсом
    expect(
      projectApi.endpoints.getProject.select(7)(store.getState()).data,
    ).toBeUndefined();

    await store.dispatch(projectApi.endpoints.getProject.initiate(7));
    expect(projectApi.endpoints.getProject.select(7)(store.getState()).data?.title).toBe(
      "P7",
    );
  });
});
