"use client";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../Lib/store";
import { UserType } from "../../../types/UserTypes";
import { registerUser } from "../../../Lib/Slices/userSlice/userSlice";
import { Wrapper } from "../../../UIKit/Wrapper";
import Input from "../../../UIKit/Inputs/Input";
import { Button } from "../../../UIKit/Inputs/Button";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { handleSubmit, register } = useForm<UserType>({
    defaultValues: {
      name: "",
      surname: "",
      patronymic: "",
      login: "",
      password: "",
      phone: "",
      email: "",
    },
  });

  const formOnSubmitHandler = (data: UserType) => {
    (async () => {
      const query = await dispatch(registerUser(data));
      query.meta.requestStatus === "fulfilled" && navigate("/");
    })();
  };
  return (
    <>
      <div className="flex justify-center">
        <Wrapper className="border-2 border-gray-300 rounded-xl m-3 p-3 w-3/5 light_out_big">
          <p className="form-title">регистрация</p>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmit(formOnSubmitHandler)}
          >
            <Input
              className="form_input"
              inputType="text"
              placeholder="name"
              register={register("name")}
            />
            <Input
              className="form_input"
              inputType="text"
              placeholder="surname"
              register={register("surname")}
            />
            <Input
              className="form_input"
              inputType="text"
              placeholder="patronymic"
              register={register("patronymic")}
            />
            <Input
              className="form_input"
              inputType="masked"
              placeholder="phone"
              register={register("phone")}
            />
            <Input
              className="form_input"
              inputType="text"
              placeholder="email"
              register={register("email")}
            />
            <Input
              className="form_input password_input"
              inputType="text"
              placeholder="login"
              register={register("login")}
            />
            <Input
              className="form_input password_input focus:animate-pulse"
              inputType="password"
              placeholder="password"
              register={register("password")}
            />
            {/* <div className="grid grid-cols-3 w-full"> */}
            <Button
              className={
                "border border-gray-400 rounded-full justify-self-center col-start-2"
              }
              type="submit"
              onClick={handleSubmit(formOnSubmitHandler)}
            >
              Отправить
            </Button>
            {/* <Button
                type="button"
                className=" font-semibold text-sm text-indigo-600 hover:text-indigo-500 hover:underline justify-self-end self-end"
                onClick={() => navigate("/login")}
              >
                уже есть аккаунт
              </Button> */}
            {/* </div> */}
          </form>
        </Wrapper>
      </div>
    </>
  );
};

export default Register;
