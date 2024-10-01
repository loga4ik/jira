import { Description, Field, Input, Transition } from "@headlessui/react";
// import { Input } from "@material-tailwind/react";
import {
  ChangeEventHandler,
  CSSProperties,
  forwardRef,
  ReactNode,
} from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  inputType: "text" | "password" | "masked" | "textarea";
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  children?: ReactNode;
  register?: UseFormRegisterReturn;
  useDefaultStyles?: boolean;
  style?: CSSProperties;
  error?: FieldError | false;
};
const TextInputWithErr = forwardRef<HTMLInputElement, Props>(
  (
    {
      inputType,
      placeholder,
      register,
      value,
      onChange,
      style,
      error,
      className,
    },
    ref
  ) => {
    console.log(error);

    return (
      <div className={defaultClassNames}>
        <Transition show={!!error.message}>
          <Description className="text-sm/6 text-white/50">
            обязательное поле
          </Description>
        </Transition>
        <Input
          ref={ref}
          className={`${useDefaultStyles && defaultClassNames} ${className}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={style}
          {...register}
        />
      </div>
    );
  }
);
export default TextInputWithErr;

// <div className={defaultClassNames}>
//   <Transition show={!!error.message}>
//     <Description className="text-sm/6 text-white/50">
//       обязательное поле
//     </Description>
//   </Transition>
//   <Input
//     ref={ref}
//     className={`${useDefaultStyles && defaultClassNames} ${className}`}
//     type={inputType}
//     placeholder={placeholder}
//     value={value}
//     onChange={onChange}
//     style={style}
//     {...register}
//   />
// </div>
