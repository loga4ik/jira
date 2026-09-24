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
} from "../../../features/auth/schemas";

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterForm>({
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

  const fieldClass = (hasError: boolean) =>
    `focus:outline-none focus:ring mt-0 mb-5 ${
      hasError ? "focus:ring-red-300" : "focus:ring-green-300"
    }`;

  return (
    <div className="flex justify-center">
      <Wrapper className="border-2 border-transparent rounded-xl m-3 p-3 w-3/5">
        <p className="form-title">регистрация</p>
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          {serverError && <p className="p-3 text-red-400">{serverError}</p>}

          <div className="relative">
            <TextInput
              className={fieldClass(Boolean(errors.name))}
              inputType="text"
              placeholder="имя"
              autocomplite="given-name"
              isRequired
              register={register("name")}
            />
            {errors.name && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="relative">
            <TextInput
              className={fieldClass(Boolean(errors.surname))}
              inputType="text"
              placeholder="фамилия"
              autocomplite="family-name"
              isRequired
              register={register("surname")}
            />
            {errors.surname && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.surname.message}
              </p>
            )}
          </div>

          <div className="relative">
            <TextInput
              className={fieldClass(Boolean(errors.patronymic))}
              inputType="text"
              placeholder="отчество"
              autocomplite="additional-name"
              register={register("patronymic")}
            />
            {errors.patronymic && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.patronymic.message}
              </p>
            )}
          </div>

          <div className="relative">
            <TextInput
              className={fieldClass(Boolean(errors.phone))}
              inputType="masked"
              placeholder="телефон"
              autocomplite="tel"
              isRequired
              register={register("phone")}
            />
            {errors.phone && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="relative">
            <TextInput
              className={fieldClass(Boolean(errors.email))}
              inputType="text"
              placeholder="email"
              autocomplite="email"
              isRequired
              register={register("email")}
            />
            {errors.email && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <TextInput
              className={fieldClass(Boolean(errors.login))}
              inputType="text"
              placeholder="логин"
              autocomplite="username"
              isRequired
              register={register("login")}
            />
            {errors.login && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.login.message}
              </p>
            )}
          </div>

          <div className="relative">
            <HiddenInput
              className="focus:outline-none focus:ring mt-0 mb-5"
              focusClass={
                errors.password ? "focus:ring-red-300" : "focus:ring-green-300"
              }
              inputType="password"
              placeholder="пароль"
              autocomplite="new-password"
              isRequired
              register={register("password")}
            />
            {errors.password && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <HiddenInput
              className="focus:outline-none focus:ring mt-0 mb-5"
              focusClass={
                errors.passwordRepeat
                  ? "focus:ring-red-300"
                  : "focus:ring-green-300"
              }
              inputType="password"
              placeholder="повтор пароля"
              autocomplite="new-password"
              isRequired
              register={register("passwordRepeat")}
            />
            {errors.passwordRepeat && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.passwordRepeat.message}
              </p>
            )}
          </div>

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
