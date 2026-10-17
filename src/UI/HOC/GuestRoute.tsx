import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../Hooks/useCurrentUser";
import { getSafeReturnPath } from "../../features/auth/returnPath";

/**
 * Страницы только для гостей — вход и регистрация.
 * Вошедшего пользователя отправляет туда, куда он шёл (?from=…), иначе на главную.
 *
 * Пока статус неизвестен, страница показывается как есть, а не пустой
 * экран: иначе после нажатия «войти» форма на мгновение размонтировалась
 * бы посреди отправки (пользователь кладётся в кэш асинхронно).
 *
 * Работает и как обёртка (<GuestRoute><Login /></GuestRoute>), и как
 * макетный маршрут в App — тогда рисует <Outlet />, как ProtectedRoute.
 */
export const GuestRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated } = useCurrentUser();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={getSafeReturnPath(location.search) ?? "/"} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
