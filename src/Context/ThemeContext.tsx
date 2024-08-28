import React, { createContext, useState, ReactNode } from "react";

interface ThemeContextType {
  // theme: boolean;
  theme: "light" | "dark";
  setTheme: (value: "light" | "dark") => void;
}
// export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContextWrapper: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const localTheme = localStorage.getItem("theme");
  const initialTheme =
    localTheme === "light" || localTheme === "dark" ? localTheme : "light";

  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
