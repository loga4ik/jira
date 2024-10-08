import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../Lib/store";
import { UserLoginData } from "../../../types/UserTypes";
import { Wrapper } from "../../../UIKit/Wrapper";
import TextInput from "../../../UIKit/Inputs/TextInput";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import HiddenInput from "../../../UIKit/Inputs/HiddenInput/HiddenInput";
import { loginUser } from "../../../Lib/Slices/userSlice/userApi";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserLoginData>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const formOnSubmitHandler = (data: UserLoginData) => {
    (async () => {
      const query = await dispatch(loginUser(data));
      query.meta.requestStatus === "fulfilled" && navigate("/");
    })();
  };

  return (
    <>
      <div className="flex justify-center">
        <Wrapper className="border-2 rounded-xl m-3 p-3 w-3/5 max-w-screen-sm border-transparent">
          <p className="form-title">авторизация</p>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmit(formOnSubmitHandler)}
          >
            <div className="relative w-1/2">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5
                  mx-0 w-full ${
                    errors.login ? "focus:ring-red-300" : "focus:ring-green-300"
                  }`}
                inputType="text"
                placeholder="логин"
                autocomplite="login"
                register={register("login", { required: "обязательное поле" })}
              />
              {errors.login && (
                <p className="absolute bottom-0">{errors.login.message}</p>
              )}
            </div>
            <div className="relative w-1/2">
              <HiddenInput
                className={`focus:outline-none focus:ring mt-0 mb-5
                  mx-0 w-full`}
                focusClass={
                  errors.password
                    ? "focus:ring-red-300"
                    : "focus:ring-green-300"
                }
                inputType="password"
                placeholder="пароль"
                autocomplite="password"
                register={register("password", {
                  required: "обязательное поле",
                })}
              />
              {errors.password && (
                <p className="absolute bottom-0">{errors.password.message}</p>
              )}
            </div>
            <Button
              title="отправить"
              className={
                "border border-gray-400 rounded-full justify-self-center col-start-2 "
              }
              type="submit"
              onClick={handleSubmit(formOnSubmitHandler)}
            >
              отправить
            </Button>
          </form>
        </Wrapper>
        {/* <button onClick={() => navigate("/register")}>создать аккаунт</button> */}
      </div>
    </>
  );
};

export default Login;
