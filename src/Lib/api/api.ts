import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

/**
 * Один API на всё приложение — так рекомендует RTK Query: один кэш,
 * один middleware и общие теги. Поэтому мутация в одном файле может
 * сбросить кэш запроса из другого (создали проект → список проектов
 * перезапросится сам).
 *
 * Эндпоинты добавляются в отдельных файлах через injectEndpoints:
 * userApi.ts — пользователь и вход, projectApi.ts — проекты, задачи, команда.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CurrentUser", "Project", "Tasks", "Team"],
  // Вернулся на вкладку или появилась сеть — данные, на которые кто-то
  // подписан, перезапрашиваются: задачи могли поменять другие участники.
  // Работает вместе с setupListeners в store.ts.
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
