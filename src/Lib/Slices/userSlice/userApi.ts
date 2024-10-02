import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserForm } from "../../../UI/Pages/Register/Register";
import { OneItem } from "./userSlice";

export type UserData = {
  login: string;
  password: string;
};

export const getCookie = createAsyncThunk("getCookie", async () => {
  try {
    const response = await fetch("/api/user");
    return response.json();
  } catch (error) {
    console.log("error");
  }
});

export const logOut = createAsyncThunk("logOut", async () => {
  try {
    const response = await fetch("/api/user/logOut", {
      method: "delete",
    });
    return response.json();
  } catch (error) {
    console.log("error");
  }
});

export const loginUser = createAsyncThunk<
  OneItem,
  UserData,
  { rejectValue: string }
>("loginUser", async ({ login, password }: UserData, thunkAPI) => {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login,
        password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text(); // читаем тело ответа как текст
      throw errorText;
    }
    return response.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(`${error}`);
  }
});

export const registerUser = createAsyncThunk<
  OneItem,
  UserForm,
  { rejectValue: string }
>(
  "registerUser",
  async (
    { name, surname, patronymic, login, password, phone, email }: UserForm,
    thunkAPI
  ) => {
    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          patronymic,
          login,
          password,
          phone,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      return response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);
