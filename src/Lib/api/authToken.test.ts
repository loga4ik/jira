import { beforeEach, describe, expect, it } from "vitest";
import { delay, http, HttpResponse } from "msw";
import { server } from "../../test/server";
import {
  getAccessToken,
  refreshAccessToken,
  setAccessToken,
} from "./authToken";

beforeEach(() => {
  setAccessToken(null);
});

describe("refreshAccessToken", () => {
  it("вызовы во время идущего обновления ждут его, а не шлют свой /refresh", async () => {
    // Подготовка: refresh отвечает не сразу, а через 50 мс — как настоящий
    // сервер, которому нужно сходить в базу. Это окно, в которое попадают
    // остальные запросы страницы со своими 401.
    let refreshCalls = 0;

    server.use(
      http.post("/api/user/refresh", async () => {
        refreshCalls++;
        await delay(50);
        return HttpResponse.json({ accessToken: "new-token" });
      }),
    );

    // Действие: первый запрос получил 401 и начал обновление.
    const first = refreshAccessToken();

    // Через 10 мс 401 получают ещё два запроса. Обновление в этот момент
    // ещё в пути (ответ придёт на 50-й мс) — они должны к нему присоединиться.
    // delay здесь — просто пауза в тесте, тот же delay из msw.
    await delay(10);
    const second = refreshAccessToken();
    const third = refreshAccessToken();

    // Promise.all ждёт, пока завершатся все три.
    const results = await Promise.all([first, second, third]);

    // Проверка: все трое получили «успех», а сервер видел один запрос.
    expect(results).toEqual([true, true, true]);
    expect(refreshCalls).toBe(1);
    expect(getAccessToken()).toBe("new-token");
  });

  it("после завершения следующий вызов делает новый refresh", async () => {
    // Общий промис должен жить только пока идёт запрос.
    // Если его забыть обнулить, все будущие refresh вернут старый
    // результат, и через 15 минут (время жизни access) сессия умрёт.
    let refreshCalls = 0;

    server.use(
      http.post("/api/user/refresh", () => {
        refreshCalls++;
        return HttpResponse.json({ accessToken: `token-${refreshCalls}` });
      }),
    );

    // Действие: два вызова строго по очереди — второй после окончания первого.
    await refreshAccessToken();
    await refreshAccessToken();

    // Проверка: каждый сходил на сервер, в памяти токен из второго ответа.
    expect(refreshCalls).toBe(2);
    expect(getAccessToken()).toBe("token-2");
  });

  it("если сервер отказал, все ожидающие получают false", async () => {
    server.use(
      http.post("/api/user/refresh", async () => {
        await delay(50);
        return new HttpResponse(null, { status: 401 });
      }),
    );

    setAccessToken("old-token");

    const results = await Promise.all([
      refreshAccessToken(),
      refreshAccessToken(),
    ]);

    // Никто не должен решить, что токен обновился,
    // и протухший токен не должен остаться в памяти.
    expect(results).toEqual([false, false]);
    expect(getAccessToken()).toBeNull();
  });
});
