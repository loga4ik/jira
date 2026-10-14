import { getAccessToken, refreshAccessToken } from "./authToken";

/**
 * fetch с access-токеном и одной повторной попыткой после обновления токена.
 * Временная обёртка для старого project API на ручных fetch —
 * уйдёт вместе с его переводом на RTK Query.
 */
export const apiFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  const withAuth = (): RequestInit => {
    const headers = new Headers(init.headers);
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return { ...init, headers };
  };

  const response = await fetch(input, withAuth());
  if (response.status !== 401 || !(await refreshAccessToken())) {
    return response;
  }
  return fetch(input, withAuth());
};

/**
 * Понятный текст ошибки из ответа сервера: сообщение бэка ({ message }),
 * а если его нет — по коду. Для 403 бэк отвечает «Нет доступа к проекту».
 */
export const readApiError = async (response: Response): Promise<string> => {
  try {
    const body = await response.clone().json();
    if (body && typeof body.message === "string") return body.message;
  } catch {
    // тело не JSON — ниже ответ по коду
  }
  if (response.status === 403) return "Нет доступа к проекту";
  if (response.status === 404) return "Не найдено";
  return "Ошибка сервера. Попробуйте позже";
};
