import React, { BaseSyntheticEvent, ReactNode, useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";

type props = {
  className?: string;
  changableIconClass?: string;
  defaultMP?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement> | BaseSyntheticEvent
  ) => void;
  children?: ReactNode;
  type: "submit" | "button";
};

export const Button: React.FC<props> = ({
  className,
  changableIconClass,
  onClick,
  children,
  type,
  defaultMP = true,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <button
        type={type}
        className={`${className} ${defaultMP && "mx-2 my-4 px-5 py-1"} 
        w-fit border-gray-100 outline-inherit rounded-md ${
          changableIconClass
            ? theme !== "dark"
              ? changableIconClass + "_light"
              : changableIconClass + "_dark"
            : ""
        } ${
          theme === "dark"
            ? "dark_out_small text_dark"
            : "light_out_small text_light"
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
