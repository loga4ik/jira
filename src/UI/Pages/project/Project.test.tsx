import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/server";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { ivan } from "../../../test/fixtures";
import { setAccessToken } from "../../../Lib/api/userApi/authToken";
import Project from "./Project";

/*
 * Страница проекта целиком: проект, задачи, команда и статусы приходят
 * из разных запросов, а компоненты разных уровней (Subtask глубоко внутри)
 * берут их из общего кэша RTK Query, без пропсов и без слайса.
 */

const petr = { id: 2, login: "petr", name: "Пётр", surname: "", profile_image: null };

let calls: Record<string, number>;

const serveProject = () => {
  calls = { project: 0, tasks: 0, team: 0, statuses: 0 };
  server.use(
    http.get("/api/user", () => HttpResponse.json(ivan)),
    http.get("/api/project/5", () => {
      calls.project++;
      return HttpResponse.json([
        { id: 5, title: "Кофейня", description: "Лендинг", owner_id: ivan.id },
      ]);
    }),
    http.get("/api/task/getTasksAndSubtasks/5", () => {
      calls.tasks++;
      return HttpResponse.json({
        tasks: [{ id: 10, project_id: 5, title: "Вёрстка", description: "" }],
        subtasks: [
          { id: 100, task_id: 10, title: "Шапка", user_id: 2, status_id: 2 },
          { id: 101, task_id: 10, title: "Подвал", user_id: null, status_id: 1 },
        ],
      });
    }),
    http.get("/api/team/5", () => {
      calls.team++;
      return HttpResponse.json([petr, { ...ivan, profile_image: null }]);
    }),
    http.get("/api/status", () => {
      calls.statuses++;
      return HttpResponse.json([
        { id: 1, title: "новый" },
        { id: 2, title: "в работе" },
      ]);
    }),
  );
};

const renderProject = (route = "/project/5") =>
  renderWithProviders(<Project />, { route, path: "/project/:id" });

beforeEach(() => {
  setAccessToken("access-1");
});

describe("Project", () => {
  it("показывает проект, задачи, исполнителя и статус подзадачи", async () => {
    serveProject();
    renderProject();

    expect(await screen.findByText("Кофейня")).toBeInTheDocument();
    expect(await screen.findByText("Вёрстка")).toBeInTheDocument();
    // исполнитель — из команды, статус — из справочника: другие запросы
    expect(await screen.findByText("исполнитель: petr")).toBeInTheDocument();
    expect(await screen.findByText("в работе")).toBeInTheDocument();
    expect(screen.getByText("новый")).toBeInTheDocument();
  });

  it("общие данные запрашиваются один раз, сколько бы компонентов их ни читало", async () => {
    serveProject();
    renderProject();

    await screen.findByText("исполнитель: petr");
    await screen.findByText("в работе");

    // проект читают Project и Sidebar, команду и статусы — каждая подзадача
    expect(calls).toEqual({ project: 1, tasks: 1, team: 1, statuses: 1 });
  });

  it("постороннему показывает «нет доступа» и не запрашивает задачи", async () => {
    let tasksCalls = 0;
    server.use(
      http.get("/api/user", () => HttpResponse.json(ivan)),
      http.get("/api/project/5", () =>
        HttpResponse.json({ message: "Нет доступа к проекту" }, { status: 403 }),
      ),
      http.get("/api/task/getTasksAndSubtasks/5", () => {
        tasksCalls++;
        return HttpResponse.json({ tasks: [], subtasks: [] });
      }),
    );

    renderProject();

    expect(
      await screen.findByText("У вас больше нет доступа к этому проекту"),
    ).toBeInTheDocument();
    expect(tasksCalls).toBe(0);
  });

  it("несуществующий проект — тоже «нет доступа»", async () => {
    server.use(
      http.get("/api/user", () => HttpResponse.json(ivan)),
      http.get("/api/project/404", () =>
        HttpResponse.json({ message: "Проект не найден" }, { status: 404 }),
      ),
    );

    renderProject("/project/404");

    expect(
      await screen.findByText("У вас больше нет доступа к этому проекту"),
    ).toBeInTheDocument();
  });

  it("мусор вместо id — уводит на главную без запросов", async () => {
    renderProject("/project/abc");

    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
  });
});
