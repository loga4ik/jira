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
  bg_color?: boolean;
  lightShadow?: boolean;
  title: string;
  shadow?: boolean;
};

export const Button: React.FC<Props> = ({
  className,
  changableIconClass,
  onClick,
  children,
  type,
  defaultMP = true,
  defaultBorder = true,
  bg_color = true,
  lightShadow = false,
  shadow = true,
  title,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <button
        title={title}
        type={type}
        className={`
        ${defaultMP && "mx-2 my-4 px-5 py-1"} 
        ${defaultBorder && "border border-gray-200 outline-inherit rounded-md"} 
        ${
          changableIconClass
            ? theme !== "dark"
              ? changableIconClass + "_light"
              : changableIconClass + "_dark"
            : ""
        } 
        ${
          theme === "dark" && shadow
            ? `dark_out_small  ${
                bg_color ? "bg-gray-700 text-gray-300" : " bg-inherit"
              }`
            : `light_out_small  ${
                bg_color ? "bg-gray-300 text-gray-600" : " bg-inherit"
              }`
        }
        ${
          theme === "dark"
            ? `${bg_color ? "bg-gray-700 text-gray-300" : " bg-inherit"}`
            : `${bg_color ? "bg-gray-300 text-gray-600" : " bg-inherit"}`
        }
        ${lightShadow && "light_out_small"}        
        ${
          !shadow &&
          "shadow-none border border-gray-200 outline-inherit rounded-md"
        }
        back-image-center ${className}`}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
