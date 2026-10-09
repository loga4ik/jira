import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "../../../UIKit/Wrapper";
import TextInput from "../../../UIKit/Inputs/TextInput";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import HiddenInput from "../../../UIKit/Inputs/HiddenInput/HiddenInput";
import { useRegisterMutation } from "../../../Lib/api/userApi";
import { getErrorMessage } from "../../../Lib/api/getErrorMessage";
import {
  registerSchema,
  type RegisterForm,
  type RegisterFormInput,
} from "../../../features/auth/schemas";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

/**
 * Обёртка поля: подпись, само поле и ошибка под ним.
 *
 * Подпись видна только скринридеру (sr-only) — на экране роль подписи
 * играет плейсхолдер. Без <label> у поля нет доступного имени,
 * и скринридер прочитал бы просто «поле ввода».
 *
 * Ошибка стоит в потоке, а не absolute: длинный текст переносится
 * на вторую строку и сдвигает поля ниже, а не налезает на них.
 */
const Field = ({ id, label, error, children }: FieldProps) => (
  <div className="w-full max-w-xs flex flex-col mb-4">
    <label htmlFor={id} className="sr-only">
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="text-sm ml-2 mt-1 text-red-400">
        {error}
      </p>
    )}
  </div>
);

/** Классы текстового поля: одинаковые размеры у всех, красная рамка при ошибке. */
const inputClass = (invalid: boolean) =>
  `w-full m-0 h-8 px-3 py-1 rounded-md border bg-transparent focus:outline-none focus:ring ${
    invalid
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-200 focus:ring-green-300"
  }`;

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    getValues,
    trigger,
    formState: { errors },
    // Три параметра: что в форме, контекст и что после разбора схемы.
    // Ввод и результат различаются: после .trim() строки уже обрезаны.
  } = useForm<RegisterFormInput, unknown, RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      surname: "",
      patronymic: "",
      phone: "",
      email: "",
      login: "",
      password: "",
      passwordRepeat: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      // перечисляем поля явно: passwordRepeat нужен только форме,
      // и лишнее на сервер не уедет, даже если схема разрастётся
      await registerUser({
        name: data.name,
        surname: data.surname,
        patronymic: data.patronymic,
        phone: data.phone,
        email: data.email,
        login: data.login,
        password: data.password,
      }).unwrap();
      navigate("/", { replace: true });
    } catch {
      // текст ошибки берём из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error, {
    409: "Этот логин уже занят",
  });

  /** Атрибуты доступности поля: связь с ошибкой и признак ошибки. */
  const fieldA11y = (name: keyof RegisterFormInput) => ({
    id: `register-${name}`,
    invalid: Boolean(errors[name]),
    describedBy: errors[name] ? `register-${name}-error` : undefined,
  });

  return (
    <div className="flex justify-center">
      <Wrapper className="border-2 border-transparent rounded-xl m-3 p-3 w-full sm:w-3/5">
        <h1 className="form-title">регистрация</h1>
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          {serverError && (
            // role="alert" — скринридер прочитает ошибку сервера сразу,
            // как только она появится, без перехода фокуса.
            <p role="alert" className="p-3 text-red-400">
              {serverError}
            </p>
          )}

          <Field id="register-name" label="Имя" error={errors.name?.message}>
            <TextInput
              {...fieldA11y("name")}
              required
              className={inputClass(Boolean(errors.name))}
              useDefaultStyles={false}
              inputType="text"
              placeholder="имя"
              autocomplite="given-name"
              register={register("name")}
            />
          </Field>

          <Field
            id="register-surname"
            label="Фамилия"
            error={errors.surname?.message}
          >
            <TextInput
              {...fieldA11y("surname")}
              required
              className={inputClass(Boolean(errors.surname))}
              useDefaultStyles={false}
              inputType="text"
              placeholder="фамилия"
              autocomplite="family-name"
              register={register("surname")}
            />
          </Field>

          <Field
            id="register-patronymic"
            label="Отчество, необязательно"
            error={errors.patronymic?.message}
          >
            <TextInput
              {...fieldA11y("patronymic")}
              className={inputClass(Boolean(errors.patronymic))}
              useDefaultStyles={false}
              inputType="text"
              placeholder="отчество (необязательно)"
              autocomplite="additional-name"
              register={register("patronymic")}
            />
          </Field>

          <Field
            id="register-phone"
            label="Телефон"
            error={errors.phone?.message}
          >
            <TextInput
              {...fieldA11y("phone")}
              required
              className={inputClass(Boolean(errors.phone))}
              useDefaultStyles={false}
              inputType="masked"
              placeholder="телефон"
              autocomplite="tel"
              register={register("phone")}
            />
          </Field>

          <Field id="register-email" label="Email" error={errors.email?.message}>
            <TextInput
              {...fieldA11y("email")}
              required
              className={inputClass(Boolean(errors.email))}
              useDefaultStyles={false}
              inputType="text"
              placeholder="email"
              autocomplite="email"
              register={register("email")}
            />
          </Field>

          <Field id="register-login" label="Логин" error={errors.login?.message}>
            <TextInput
              {...fieldA11y("login")}
              required
              className={inputClass(Boolean(errors.login))}
              useDefaultStyles={false}
              inputType="text"
              placeholder="логин"
              autocomplite="username"
              register={register("login")}
            />
          </Field>

          <Field
            id="register-password"
            label="Пароль"
            error={errors.password?.message}
          >
            <HiddenInput
              {...fieldA11y("password")}
              required
              className="w-full"
              focusClass={
                errors.password ? "focus:ring-red-300" : "focus:ring-green-300"
              }
              inputType="password"
              placeholder="пароль"
              autocomplite="new-password"
              register={register("password", {
                // Схема сравнивает пароли в refine, но react-hook-form
                // перепроверяет только то поле, которое изменилось.
                // Без этого после смены пароля старое «совпадают»
                // оставалось бы до отправки формы. Повтор проверяем,
                // только если его уже ввели, — иначе под пустым полем
                // раньше времени появилось бы «Обязательное поле».
                onBlur: () => {
                  if (getValues("passwordRepeat")) void trigger("passwordRepeat");
                },
              })}
            />
          </Field>

          <Field
            id="register-passwordRepeat"
            label="Повтор пароля"
            error={errors.passwordRepeat?.message}
          >
            <HiddenInput
              {...fieldA11y("passwordRepeat")}
              required
              className="w-full"
              focusClass={
                errors.passwordRepeat
                  ? "focus:ring-red-300"
                  : "focus:ring-green-300"
              }
              inputType="password"
              placeholder="повтор пароля"
              autocomplite="new-password"
              register={register("passwordRepeat")}
            />
          </Field>

          <Button
            title="зарегистрироваться"
            className="border border-gray-400 rounded-full justify-self-center col-start-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "создаём аккаунт…" : "зарегистрироваться"}
          </Button>
        </form>
      </Wrapper>
    </div>
  );
};

export default Register;
