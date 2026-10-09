import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../../Hooks/useCurrentUser";

/**
 * Страницы только для гостей — вход и регистрация.
 * Вошедшего пользователя отправляет на главную.
 *
 * Пока статус неизвестен, страница показывается как есть, а не пустой
 * экран: иначе после нажатия «войти» форма на мгновение размонтировалась
 * бы посреди отправки (пользователь кладётся в кэш асинхронно).
 */
export const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useCurrentUser();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};
