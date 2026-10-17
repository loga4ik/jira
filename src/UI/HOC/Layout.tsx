import { Suspense, useContext } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { ThemeSwitcher } from "../../UIKit/themeSwicher/ThemeSwitcher";
import { Button } from "../../UIKit/Inputs/Button/Button";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "../../Lib/api/userApi";
import UserList from "../Pages/project/Components/UserList/UserList";
import { PageLoader } from "../../UIKit/PageLoader";

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  // запрос уходит один раз и кэшируется — useEffect с dispatch(getCookie()) не нужен
  const { data: currentUser } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();

  // Кого куда пускать, решают маршруты (ProtectedRoute, GuestRoute),
  // а Layout только рисует шапку и место под страницу.

  // Внешний вид прежней кнопки-обёртки, перенесённый на саму ссылку.
  const authLinkClass = `form_btn-navigate block px-3 py-1 rounded-md border border-gray-200 ${
    theme === "dark" ? "dark_out_small text_dark" : "light_out_small"
  }`;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`full-screen-wrapper box-border p-3 ${
        theme === "dark" ? "bg_dark text_dark" : "text_light"
      }`}
    >
      <header className="header">
        <ThemeSwitcher />
        {location.pathname.startsWith("/project/") && <UserList />}
        {currentUser?.login && (
          <Button
            title="выход"
            type="button"
            className="form_btn-navigate px-3"
            defaultMP={false}
            onClick={handleLogout}
            bg_color={false}
          >
            {`выйти: ${currentUser.login}`}
          </Button>
        )}
        {/* Ссылка, а не кнопка со ссылкой внутри: вложенные интерактивные
            элементы недопустимы — скринридер и Tab видели бы два элемента
            вместо одного, и непонятно, какой из них срабатывает. */}
        {location.pathname === "/register" && !currentUser?.login && (
          <NavLink className={authLinkClass} to="/login">
            уже есть аккаунт
          </NavLink>
        )}
        {location.pathname === "/login" && !currentUser?.login && (
          <NavLink className={authLinkClass} to="/register">
            зарегистрироваться
          </NavLink>
        )}
      </header>
      {/* Suspense внутри Layout, а не вокруг всего приложения: пока
          качается файл страницы, шапка и тема остаются на экране,
          а заглушка появляется только на месте контента. */}
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};
