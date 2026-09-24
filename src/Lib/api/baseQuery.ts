import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getAccessToken, refreshAccessToken } from "./authToken";

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

/**
 * Базовый запрос с автоматическим обновлением токена: получили 401 —
 * обновляем access по refresh-куке и повторяем исходный запрос один раз.
 * Он же поднимает сессию после перезагрузки страницы: первый запрос
 * уходит без токена, получает 401, и токен восстанавливается здесь.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !AUTH_ENDPOINTS.includes(urlOf(args))) {
    if (await refreshAccessToken()) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
