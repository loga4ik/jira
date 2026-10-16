import { beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../../test/server";
import { createTestStore, type TestStore } from "../../../test/createTestStore";
import { ivan } from "../../../test/fixtures";
import { userApi } from "./userApi";
import { getAccessToken, setAccessToken } from "./authToken";

/** Что сейчас лежит в кэше getCurrentUser — то же, что увидел бы useCurrentUser. */
const cachedCurrentUser = (store: TestStore) =>
  userApi.endpoints.getCurrentUser.select()(store.getState()).data;

/**
 * Ждём, пока пользователь появится в кэше.
 *
 * upsertQueryData асинхронный: промис login выполняется раньше, чем
 * onQueryStarted успевает положить пользователя в кэш (запись в этот момент
 * ещё в статусе pending). Компоненту это не мешает — useCurrentUser
 * перерисуется, когда данные появятся. А тесту нужно подождать.
 *
 * vi.waitFor повторяет проверку, пока она не пройдёт (по умолчанию до 1 с),
 * и падает с последней ошибкой, если так и не дождался.
 */
const waitForCachedUser = (store: TestStore) =>
  vi.waitFor(() => expect(cachedCurrentUser(store)).toEqual(ivan));

beforeEach(() => {
  setAccessToken(null);
});

describe("login", () => {
  it("сохраняет токен и кладёт пользователя в кэш без запроса /api/user", async () => {
    // Подготовка: вход успешен. А /api/user считает обращения —
    // их быть не должно: пользователь уже пришёл в ответе входа.
    let currentUserCalls = 0;

    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ accessToken: "access-1", user: ivan }),
      ),
      http.get("/api/user", () => {
        currentUserCalls++;
        return HttpResponse.json(ivan);
      }),
    );

    const store = createTestStore();

    // Действие: входим, а затем запрашиваем текущего пользователя —
    // так делает любой компонент с useCurrentUser после перехода на главную.
    await store.dispatch(
      userApi.endpoints.login.initiate({ login: "ivan", password: "secret1" }),
    );
    await waitForCachedUser(store);
    const current = await store.dispatch(
      userApi.endpoints.getCurrentUser.initiate(),
    );

    // Проверка: токен в памяти, пользователь взят из кэша,
    // на сервер за ним никто не ходил.
    expect(getAccessToken()).toBe("access-1");
    expect(current.data).toEqual(ivan);
    expect(currentUserCalls).toBe(0);
  });

  it("при неверном пароле не трогает ни токен, ни кэш", async () => {
    server.use(
      http.post("/api/user/login", () =>
        HttpResponse.json({ message: "Неверный пароль" }, { status: 401 }),
      ),
    );

    const store = createTestStore();

    const result = await store.dispatch(
      userApi.endpoints.login.initiate({ login: "ivan", password: "wrong" }),
    );

    expect(result.error).toMatchObject({ status: 401 });
    expect(getAccessToken()).toBeNull();
    expect(cachedCurrentUser(store)).toBeUndefined();
  });
});

describe("register", () => {
  it("после регистрации пользователь сразу считается вошедшим", async () => {
    server.use(
      http.post("/api/user/create", () =>
        HttpResponse.json({ accessToken: "access-1", user: ivan }),
      ),
    );

    const store = createTestStore();

    await store.dispatch(
      userApi.endpoints.register.initiate({
        ...ivan,
        password: "secret123",
      }),
    );

    expect(getAccessToken()).toBe("access-1");
    await waitForCachedUser(store);
  });
});

describe("logout", () => {
  // it.each запускает один и тот же тест для каждой строки таблицы.
  // $status в названии подставится из строки — в отчёте будет два теста:
  // «…ответ сервера 200» и «…ответ сервера 500».
  it.each([
    { status: 200, case: "успешный выход" },
    { status: 500, case: "сервер упал" },
  ])(
    "стирает токен и весь кэш — ответ сервера $status ($case)",
    async ({ status }) => {
      // Подготовка: пользователь вошёл — токен в памяти, он сам в кэше.
      server.use(
        http.post("/api/user/login", () =>
          HttpResponse.json({ accessToken: "access-1", user: ivan }),
        ),
        http.delete("/api/user/logOut", () =>
          HttpResponse.json({}, { status }),
        ),
      );

      const store = createTestStore();
      await store.dispatch(
        userApi.endpoints.login.initiate({ login: "ivan", password: "secret1" }),
      );
      // Убеждаемся, что подготовка удалась, — иначе проверки ниже
      // прошли бы и без всякого выхода.
      await waitForCachedUser(store);

      // Действие
      await store.dispatch(userApi.endpoints.logout.initiate());

      // Проверка: даже если сервер не ответил, в браузере
      // не остаётся ни токена, ни чьих-либо данных.
      expect(getAccessToken()).toBeNull();
      expect(cachedCurrentUser(store)).toBeUndefined();
      expect(store.getState().api.queries).toEqual({});
    },
  );
});
