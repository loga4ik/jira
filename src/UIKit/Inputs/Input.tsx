import { InputMask } from "@react-input/mask";
import { ChangeEventHandler, ReactNode, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  inputType: "text" | "password" | "masked";
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
  register?: UseFormRegisterReturn;
  useDefaultStyles?: boolean;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      inputType,
      className,
      placeholder,
      register,
      value,
      onChange,
      useDefaultStyles = true,
    },
    ref
  ) => {
    const defaultClassNames =
      "border m-2 px-3 py-1 h-8 rounded-md outline-inherit border-gray-200";
    if (inputType === "masked") {
      return (
        <InputMask
          mask="+7(___)-___-__-__"
          replacement={{ _: /\d/ }}
          placeholder={placeholder}
          className={`${className} ${defaultClassNames}`}
          {...register}
        />
      );
    }
    return (
      <input
        ref={ref}
        className={`${useDefaultStyles && defaultClassNames} ${className}`}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...register}
      />
    );
  }
);

export default Input;
