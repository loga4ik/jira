import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../../../test/server";
import { renderWithProviders } from "../../../../../test/renderWithProviders";
import { createTestStore } from "../../../../../test/createTestStore";
import { ivan } from "../../../../../test/fixtures";
import { setAccessToken } from "../../../../../Lib/api/authToken";
import {
  getProjectData,
  updateAllProject,
} from "../../../../../Lib/Slices/projectSlice/projectApi";
import type { Project } from "../../../../../Lib/Slices/projectSlice/types";
import { ProjectContext } from "../../../../../Context/ProjectConstext";
import Sidebar from "./Sidebar";

const OWNER_ID = 1; // ivan.id
const OTHER_ID = 2;

const makeProject = (owner_id: number) =>
  ({ id: 5, title: "Проект", description: "", owner_id }) as Project;

/** Сессия «вошёл как ivan»: refresh выдаёт токен, /api/user — ivan. */
const loginAsIvan = () =>
  server.use(
    http.post("/api/user/refresh", () =>
      HttpResponse.json({ accessToken: "access-1" }),
    ),
    http.get("/api/user", () => HttpResponse.json(ivan)),
  );

/** Рисует Sidebar с проектом в сторе и выбранной (или нет) задачей. */
const renderSidebar = (ownerId: number, taskIdToEdite?: number) => {
  const store = createTestStore();
  // кладём проект в стор так же, как это делает успешный getProjectData
  store.dispatch(
    getProjectData.fulfilled(makeProject(ownerId), "test", {
      project_id: 5,
      abortController: new AbortController(),
    }),
  );
  return renderWithProviders(
    <ProjectContext.Provider
      value={{ statuses: {}, taskIdToEdite, changeTaskId: () => {} }}
    >
      <Sidebar project_id={5} />
    </ProjectContext.Provider>,
    { route: "/project", path: "/project", store },
  );
};

beforeEach(() => {
  setAccessToken(null);
  loginAsIvan();
});

describe("Sidebar", () => {
  it("владелец видит управление проектом", async () => {
    renderSidebar(OWNER_ID);

    // кнопки появляются, когда загрузился текущий пользователь
    expect(
      await screen.findByRole("button", { name: "добавление пользователя" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "удаление" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "редактироване" }),
    ).toBeInTheDocument();
  });

  it("участник не видит управление проектом", async () => {
    renderSidebar(OTHER_ID);

    // ждём, пока пользователь загрузится, — иначе кнопок не было бы
    // просто потому, что ещё неизвестно, кто вошёл
    expect(await screen.findByRole("button", { name: "домой" })).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(
      screen.queryByRole("button", { name: "добавление пользователя" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "удаление" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "редактироване" }),
    ).not.toBeInTheDocument();
  });

  it("участник может редактировать выбранную задачу", async () => {
    renderSidebar(OTHER_ID, 7);

    expect(
      await screen.findByRole("button", { name: "редактироване" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "удаление" })).not.toBeInTheDocument();
  });
});

describe("updateAllProject", () => {
  it("на 403 отклоняется с текстом сервера и не трогает стор", async () => {
    server.use(
      http.put("/api/project/updateAll", () =>
        HttpResponse.json({ message: "Нет доступа к проекту" }, { status: 403 }),
      ),
    );
    const store = createTestStore();
    store.dispatch(
      getProjectData.fulfilled(makeProject(OTHER_ID), "test", {
        project_id: 5,
        abortController: new AbortController(),
      }),
    );

    const res = await store.dispatch(
      updateAllProject({ project_id: 5, title: "Новое", description: "", tasks: [] }),
    );

    expect(updateAllProject.rejected.match(res)).toBe(true);
    expect(res.payload).toBe("Нет доступа к проекту");
    // раньше тело ошибки попадало в стор: project становился undefined
    expect(store.getState().project.project?.title).toBe("Проект");
    expect(store.getState().project.tasks).toEqual([]);
  });
});
