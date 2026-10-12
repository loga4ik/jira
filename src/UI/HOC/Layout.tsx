import { Suspense, useContext, useEffect } from "react";
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

const AUTH_ROUTES = ["/login", "/register"];

/** Заглушка на время загрузки страницы. role="status" — скринридер её озвучит. */
const PageLoader = () => (
  <p role="status" className="p-3 text-center opacity-60">
    загрузка…
  </p>
);

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  // запрос уходит один раз и кэшируется — useEffect с dispatch(getCookie()) не нужен
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();

  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);

  useEffect(() => {
    // не редиректим, пока статус неизвестен, и не гоняем /login на самого себя
    if (isLoading || currentUser || isAuthRoute) return;
    navigate("/login", { replace: true });
  }, [currentUser, isLoading, isAuthRoute, navigate]);

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
        {location.pathname === "/project" && <UserList />}
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
