import React, { BaseSyntheticEvent, ReactNode, useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import "./Button.css";

type Props = {
  className?: string;
  changableIconClass?: string;
  defaultMP?: boolean;
  defaultBorder?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement> | BaseSyntheticEvent
  ) => void;
  children?: ReactNode;
  type: "submit" | "button";
};

export const Button: React.FC<Props> = ({
  className,
  changableIconClass,
  onClick,
  children,
  type,
  defaultMP = true,
  defaultBorder = true,
}) => {
  const { theme } = useContext(ThemeContext);
  // console.log(changableIconClass);

  return (
    <>
      <button
        type={type}
        className={`
        ${defaultMP && "mx-2 my-4 px-5 py-1"} 
        ${defaultBorder && "border-gray-100 outline-inherit rounded-md"} 
        ${
          changableIconClass
            ? theme !== "dark"
              ? changableIconClass + "_light"
              : changableIconClass + "_dark"
            : ""
        } ${
          theme === "dark"
            ? "dark_out_small text_dark"
            : "light_out_small text_light"
        } 
        ${className} 
        back-image-center`}
        // w-fit
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
