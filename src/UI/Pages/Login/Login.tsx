import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../Lib/store";
import { UserLoginData } from "../../../types/UserTypes";
import { Wrapper } from "../../../UIKit/Wrapper";
import TextInput from "../../../UIKit/Inputs/TextInput";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import HiddenInput from "../../../UIKit/Inputs/HiddenInput/HiddenInput";
import { loginUser } from "../../../Lib/Slices/userSlice/userSlice";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { handleSubmit, register } = useForm<UserLoginData>({
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
        <Wrapper className="border-2 border-gray-300 rounded-xl m-3 p-3 w-3/5 max-w-screen-sm">
          <p className="form-title">войти</p>
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmit(formOnSubmitHandler)}
          >
            <TextInput
              className="w-1/2"
              inputType="text"
              placeholder="login"
              register={register("login")}
            />
            <HiddenInput
              className="w-1/2"
              inputType="password"
              placeholder="password"
              register={register("password")}
            />
            <Button
              className={"form_submit_btn"}
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
