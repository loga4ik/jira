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
