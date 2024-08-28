import { useContext, useEffect } from "react";
import { ThemeContext } from "../Context/ThemeContext";

export const useThemeContext = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, changeTheme };
};

// use local storage

// возвращаем состояние и func изменения состояния
// передаем ключ и значение по умолчанию