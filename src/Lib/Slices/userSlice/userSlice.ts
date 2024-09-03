import * as userApi from "./userApi";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
type OneItem = {
  id: number;
  login: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
};
// type User = {
//   id: number;
//   login: string;
// };

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

export const getCookie = createAsyncThunk("getUserCookie", () =>
  userApi.getUserCookie()
);

export const setAllUserDefault = createAsyncThunk("logOut", () =>
  userApi.logOut()
);

export const loginUser = createAsyncThunk<
  OneItem,
  userApi.UserData,
  { rejectValue: string }
>("login", async ({ login, password }: userApi.UserData, thunkAPI) => {
  try {
    const user = await userApi.login({ login, password });
    return user as OneItem;
  } catch (error) {
    return thunkAPI.rejectWithValue(`${error}`);
  }
});

export const registerUser = createAsyncThunk<
  OneItem,
  userApi.UserData,
  { rejectValue: string }
>("register", async ({ login, password }: userApi.UserData, thunkAPI) => {
  try {
    const user = await userApi.register({ login, password });
    return user as OneItem;
  } catch (error) {
    return thunkAPI.rejectWithValue(`${error}`);
  }
});

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
    element.addCase(setAllUserDefault.fulfilled, (state, action) => {
      state.currentUser = undefined;
      state.error = undefined;
      state.userList = [];
    });
  },
});

export const { setCurrentUser, setDefaultError } = userSlice.actions;
export default userSlice.reducer;
