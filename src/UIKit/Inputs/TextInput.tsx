import { InputMask } from "@react-input/mask";
import {
  CSSProperties,
  ChangeEventHandler,
  ReactNode,
  forwardRef,
  useContext,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { ThemeContext } from "../../Context/ThemeContext";

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
  autocomplite?: string;
  isRequired?: boolean;
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
      style,
      autocomplite,
      isRequired = false,
    },
    ref
  ) => {
    // const { theme } = useContext(ThemeContext);
    const defaultClassNames =
      "border m-2 px-3 py-1 rounded-md outline-inherit border-gray-200 bg-transparent";

    if (inputType === "masked") {
      return (
        <div>
          <InputMask
            mask="+7(___)-___-__-__"
            replacement={{ _: /\d/ }}
            placeholder={placeholder}
            className={`${className} ${defaultClassNames}`}
            autoComplete={autocomplite}
            {...register}
          />
          {isRequired && (
            <span
              style={{
                position: "absolute",
                // top: "-10px",
                right: "12px",
                color: "red",
                fontWeight: "bold",
              }}
            >
              *
            </span>
          )}
        </div>
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
      <div>
        <input
          ref={ref}
          className={`${useDefaultStyles && defaultClassNames} ${className}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={style}
          autoComplete={autocomplite}
          {...register}
        />
        {isRequired && (
          <span
            style={{
              position: "absolute",
              // top: "-10px",
              right: "12px",
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

export default TextInput;
