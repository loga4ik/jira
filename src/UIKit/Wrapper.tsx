import React, { ReactNode, useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

type props = {
  className?: string;
  itemKey?: string;
  children: ReactNode;
  onClick?: () => void;
  lightShadow?: boolean;
  shadow?: boolean;
};

export const Wrapper: React.FC<props> = ({
  children,
  className,
  itemKey,
  onClick,
  lightShadow = false,
  shadow = true,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      key={itemKey}
      className={`${theme}_out_big ${lightShadow && "light_out_big"} 
        ${!shadow && "shadow-none border border-gray-200 outline-inherit rounded-md bg-gray-600"}
      ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
