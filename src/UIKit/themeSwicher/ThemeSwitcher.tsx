import React, { useContext, useEffect } from "react";
import "./ThemeSwitcher.css";
import { ThemeContext } from "../../Context/ThemeContext";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
export const ThemeSwitcher = () => {
  const { localStorageValue, setItem } = useLocalStorage("theme", "light");
  const { theme, setTheme } = useContext(ThemeContext);

  const changeTheme = () => {
    setItem(localStorageValue === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (localStorageValue === "light" || localStorageValue === "dark") {
      setTheme(localStorageValue);
    }
  }, [localStorageValue]);

  return (
    <button
      className={`switch_btn ${
        theme === "dark" && "dark_out_small flex_reverse"
      }`}
      onClick={() => changeTheme()}
    >
      <p className={`switcher_text ${theme === "dark" && "text_dark"}`}>
        {theme === "dark" ? "Dark" : "Light"}
      </p>
      <span
        className={`switch_icon ${theme === "dark" ? "dark bg_dark" : "light"}`}
      />
    </button>
  );
};
