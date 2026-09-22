import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserLoginData, UserReg, UserType } from "../../types/UserTypes";

/** То, что реально нужно интерфейсу: всё, кроме пароля. */
export type AuthUser = Omit<UserType, "password">;

/**
 * Весь user API описан здесь декларативно.
 * Хуки (useLoginMutation и т.д.) генерируются автоматически,
 * состояния загрузки, кэш и инвалидация — тоже.
 */
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/user",
    credentials: "include",
  }),
  tagTypes: ["CurrentUser", "Users"],
  endpoints: (builder) => ({
    /** Кто сейчас залогинен. Сервер отдаёт null, если сессии нет. */
    getCurrentUser: builder.query<AuthUser | null, void>({
      query: () => "/",
      // upsertQueryData ниже кладёт данные в кэш сам, но тег оставляем:
      // он позволяет протухнуть этому кэшу извне (правка профиля, refresh токена).
      providesTags: ["CurrentUser"],
    }),

    getUsers: builder.query<AuthUser[], void>({
      query: () => "/getAllUsers",
      providesTags: ["Users"],
    }),

    login: builder.mutation<AuthUser, UserLoginData>({
      query: (body) => ({ url: "/login", method: "POST", body }),
      // Ответ login — тот же AuthUser, что вернул бы getCurrentUser.
      // Кладём его в кэш сами, вместо лишнего запроса по invalidatesTags.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(cacheCurrentUser(data));
        } catch {
          // неверный логин или пароль — ошибку покажет форма
        }
      },
    }),

    register: builder.mutation<AuthUser, UserReg>({
      query: (body) => ({ url: "/create", method: "POST", body }),
      // Та же причина, что и в login — не тратим лишний запрос на getCurrentUser.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(cacheCurrentUser(data));
        } catch {
          // занятый логин или ошибка сервера — ошибку покажет форма
        }
      },
    }),

    logout: builder.mutation<unknown, void>({
      query: () => ({ url: "/logOut", method: "DELETE" }),
      // Чистим весь кэш целиком, а не только текущего пользователя:
      // после выхода в памяти не должно остаться ничьих данных.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userApi.util.resetApiState());
        } catch {
          // сессия всё равно протухнет на сервере
        }
      },
    }),
  }),
});

/** Положить пользователя (или его отсутствие) в кэш getCurrentUser без запроса. */
const cacheCurrentUser = (user: AuthUser | null) =>
  userApi.util.upsertQueryData("getCurrentUser", undefined, user);

export const {
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = userApi;
