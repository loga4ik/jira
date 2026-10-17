import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { delay, http, HttpResponse } from "msw";
import { server } from "../../test/server";
import { createTestStore } from "../../test/createTestStore";
import { ivan } from "../../test/fixtures";
import { setAccessToken } from "../../Lib/api/userApi/authToken";
import { ProtectedRoute } from "./ProtectedRoute";

/** Показывает, куда в итоге привёл роутер. */
const WhereAmI = () => {
  const { pathname, search } = useLocation();
  return <p>страница входа: {pathname + search}</p>;
};

let secretRenders: number;
/** Защищённая страница. Считаем рендеры: гостю она не должна отрисоваться ни разу. */
const Secret = () => {
  secretRenders++;
  return <p>секретный проект</p>;
};

const renderAt = (route: string) =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/project/:id" element={<Secret />} />
          </Route>
          <Route path="/login" element={<WhereAmI />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

beforeEach(() => {
  setAccessToken(null);
  secretRenders = 0;
});

describe("ProtectedRoute", () => {
  it("вошедшему показывает страницу", async () => {
    server.use(
      http.post("/api/user/refresh", () => HttpResponse.json({ accessToken: "access-1" })),
      http.get("/api/user", () => HttpResponse.json(ivan)),
    );

    renderAt("/project/5");

    expect(await screen.findByText("секретный проект")).toBeInTheDocument();
  });

  it("гостя уводит на вход с адресом возврата, страница не рисуется", async () => {
    server.use(
      http.post("/api/user/refresh", () => new HttpResponse(null, { status: 401 })),
    );

    renderAt("/project/5?tab=chat");

    expect(
      await screen.findByText("страница входа: /login?from=%2Fproject%2F5%3Ftab%3Dchat"),
    ).toBeInTheDocument();
    // раньше страница успевала отрисоваться и отправить свои запросы
    expect(secretRenders).toBe(0);
  });

  it("пока неизвестно, вошёл ли пользователь, — загрузка, без редиректа", async () => {
    server.use(
      http.post("/api/user/refresh", async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    );

    renderAt("/project/5");

    expect(await screen.findByRole("status")).toHaveTextContent("загрузка");
    expect(screen.queryByText(/страница входа/)).not.toBeInTheDocument();
    expect(secretRenders).toBe(0);
  });
});
