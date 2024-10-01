import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../Lib/store";
import { UserType } from "../../../types/UserTypes";
import { registerUser } from "../../../Lib/Slices/userSlice/userSlice";
import { Wrapper } from "../../../UIKit/Wrapper";
import TextInput from "../../../UIKit/Inputs/TextInput";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import HiddenInput from "../../../UIKit/Inputs/HiddenInput/HiddenInput";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  interface UserForm extends UserType {
    password_repeat: string;
  }

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
        <Wrapper className="border-2 border-gray-300 rounded-xl m-3 p-3 w-3/5 light_out_big">
          <p className="form-title">регистрация</p>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmit(formOnSubmitHandler)}
          >
            <TextInput
              className={`border-gray-300 focus:outline-none focus:ring ${
                errors.name ? "focus:ring-red-300" : "focus:ring-green-300"
              }`}
              inputType="text"
              placeholder="имя"
              autocomplite="name"
              register={register("name", { required: "обязательное поле" })}
            />
            {errors.name && <p>{errors.name.message}</p>}
            <TextInput
              className={`border-gray-300 focus:outline-none focus:ring ${
                errors.surname ? "focus:ring-red-300" : "focus:ring-green-300"
              }`}
              inputType="text"
              placeholder="фамилия"
              autocomplite="surname"
              register={register("surname", { required: "обязательное поле" })}
            />
            {errors.surname && <p>{errors.surname.message}</p>}
            <TextInput
              className={`border-gray-300 focus:outline-none focus:ring ${
                errors.phone ? "focus:ring-red-300" : "focus:ring-green-300"
              }`}
              inputType="text"
              placeholder="отчество"
              autocomplite="patronymic"
              register={register("patronymic", {
                required: "обязательное поле",
              })}
            />
            {errors.patronymic && <p>{errors.patronymic.message}</p>}
            <TextInput
              className={`border-gray-300 focus:outline-none focus:ring ${
                errors.phone ? "focus:ring-red-300" : "focus:ring-green-300"
              }`}
              inputType="masked"
              placeholder="телефон"
              autocomplite="phone"
              register={register("phone", { required: "обязательное поле" })}
            />
            {errors.phone && <p>{errors.phone.message}</p>}
            <TextInput
              className={`border-gray-300 focus:outline-none focus:ring ${
                errors.phone ? "focus:ring-red-300" : "focus:ring-green-300"
              }`}
              inputType="text"
              placeholder="email"
              autocomplite="email"
              register={register("email", { required: "обязательное поле" })}
            />
            {errors.email && <p>{errors.email.message}</p>}
            <TextInput
              className="form_input password_input"
              inputType="text"
              placeholder="логин"
              autocomplite="login"
              register={register("login", { required: "обязательное поле" })}
            />
            {errors.login && <p>{errors.login.message}</p>}
            <HiddenInput
              className="form_input password_input focus:animate-pulse"
              inputType="password"
              placeholder="пароль"
              autocomplite="password"
              register={register("password", { required: "обязательное поле" })}
            />
            {errors.password && <p>{errors.password.message}</p>}
            <HiddenInput
              className="form_input password_input focus:animate-pulse"
              inputType="password"
              placeholder="повтор пароля"
              autocomplite="password_repeat"
              register={register("password_repeat", {
                required: "обязательное поле",
              })}
            />
            {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
            <Button
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
