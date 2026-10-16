import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../test/server";
import { renderWithProviders } from "../../test/renderWithProviders";
import { ivan } from "../../test/fixtures";
import { setAccessToken } from "../../Lib/api/userApi/authToken";
import { GuestRoute } from "./GuestRoute";

beforeEach(() => {
  setAccessToken(null);
});

describe("GuestRoute", () => {
  it("вошедшего пользователя отправляет на главную", async () => {
    // Сессия есть: refresh выдаёт токен, /api/user — пользователя.
    server.use(
      http.post("/api/user/refresh", () =>
        HttpResponse.json({ accessToken: "access-1" }),
      ),
      http.get("/api/user", () => HttpResponse.json(ivan)),
    );

    renderWithProviders(
      <GuestRoute>
        <p>Страница для гостей</p>
      </GuestRoute>,
    );

    expect(await screen.findByText("Главная страница")).toBeInTheDocument();
    expect(screen.queryByText("Страница для гостей")).not.toBeInTheDocument();
  });

  it("гостю показывает страницу", async () => {
    // Сессии нет: refresh отвечает 401.
    server.use(
      http.post("/api/user/refresh", () => new HttpResponse(null, { status: 401 })),
    );

    renderWithProviders(
      <GuestRoute>
        <p>Страница для гостей</p>
      </GuestRoute>,
    );

    expect(screen.getByText("Страница для гостей")).toBeInTheDocument();
    // Ждём, пока завершится проверка сессии, — страница должна остаться.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.getByText("Страница для гостей")).toBeInTheDocument();
  });

  it("вошедшего пользователя возвращает по адресу из ?from=", async () => {
    server.use(
      http.post("/api/user/refresh", () =>
        HttpResponse.json({ accessToken: "access-1" }),
      ),
      http.get("/api/user", () => HttpResponse.json(ivan)),
    );

    renderWithProviders(
      <GuestRoute>
        <p>Страница для гостей</p>
      </GuestRoute>,
      { route: "/login?from=%2Fproject%2F5" },
    );

    expect(await screen.findByText("Проект 5")).toBeInTheDocument();
  });
});
