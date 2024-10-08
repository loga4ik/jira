import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../Lib/store";
import { UserType } from "../../../types/UserTypes";
import { Wrapper } from "../../../UIKit/Wrapper";
import TextInput from "../../../UIKit/Inputs/TextInput";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import HiddenInput from "../../../UIKit/Inputs/HiddenInput/HiddenInput";
import { registerUser } from "../../../Lib/Slices/userSlice/userApi";

export interface UserForm extends Omit<UserType, "id"> {
  password_repeat: string;
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: {
      name: "",
      surname: "",
      patronymic: "",
      login: "",
      password: "",
      password_repeat: "",
      phone: "",
      email: "",
    },
  });

  const formOnSubmitHandler = (data: UserForm) => {
    (async () => {
      if (data.password !== data.password_repeat) {
        return;
      }
      const query = await dispatch(registerUser(data));
      query.meta.requestStatus === "fulfilled" && navigate("/");
    })();
  };
  // useEffect(() => {
  //   console.log(errors);
  // }, [errors.login, errors.password, errors.phone]);

  return (
    <>
      <div className="flex justify-center">
        <Wrapper className="border-2 border-transparent rounded-xl m-3 p-3 w-3/5">
          <p className="form-title">регистрация</p>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmit(formOnSubmitHandler)}
          >
            <div className="relative">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5 ${
                  errors.name ? "focus:ring-red-300" : "focus:ring-green-300"
                }`}
                inputType="text"
                placeholder="имя"
                autocomplite="name"
                register={register("name", { required: "обязательное поле" })}
              />
              {errors.name && (
                <p className="absolute bottom-0 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="relative">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5 ${
                  errors.surname ? "focus:ring-red-300" : "focus:ring-green-300"
                }`}
                inputType="text"
                placeholder="фамилия"
                autocomplite="surname"
                register={register("surname", {
                  required: "обязательное поле",
                })}
              />
              {errors.surname && (
                <p className="absolute bottom-0 text-sm">
                  {errors.surname.message}
                </p>
              )}
            </div>
            <div className="relative">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5 ${
                  errors.patronymic
                    ? "focus:ring-red-300"
                    : "focus:ring-green-300"
                }`}
                inputType="text"
                placeholder="отчество"
                autocomplite="patronymic"
                register={register("patronymic", {
                  required: "обязательное поле",
                })}
              />
              {errors.patronymic && (
                <p className="absolute bottom-0 text-sm">
                  {errors.patronymic.message}
                </p>
              )}
            </div>
            <div className="relative">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5 ${
                  errors.phone ? "focus:ring-red-300" : "focus:ring-green-300"
                }`}
                inputType="masked"
                placeholder="телефон"
                autocomplite="phone"
                register={register("phone", { required: "обязательное поле" })}
              />
              {errors.phone && (
                <p className="absolute bottom-0 text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="relative">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5 ${
                  errors.email ? "focus:ring-red-300" : "focus:ring-green-300"
                }`}
                inputType="text"
                placeholder="email"
                autocomplite="email"
                register={register("email", { required: "обязательное поле" })}
              />
              {errors.email && (
                <p className="absolute bottom-0 text-sm ">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="relative">
              <TextInput
                className={`focus:outline-none focus:ring mt-0 mb-5 ${
                  errors.login ? "focus:ring-red-300" : "focus:ring-green-300"
                }`}
                inputType="text"
                placeholder="логин"
                autocomplite="login"
                register={register("login", { required: "обязательное поле" })}
              />
              {errors.login && (
                <p className="absolute bottom-0 text-sm">
                  {errors.login.message}
                </p>
              )}
            </div>
            <div className="relative">
              <HiddenInput
                className={`focus:outline-none focus:ring mt-0 mb-5`}
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
                <p className="absolute bottom-0 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative">
              <HiddenInput
                className="focus:outline-none focus:ring mt-0 mb-5"
                focusClass={
                  errors.password_repeat
                    ? "focus:ring-red-300"
                    : "focus:ring-green-300"
                }
                inputType="password"
                placeholder="повтор пароля"
                autocomplite="password_repeat"
                register={register("password_repeat", {
                  required: "обязательное поле",
                })}
              />
              {errors.password_repeat && (
                <p className="absolute bottom-0 text-sm">
                  {errors.password_repeat.message}
                </p>
              )}
            </div>
            <Button
              title="отправить"
              className={
                "border border-gray-400 rounded-full justify-self-center col-start-2"
              }
              type="submit"
              onClick={handleSubmit(formOnSubmitHandler)}
            >
              Отправить
            </Button>
          </form>
        </Wrapper>
      </div>
    </>
  );
};

export default Register;
