import {
  getCookie,
  loginUser,
  logOut,
  registerUser,
} from "./userApi";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export type OneItem = {
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
};

type State = {
  userList: OneItem[];
  currentUser?: CurrentUser;
  error?: string;
};
export type CurrentUser = {
  id: number;
  login: string;
};
const initialState: State = {
  userList: [],
  currentUser: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<{ userId: number }>) {
      let userLogin = "";
      state.userList.forEach((element) => {
        if (element.id === action.payload.userId) {
          userLogin = element.login;
        }
      });
      state.currentUser = { id: action.payload.userId, login: userLogin };
    },
    setDefaultError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (element) => {
    element.addCase(getCookie.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    element.addCase(loginUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    element.addCase(loginUser.rejected, (state, action) => {
      state.error = String(action.payload);
    });
    element.addCase(registerUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    element.addCase(registerUser.rejected, (state, action) => {
      state.error = String(action.payload);
    });
    element.addCase(logOut.fulfilled, (state, action) => {
      state.currentUser = undefined;
      state.error = undefined;
      state.userList = [];
    });
  },
});

export const { setCurrentUser, setDefaultError } = userSlice.actions;
export default userSlice.reducer;
