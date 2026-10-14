import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../../test/server";
import { renderWithProviders } from "../../../../test/renderWithProviders";
import { ivan } from "../../../../test/fixtures";
import { setAccessToken } from "../../../../Lib/api/authToken";
import { getMainProject, setMainProject } from "../../../../features/mainProject/mainProject";
import { ProjectList } from "./ProjectList";

const project = (id: number, title: string) => ({
  id,
  title,
  description: "",
  img: "",
  owner_id: ivan.id,
});

beforeEach(() => {
  localStorage.clear();
  setAccessToken("access-1");
  server.use(
    http.get("/api/user", () => HttpResponse.json(ivan)),
    http.get("/api/project/getUserProjects/:id", () =>
      HttpResponse.json({
        owner: [project(5, "Кофейня")],
        working: [project(7, "Блог")],
      }),
    ),
  );
});

const renderList = () =>
  renderWithProviders(<ProjectList />, { route: "/", path: "/" });

describe("ProjectList: главный проект", () => {
  it("звезда делает проект главным, повторный клик снимает", async () => {
    const { user } = renderList();

    const star = await screen.findByRole("button", { name: "Сделать «Кофейня» главным" });
    expect(star).toHaveAttribute("aria-pressed", "false");

    await user.click(star);
    expect(star).toHaveAttribute("aria-pressed", "true");
    expect(star).toHaveAccessibleName("Убрать «Кофейня» из главных");
    expect(getMainProject(ivan.id)).toBe(5);

    await user.click(star);
    expect(star).toHaveAttribute("aria-pressed", "false");
    expect(getMainProject(ivan.id)).toBeNull();
  });

  it("главным может быть только один проект", async () => {
    const { user } = renderList();

    await user.click(await screen.findByRole("button", { name: "Сделать «Кофейня» главным" }));
    await user.click(screen.getByRole("button", { name: "Сделать «Блог» главным" }));

    expect(getMainProject(ivan.id)).toBe(7);
    expect(screen.getByRole("button", { name: "Сделать «Кофейня» главным" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("клик по звезде не открывает проект", async () => {
    const { user } = renderList();

    await user.click(await screen.findByRole("button", { name: "Сделать «Кофейня» главным" }));

    expect(screen.queryByText("Проект 5")).not.toBeInTheDocument();
  });

  it("сохранённый выбор показывается при загрузке", async () => {
    setMainProject(ivan.id, 7);
    renderList();

    expect(
      await screen.findByRole("button", { name: "Убрать «Блог» из главных" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("если главного проекта больше нет в списке — забывает его", async () => {
    setMainProject(ivan.id, 99); // проект удалили или пользователя исключили
    renderList();

    await screen.findByRole("button", { name: "Сделать «Кофейня» главным" });
    expect(getMainProject(ivan.id)).toBeNull();
  });
});
