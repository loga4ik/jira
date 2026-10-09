// Добавляет в expect проверки для DOM: toBeInTheDocument, toBeDisabled,
// toHaveTextContent и другие. Без этого импорта их бы не было.
import "@testing-library/jest-dom/vitest";

import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./server";

// В браузере fetch("/api/user") сам достраивает адрес до http://localhost/api/user.
// В тестах fetch и Request — из Node, а Node относительных адресов не понимает
// и падает с «Failed to parse URL». Подменяем Request так, чтобы строковый адрес
// достраивался от window.location, как в браузере. Код приложения не меняется.
const NodeRequest = globalThis.Request;
globalThis.Request = class extends NodeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(
      typeof input === "string" ? new URL(input, window.location.href) : input,
      init,
    );
  }
};

// Запускаем поддельный сервер один раз на файл.
// onUnhandledRequest: "error" — если код сделал запрос, для которого тест
// не задал ответ, тест упадёт. Так не пропустить неожиданный запрос.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  // убираем всё, что тест отрисовал, иначе оно мешало бы следующему
  cleanup();
  // и обработчики, добавленные через server.use, — у каждого теста свои
  server.resetHandlers();
});

afterAll(() => server.close());
