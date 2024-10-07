import React, { ReactNode, useContext } from "react";
import { ThemeContext } from "../Context/ThemeContext";

type props = {
  className?: string;
  itemKey?: string;
  children: ReactNode;
  onClick?: () => void;
  lightShadow?: boolean;
};

export const Wrapper: React.FC<props> = ({
  children,
  className,
  itemKey,
  onClick,
  lightShadow = false,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      key={itemKey}
      className={`${theme}_out_big ${
        lightShadow && "light_out_big"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
