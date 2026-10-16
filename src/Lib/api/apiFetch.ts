import { getAccessToken, refreshAccessToken } from "./userApi/authToken";

/**
 * fetch с access-токеном и одной повторной попыткой после обновления токена.
 * Остался только у истории чата (ChatBoard) — уйдёт, когда чат
 * переедет на RTK Query (getMessages с WebSocket в onCacheEntryAdded).
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
