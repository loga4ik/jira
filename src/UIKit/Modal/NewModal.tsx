import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  open: boolean;
  closeModal: () => void;
};

export const NewModal: React.FC<Props> = ({ children, open, closeModal }) => {
  return (
    <Dialog open={open} onClose={closeModal} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in "
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-transparent backdrop-blur text-left shadow-xl transition-all data-[closed]:translate-y-4
            data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in 
            sm:max-w-screen-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 flex justify-center border border-gray-200
            min-h-48 min-w-36 overflow-y-clip"
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
