import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../../../test/server";
import { renderWithProviders } from "../../../../../test/renderWithProviders";
import { ivan } from "../../../../../test/fixtures";
import { setAccessToken } from "../../../../../Lib/api/userApi/authToken";
import { ProjectCreateForm } from "./ProjectCreateForm";

beforeEach(() => {
  setAccessToken("access-1");
  server.use(http.get("/api/user", () => HttpResponse.json(ivan)));
});

const renderForm = () =>
  renderWithProviders(<ProjectCreateForm />, { route: "/create", path: "/create" });

/** Заполняет проект с одной задачей и одной подзадачей. */
const fillForm = async (user: ReturnType<typeof renderForm>["user"]) => {
  const [projectTitle, taskTitle] = screen.getAllByPlaceholderText("название проекта")
    .concat(screen.getAllByPlaceholderText("задача"));
  const [projectDescription, taskDescription] = screen.getAllByPlaceholderText("описание");

  await user.type(projectTitle, "Кофейня");
  await user.type(projectDescription, "Лендинг");
  await user.type(taskTitle, "Вёрстка");
  await user.type(taskDescription, "Главная");
  await user.type(screen.getByPlaceholderText("подзача"), "Шапка");
};

describe("ProjectCreateForm", () => {
  it("создаёт проект и открывает его страницу", async () => {
    let sentBody: unknown;
    server.use(
      http.post("/api/project/create", async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json({
          project: { id: 42, title: "Кофейня" },
          tasks: [],
          subtasks: [],
        });
      }),
    );

    const { user } = renderForm();
    await screen.findByPlaceholderText("название проекта");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "сохранить" }));

    expect(await screen.findByText("Проект 42")).toBeInTheDocument();
    // владельца сервер берёт из токена — user_id в теле больше нет
    expect(sentBody).toEqual({
      title: "Кофейня",
      description: "Лендинг",
      tasks: [
        { title: "Вёрстка", description: "Главная", subtasks: [{ title: "Шапка" }] },
      ],
    });
  });

  it("при ошибке сервера показывает её и остаётся на форме", async () => {
    server.use(
      http.post("/api/project/create", () =>
        HttpResponse.json({ message: "Слишком длинное название" }, { status: 400 }),
      ),
    );

    const { user } = renderForm();
    await screen.findByPlaceholderText("название проекта");
    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "сохранить" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Слишком длинное название");
    expect(screen.queryByText(/Проект \d+/)).not.toBeInTheDocument();
  });
});
