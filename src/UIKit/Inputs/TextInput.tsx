import { Field, Input } from "@headlessui/react";
import { InputMask } from "@react-input/mask";
import { ChangeEventHandler, ReactNode, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";
type Props = {
  inputType: "text" | "password" | "masked" | "textarea";
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  children?: ReactNode;
  register?: UseFormRegisterReturn;
  useDefaultStyles?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
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
      "border m-2 px-3 py-1 rounded-md outline-inherit border-gray-200";
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
    } else if (inputType === "textarea") {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>} // Преобразуем ref для textarea
          className={`${useDefaultStyles && defaultClassNames} ${className}`}
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
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
      // <div className="w-full max-w-md px-4">
      //   <Field>
      //     <Input
      //      className={clsx(
      //       'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
      //       'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
      //     )}
      //     />
      //   </Field>
      // </div>
    );
  }
);

export default TextInput;
