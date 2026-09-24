import { createApi } from "@reduxjs/toolkit/query/react";
import type { UserLoginData, UserReg, UserType } from "../../types/UserTypes";
import { baseQueryWithReauth } from "./baseQuery";
import { setAccessToken } from "./authToken";

/** То, что реально нужно интерфейсу: всё, кроме пароля. */
export type AuthUser = Omit<UserType, "password">;

/** Ответ входа, регистрации и обновления: access-токен в теле, refresh — в httpOnly-куке. */
export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

/**
 * Весь user API описан здесь декларативно.
 * Хуки (useLoginMutation и т.д.) генерируются автоматически,
 * состояния загрузки, кэш и инвалидация — тоже.
 */
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["CurrentUser", "Users"],
  endpoints: (builder) => ({
    /**
     * Кто сейчас залогинен. Без сессии сервер отвечает 401 —
     * тогда baseQueryWithReauth пробует refresh-куку и повторяет запрос.
     */
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/user",
      // upsertQueryData ниже кладёт данные в кэш сам, но тег оставляем:
      // он позволяет протухнуть этому кэшу извне (например, после правки профиля).
      providesTags: ["CurrentUser"],
    }),

    getUsers: builder.query<AuthUser[], void>({
      query: () => "/user/getAllUsers",
      providesTags: ["Users"],
    }),

    login: builder.mutation<AuthResponse, UserLoginData>({
      query: (body) => ({ url: "/user/login", method: "POST", body }),
      // Ответ login уже содержит пользователя — кладём его в кэш getCurrentUser
      // сами, вместо лишнего запроса по invalidatesTags.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setAccessToken(data.accessToken);
          dispatch(cacheCurrentUser(data.user));
        } catch {
          // неверный логин или пароль — ошибку покажет форма
        }
      },
    }),

    register: builder.mutation<AuthResponse, UserReg>({
      query: (body) => ({ url: "/user/create", method: "POST", body }),
      // Та же причина, что и в login — не тратим лишний запрос на getCurrentUser.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setAccessToken(data.accessToken);
          dispatch(cacheCurrentUser(data.user));
        } catch {
          // занятый логин или ошибка сервера — ошибку покажет форма
        }
      },
    }),

    logout: builder.mutation<unknown, void>({
      query: () => ({ url: "/user/logOut", method: "DELETE" }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
          // даже если сервер недоступен, локально из сессии выходим
        } finally {
          // Чистим токен и весь кэш целиком, а не только текущего пользователя:
          // после выхода в памяти не должно остаться ничьих данных.
          setAccessToken(null);
          dispatch(userApi.util.resetApiState());
        }
      },
    }),
  }),
});

/** Положить пользователя в кэш getCurrentUser без запроса. */
const cacheCurrentUser = (user: AuthUser) =>
  userApi.util.upsertQueryData("getCurrentUser", undefined, user);

export const {
  useGetCurrentUserQuery,
  useGetUsersQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = userApi;
