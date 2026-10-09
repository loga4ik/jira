import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./getErrorMessage";

// describe — группа тестов про одну вещь, it — один конкретный случай.
// В отчёте это читается как предложение: «getErrorMessage возвращает undefined, если ошибки нет».
describe("getErrorMessage", () => {
  it("возвращает undefined, если ошибки нет", () => {
    expect(getErrorMessage(undefined)).toBeUndefined();
  });

  it("сообщает о недоступности сервера, если бэкенд не запущен", () => {
    // Подготовка: ошибка ровно в той форме, в какой её отдаёт RTK Query,
    // когда запрос не дошёл до сервера.
    const error = { status: "FETCH_ERROR", error: "TypeError: Failed to fetch" } as const;

    // Действие и проверка: вызываем функцию и сравниваем результат с ожидаемым.
    expect(getErrorMessage(error)).toBe(
      "Сервер недоступен. Проверьте, запущен ли бэкенд"
    );
  });
});
