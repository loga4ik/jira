import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../Hooks/useCurrentUser";
import { loginPathWithReturn } from "../../features/auth/returnPath";
import { PageLoader } from "../../UIKit/PageLoader";

/**
 * Маршруты только для вошедших — главная и страница проекта.
 *
 * Раньше это делал эффект в Layout: страница сначала рисовалась,
 * отправляла свои запросы (и получала 401), а уже потом эффект уводил
 * гостя на вход. Теперь решение принимается до рендера страницы:
 * гость её не увидит и её запросы не уйдут.
 *
 * Это «макетный» маршрут: в App он оборачивает дочерние <Route>,
 * а сам рисует <Outlet /> — то место, куда React Router подставит
 * подходящую дочернюю страницу.
 */
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useCurrentUser();
  const location = useLocation();

  // пока не ясно, вошёл ли пользователь (идёт обновление токена
  // и запрос /api/user), — не рисуем страницу и не уводим
  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    // запоминаем, куда шёл гость, — после входа вернём его туда
    return <Navigate to={loginPathWithReturn(location)} replace />;
  }

  return <Outlet />;
};
