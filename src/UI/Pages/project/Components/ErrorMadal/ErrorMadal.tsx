import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { ReactNode } from "react";

type Props = {
  open: boolean;
  closeModal: () => void;
};

export const ErrorMadal: React.FC<Props> = ({ open, closeModal }) => {
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
            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              У вас больше нет доступа к этому проекту
            </DialogTitle>
            <div className="mt-4">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={closeModal}
              >
                окей!
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
