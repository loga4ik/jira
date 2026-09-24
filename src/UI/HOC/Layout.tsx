import { useContext, useEffect } from "react";
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
        {location.pathname === "/register" && !currentUser?.login && (
          <Button
            title="вход"
            type="button"
            className="form_btn-navigate"
            defaultMP={false}
            bg_color={false}
          >
            <NavLink
              className={`form_btn-navigate ${
                theme === "dark" && "dark_out_small  text_dark"
              } p-3`}
              to={"login"}
            >
              уже есть аккаунт
            </NavLink>
          </Button>
        )}
        {location.pathname === "/login" && !currentUser?.login && (
          <Button
            title="регистрация"
            type="button"
            className="form_btn-navigate"
            defaultMP={false}
            bg_color={false}
          >
            <NavLink
              className={`form_btn-navigate ${
                theme === "dark" && "dark_out_small text_dark"
              } p-3`}
              to={"register"}
            >
              зарегистрироваться
            </NavLink>
          </Button>
        )}
      </header>
      <Outlet />
    </div>
  );
};
