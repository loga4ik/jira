import { beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../test/server";
import { createTestStore } from "../../test/createTestStore";
import { ivan } from "../../test/fixtures";
import { userApi } from "./userApi";
import { getAccessToken, setAccessToken } from "./authToken";

// Токен лежит в переменной модуля authToken и переживает тест.
// Обнуляем его, чтобы каждый тест начинался «без входа».
beforeEach(() => {
  setAccessToken(null);
});

describe("baseQueryWithReauth", () => {
  it("на 401 обновляет токен и повторяет исходный запрос", async () => {
    // Подготовка: описываем поддельный бэкенд.
    let refreshCalls = 0;

    server.use(
      // /api/user пускает только с новым токеном, иначе 401 —
      // ровно так ведёт себя настоящий бэк, когда access протух.
      http.get("/api/user", ({ request }) => {
        if (request.headers.get("Authorization") === "Bearer new-token") {
          return HttpResponse.json(ivan);
        }
        return new HttpResponse(null, { status: 401 });
      }),

      // refresh выдаёт новый токен и считает, сколько раз его вызвали
      http.post("/api/user/refresh", () => {
        refreshCalls++;
        return HttpResponse.json({ accessToken: "new-token" });
      }),
    );

    const store = createTestStore();

    // Действие: запрашиваем текущего пользователя так же, как это делает
    // useGetCurrentUserQuery, только без компонента.
    const result = await store.dispatch(
      userApi.endpoints.getCurrentUser.initiate(),
    );

    // Проверка: ошибки нет, пользователь получен, refresh был ровно один,
    // новый токен сохранился для следующих запросов.
    // Ошибку проверяем первой: если запрос упал, тест покажет, с какой
    // именно ошибкой, а не просто «ожидали пользователя, получили undefined».
    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(ivan);
    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe("new-token");
  });

  it("если refresh не удался, возвращает 401 и стирает токен", async () => {
    // Подготовка: у пользователя остался старый токен, а refresh-кука
    // протухла — сервер отказывает и в данных, и в обновлении.
    setAccessToken("old-token");

    server.use(
      http.get("/api/user", () => new HttpResponse(null, { status: 401 })),
      http.post(
        "/api/user/refresh",
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    const store = createTestStore();

    const result = await store.dispatch(
      userApi.endpoints.getCurrentUser.initiate(),
    );

    // Проверка: компонент получит честную 401 (и покажет экран входа),
    // а протухший токен не останется в памяти и не уйдёт в следующих запросах.
    // toMatchObject сравнивает только перечисленные поля, остальные игнорирует.
    expect(result.error).toMatchObject({ status: 401 });
    expect(getAccessToken()).toBeNull();
  });

  it("401 на входе не запускает refresh", async () => {
    // Подготовка: неверный пароль. Refresh считает вызовы —
    // на этом маршруте их быть не должно.
    let refreshCalls = 0;

    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ message: "Неверный пароль" }, { status: 401 }),
      ),
      http.post("/api/user/refresh", () => {
        refreshCalls++;
        return HttpResponse.json({ accessToken: "new-token" });
      }),
    );

    const store = createTestStore();

    const result = await store.dispatch(
      userApi.endpoints.login.initiate({ login: "ivan", password: "wrong" }),
    );

    // Проверка: на входе 401 значит «неверные данные», а не «протух токен».
    // Ошибка доходит до формы как есть, и refresh не вызывается ни разу —
    // это и есть смысл списка AUTH_ENDPOINTS в baseQuery.ts.
    expect(result.error).toMatchObject({
      status: 401,
      data: { message: "Неверный пароль" },
    });
    expect(refreshCalls).toBe(0);
  });

  it("гость без токена: один запрос /refresh, сам запрос не уходит", async () => {
    // Подготовка: токена нет, refresh-куки тоже (сервер отвечает 401).
    // /api/user считает обращения — их быть не должно: без токена
    // он гарантированно ответил бы 401, лишний запрос ни к чему.
    let currentUserCalls = 0;
    let refreshCalls = 0;

    server.use(
      http.get("/api/user", () => {
        currentUserCalls++;
        return new HttpResponse(null, { status: 401 });
      }),
      http.post("/api/user/refresh", () => {
        refreshCalls++;
        return new HttpResponse(null, { status: 401 });
      }),
    );

    const store = createTestStore();

    const result = await store.dispatch(
      userApi.endpoints.getCurrentUser.initiate(),
    );

    // Компонент получает обычную 401 — для него ничего не изменилось.
    expect(result.error).toMatchObject({ status: 401 });
    expect(refreshCalls).toBe(1);
    expect(currentUserCalls).toBe(0);
  });
});
