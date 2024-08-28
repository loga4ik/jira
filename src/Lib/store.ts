import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userSlice from "./Slices/userSlice/userSlice";
import projectSlice from "./Slices/projectSlice/projectSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    project: projectSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
