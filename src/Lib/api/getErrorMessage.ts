import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** То, что лежит в поле error у хуков RTK Query. */
export type ApiError = FetchBaseQueryError | SerializedError | undefined;

/** Свой текст на конкретный HTTP-статус: { 401: "Неверный логин или пароль" }. */
export type StatusMessages = Partial<Record<number, string>>;

const DEFAULT_FALLBACK = "Что-то пошло не так. Попробуйте ещё раз";
const SERVER_MESSAGE = "Ошибка на сервере. Попробуйте позже";
const OFFLINE_MESSAGE = "Сервер недоступен. Проверьте, запущен ли бэкенд";
const TIMEOUT_MESSAGE = "Сервер не ответил вовремя";

const isFetchBaseQueryError = (
  error: NonNullable<ApiError>,
): error is FetchBaseQueryError => "status" in error;

/** Текст из тела ответа: строка как есть, объект — по полю message. */
const readBody = (data: unknown): string | undefined => {
  if (typeof data === "string" && data.trim()) return data.trim();

  if (data && typeof data === "object" && "message" in data) {
    const { message } = data as { message: unknown };

    if (typeof message === "string" && message.trim()) return message.trim();
  }

  return undefined;
};

const fromHttpStatus = (
  status: number,
  data: unknown,
  statusMessages: StatusMessages,
  fallback: string,
): string => {
  const known = statusMessages[status];
  if (known) return known;

  // Шлюзовые коды означают, что до бэкенда не достучались: в проде так ответит
  // nginx, в разработке — vite-прокси (см. его настройку в vite.config.ts).
  if (status === 502 || status === 503 || status === 504)
    return OFFLINE_MESSAGE;

  // На 5xx бэк отдаёт объект ошибки Sequelize целиком (res.status(500).json(err)) —
  // в интерфейс такое не показываем, только в консоль при разработке.
  if (status >= 500) {
    console.error("Ответ сервера:", data);
    return SERVER_MESSAGE;
  }

  return readBody(data) ?? fallback;
};

/**
 * Приводит любую ошибку RTK Query к строке для пользователя.
 * Возвращает undefined, если ошибки нет — чтобы в разметке писать
 * {message && <p>{message}</p>}.
 */
export const getErrorMessage = (
  error: ApiError,
  statusMessages: StatusMessages = {},
  fallback: string = DEFAULT_FALLBACK,
): string | undefined => {
  if (!error) return undefined;

  // Исключение вне baseQuery (например, брошенное в onQueryStarted).
  if (!isFetchBaseQueryError(error)) return error.message?.trim() || fallback;

  switch (error.status) {
    case "FETCH_ERROR":
      return OFFLINE_MESSAGE;

    case "TIMEOUT_ERROR":
      return TIMEOUT_MESSAGE;

    case "CUSTOM_ERROR":
      return readBody(error.data) ?? error.error ?? fallback;

    // Тело не распарсилось: настоящий код лежит в originalStatus,
    // а в data — сырой текст ответа.
    case "PARSING_ERROR":
      return fromHttpStatus(
        error.originalStatus,
        error.data,
        statusMessages,
        fallback,
      );

    default:
      return fromHttpStatus(error.status, error.data, statusMessages, fallback);
  }
};
