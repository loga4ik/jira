import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../../../../test/server";
import { renderWithProviders } from "../../../../../test/renderWithProviders";
import { setAccessToken } from "../../../../../Lib/api/userApi/authToken";
import DeleteModal from "./DeleteModal";

beforeEach(() => {
  setAccessToken("access-1");
});

const renderModal = () =>
  renderWithProviders(<DeleteModal project_id={5} />, {
    route: "/project/5/delete",
    path: "/project/:id/delete",
  });

describe("DeleteModal", () => {
  it("удаляет проект запросом DELETE и уходит на главную", async () => {
    let method = "";
    server.use(
      http.all("/api/project/5", ({ request }) => {
        method = request.method;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const { user } = renderModal();
    await user.click(screen.getByRole("button", { name: "удалить" }));

    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
    expect(method).toBe("DELETE");
  });

  it("при отказе сервера показывает ошибку и остаётся", async () => {
    server.use(
      http.delete("/api/project/5", () =>
        HttpResponse.json({ message: "Нет доступа к проекту" }, { status: 403 }),
      ),
    );

    const { user } = renderModal();
    await user.click(screen.getByRole("button", { name: "удалить" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Нет доступа к проекту");
    expect(screen.queryByText("Главная страница")).not.toBeInTheDocument();
  });
});
