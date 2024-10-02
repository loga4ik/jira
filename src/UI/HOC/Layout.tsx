import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";
import { AppDispatch, RootState } from "../../Lib/store";
import { ThemeContext } from "../../Context/ThemeContext";
import { ThemeSwitcher } from "../../UIKit/themeSwicher/ThemeSwitcher";
import { Button } from "../../UIKit/Inputs/Button/Button";
import { getCookie, logOut } from "../../Lib/Slices/userSlice/userApi";

export const Layout = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      const query = await dispatch(getCookie());
      !query.payload && navigate("/login");
    })();
  }, [dispatch]);

  const LogOut = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div
      className={`full-screen-wrapper box-border p-3 ${
        theme === "dark" ? "bg_dark text_dark" : "text_light"
      }`}
    >
      <header className="header">
        <ThemeSwitcher />
        {currentUser?.login && (
          <Button
            type="button"
            className={"form_btn-navigate px-3"}
            defaultMP={false}
            onClick={LogOut}
          >
            {`выйти: ${currentUser.login}`}
          </Button>
        )}
        {location.pathname === "/register" && !currentUser?.login && (
          <Button
            type="button"
            className={"form_btn-navigate px-3"}
            defaultMP={false}
          >
            <NavLink
              className={`form_btn-navigate ${
                theme === "dark" && "dark_out_small  text_dark"
              }`}
              to={"login"}
            >
              уже есть аккаунт
            </NavLink>
          </Button>
        )}
        {location.pathname === "/login" && !currentUser?.login && (
          <Button
            type="button"
            className={"form_btn-navigate px-3"}
            defaultMP={false}
          >
            <NavLink
              className={`form_btn-navigate ${
                theme === "dark" && "dark_out_small text_dark"
              }`}
              to={"register"}
            >
              зарегистрироваться
            </NavLink>
          </Button>
        )}
      </header>
      {/* <div className="flex justify-center"> */}
      <Outlet />
      {/* </div> */}
    </div>
  );
};
