import { ChangeEventHandler, forwardRef, ReactNode, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import "./HiddenInput.css";
import TextInput from "../TextInput";
import { Button } from "../Button/Button";
type Props = {
  inputType: "text" | "password" | "masked";
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
  register?: UseFormRegisterReturn;
  autocomplite?: string;
};

const HiddenInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      placeholder,
      register,
      value,
      onChange,
      autocomplite,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div
        className={`${className} relative border my-2 mx-2 rounded outline-inherit border-gray-200`}
      >
        <TextInput
          ref={ref}
          className="m-0 w-full px-3 py-1 h-8"
          inputType={isOpen ? "text" : "password"}
          placeholder={placeholder}
          register={register}
          value={value}
          onChange={onChange}
          autocomplite={autocomplite}
          useDefaultStyles={false}
        />
        <Button
          type="button"
          className="shadow-none absolute top-0 p-3 mt-0.5 right-2 rounded-full eye-btn border
          outline-inherit border-gray-300"
          onClick={() => setIsOpen(!isOpen)}
          changableIconClass={!isOpen ? "eye-open" : "eye-close"}
          defaultMP={false}
        ></Button>
      </div>
    );
  }
);

export default HiddenInput;
