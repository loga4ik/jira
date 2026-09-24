import { useGetCurrentUserQuery } from "../Lib/api/userApi";

/**
 * Текущий пользователь. Замена селектору state.user.currentUser:
 * RTK Query дедуплицирует запросы, поэтому хук можно звать
 * в любом количестве компонентов — сетевой запрос будет один.
 */
export const useCurrentUser = () => {
  const { data, isLoading } = useGetCurrentUserQuery();

  return {
    currentUser: data ?? undefined,
    isLoading,
    isAuthenticated: Boolean(data),
  };
};
