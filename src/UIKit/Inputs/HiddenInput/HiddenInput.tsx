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
  focusClass?: string;
  isRequired?: boolean;
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
      focusClass,
      isRequired = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className={`relative border rounded outline-inherit ${className}`}>
        <TextInput
          ref={ref}
          className={`m-0 w-full px-3 py-1 h-8 focus:outline-none focus:ring bg-transparent
          rounded-md ${focusClass}`}
          inputType={isOpen ? "text" : "password"}
          placeholder={placeholder}
          register={register}
          value={value}
          onChange={onChange}
          autocomplite={autocomplite}
          useDefaultStyles={false}
        />
        <Button
          title="скрыть/раскрыть"
          type="button"
          className={`shadow-none absolute top-0 p-3 mt-1 right-1 rounded-full eye-btn border
          outline-inherit border-transparent`}
          onClick={() => setIsOpen(!isOpen)}
          bg_color={false}
          changableIconClass={!isOpen ? "eye-open" : "eye-close"}
          defaultMP={false}
        ></Button>
        {isRequired && (
          <span
            style={{
              position: "absolute",
              top: "0px",
              right: "4px",
              color: "red",
              fontWeight: "bold",
            }}
          >
            *
          </span>
        )}
      </div>
    );
  }
);

export default HiddenInput;
