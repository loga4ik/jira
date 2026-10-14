import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "../../../UIKit/Wrapper";
import TextInput from "../../../UIKit/Inputs/TextInput";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import HiddenInput from "../../../UIKit/Inputs/HiddenInput/HiddenInput";
import { useLoginMutation } from "../../../Lib/api/userApi";
import { getErrorMessage } from "../../../Lib/api/getErrorMessage";
import { loginSchema, type LoginForm } from "../../../features/auth/schemas";
import { getSafeReturnPath } from "../../../features/auth/returnPath";
import { homePathFor } from "../../../features/mainProject/mainProject";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const { user } = await login(data).unwrap();
      // туда, куда шёл до входа (?from=…), иначе в главный проект,
      // а если его нет — на список проектов;
      // replace, чтобы кнопка «назад» не возвращала на форму входа
      navigate(getSafeReturnPath(location.search) ?? homePathFor(user.id), {
        replace: true,
      });
    } catch {
      // текст ошибки берём из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error, {
    401: "Неверный логин или пароль",
  });

  return (
    <div className="flex justify-center">
      <Wrapper className="border-2 rounded-xl m-3 p-3 w-3/5 max-w-screen-sm border-transparent">
        <p className="form-title">авторизация</p>
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          {serverError && <p className="p-3 text-red-400">{serverError}</p>}

          <div className="relative w-1/2">
            <TextInput
              className={`focus:outline-none focus:ring mt-0 mb-5 mx-0 w-full ${
                errors.login ? "focus:ring-red-300" : "focus:ring-green-300"
              }`}
              inputType="text"
              placeholder="логин"
              autocomplite="username"
              register={register("login")}
            />
            {errors.login && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.login.message}
              </p>
            )}
          </div>

          <div className="relative w-1/2">
            <HiddenInput
              className="focus:outline-none focus:ring mt-0 mb-5 mx-0 w-full"
              focusClass={
                errors.password ? "focus:ring-red-300" : "focus:ring-green-300"
              }
              inputType="password"
              placeholder="пароль"
              autocomplite="current-password"
              register={register("password")}
            />
            {errors.password && (
              <p className="absolute bottom-0 text-sm ml-2 text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            title="войти"
            className="border border-gray-400 rounded-full justify-self-center col-start-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "входим…" : "войти"}
          </Button>
        </form>
        <p>тестовый пользователь: qwe/qwe</p>
      </Wrapper>
    </div>
  );
};

export default Login;
