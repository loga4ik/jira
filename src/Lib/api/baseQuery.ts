import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getAccessToken, refreshAccessToken } from "./userApi/authToken";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  // Бэк отвечает то JSON (res.json), то текстом (res.send). Дефолтный "json"
  // на тексте падает и подменяет честный код ответа на PARSING_ERROR,
  // а этот режим смотрит Content-Type и выбирает парсер сам.
  responseHandler: "content-type",
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/** Маршруты, где 401 значит «неверные данные», а не «протух токен». */
const AUTH_ENDPOINTS = ["/user/login", "/user/create", "/user/refresh"];

const urlOf = (args: string | FetchArgs) =>
  typeof args === "string" ? args : args.url;

/** Ответ «не авторизован» без похода на сервер. */
const UNAUTHORIZED: { error: FetchBaseQueryError } = {
  error: { status: 401, data: { message: "Требуется вход" } },
};

/**
 * Базовый запрос с автоматическим обновлением токена.
 *
 * Токена нет (открыли страницу или нажали F5) — сначала пробуем
 * восстановить его по refresh-куке. Не вышло — пользователь гость,
 * и сам запрос не отправляем: он гарантированно получил бы 401.
 * Так у гостя уходит один запрос (/refresh) вместо двух.
 *
 * Токен есть, но сервер ответил 401 (access протух) — обновляем
 * и повторяем исходный запрос один раз.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isAuthEndpoint = AUTH_ENDPOINTS.includes(urlOf(args));

  if (!getAccessToken() && !isAuthEndpoint) {
    if (!(await refreshAccessToken())) return UNAUTHORIZED;
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isAuthEndpoint) {
    if (await refreshAccessToken()) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
