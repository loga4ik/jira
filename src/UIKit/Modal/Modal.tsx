import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  closeModal: () => void;
};

const Modal: React.FC<Props> = ({ children, closeModal }) => {
  const closeClickHandler = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="relative z-10">
      <div
        className="fixed inset-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center"
        onClick={closeClickHandler}
      >
        <div className="min-w-96 min-h-96 max-h-screen my-5  bg-gray-200 border-2 border-gray-300 rounded-xl p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
