import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const Modal: React.FC<Props> = ({ children }) => {
  return <div className="">{children}</div>;
};

export default Modal;
