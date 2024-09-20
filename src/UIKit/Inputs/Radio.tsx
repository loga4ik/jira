import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
type Props = {
  label: string;
  value: number;
  register?: UseFormRegisterReturn;
};

export const Radio: React.FC<Props> = ({ label, value, register }) => {
  return (
    <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
      <input
        className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 checked:border-blue-400 checked:bg-blue-400 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_10px_transparent] before:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_10px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_10px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_10px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-blue-400 dark:checked:bg-blue-400 dark:focus:before:shadow-[0px_0px_0px_10px_rgba(255,255,255,0.4)]"
        type="radio"
        value={value}
        defaultChecked={false}
        {...register}
      />
      <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
        {label}
      </label>
    </div>
  );
};
