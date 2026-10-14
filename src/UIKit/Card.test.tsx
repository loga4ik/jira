import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import Card from "./Card";

const project = {
  id: 5,
  title: "Сайт кофейни",
  description: "Лендинг и меню",
  img: "",
  owner_id: 1,
};

describe("Card", () => {
  it("это ссылка на страницу проекта", () => {
    renderWithProviders(<Card {...project} />, { route: "/", path: "/" });

    // Доступное имя ссылки складывается из текста внутри неё.
    const link = screen.getByRole("link", { name: /Сайт кофейни/ });
    expect(link).toHaveAttribute("href", "/project/5");
  });

  it("по клику открывает проект", async () => {
    const { user } = renderWithProviders(<Card {...project} />, {
      route: "/",
      path: "/",
    });

    await user.click(screen.getByRole("link", { name: /Сайт кофейни/ }));

    expect(await screen.findByText("Проект 5")).toBeInTheDocument();
  });
});
