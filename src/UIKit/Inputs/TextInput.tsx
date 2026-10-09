import { InputMask, type Track } from "@react-input/mask";
import {
  CSSProperties,
  ChangeEventHandler,
  ReactNode,
  forwardRef,
} from "react";
import { UseFormRegisterReturn } from "react-hook-form";

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
  /** id поля — к нему привязывается <label htmlFor>. */
  id?: string;
  /** Поле заполнено неверно: красная рамка и aria-invalid для скринридера. */
  invalid?: boolean;
  /** id элемента с текстом ошибки — скринридер прочитает его вместе с полем. */
  describedBy?: string;
  /** Обязательное поле: скринридер объявит «обязательно». */
  required?: boolean;
};

/**
 * Телефон в маске уже начинается с +7, но по привычке его часто набирают
 * с 8 или вставляют целиком: «89001234567», «+7 900 123-45-67».
 * Без обработки маска приняла бы эту 8 (или 7) за первую цифру кода
 * и получилось бы +7(890)-012-34-56 — валидный по формату, но чужой номер.
 *
 * track вызывается до маски: отбрасываем ведущую 8/7, если цифр
 * пользователя в поле ещё нет и вводится одна цифра или полный номер из 11.
 */
const phoneTrack: Track = ({ inputType, data, value }) => {
  if (inputType !== "insert") return data;

  // Цифры, которые уже ввёл пользователь, — без 7 из префикса маски.
  const entered = value.replace(/\D/g, "").replace(/^7/, "");
  if (entered) return data;

  const digits = data.replace(/\D/g, "");
  if (/^[78]/.test(digits) && (digits.length === 1 || digits.length === 11)) {
    return digits.slice(1);
  }
  return data;
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
      id,
      invalid = false,
      describedBy,
      required,
    },
    ref,
  ) => {
    const defaultClassNames = `border m-2 px-3 py-1 rounded-md outline-inherit bg-transparent ${
      invalid ? "border-red-400" : "border-gray-200"
    }`;
    const classNames = `${useDefaultStyles ? defaultClassNames : ""} ${
      className ?? ""
    }`;

    // Общие атрибуты доступности для всех видов поля.
    const a11y = {
      id,
      "aria-invalid": invalid || undefined,
      "aria-describedby": describedBy,
      "aria-required": required || undefined,
    };

    if (inputType === "masked") {
      // Обёртка-div сохранена: на неё рассчитана вёрстка остальных форм.
      return (
        <div>
          <InputMask
            mask="+7(___)-___-__-__"
            replacement={{ _: /\d/ }}
            track={phoneTrack}
            type="tel"
            inputMode="tel"
            placeholder={placeholder}
            className={classNames}
            style={style}
            autoComplete={autocomplite}
            {...a11y}
            {...register}
          />
        </div>
      );
    } else if (inputType === "textarea") {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>} // Преобразуем ref для textarea
          className={classNames}
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...a11y}
          {...register}
        />
      );
    }
    return (
      <div>
        <input
          ref={ref}
          className={classNames}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={style}
          autoComplete={autocomplite}
          {...a11y}
          {...register}
        />
      </div>
    );
  },
);

export default TextInput;
