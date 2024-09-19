import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectApi from "./projectApi";
import {
  ManageUserInProjectReqType,
  Project,
  SubtaskType,
  TaskAndSubtasks,
  TaskType,
  UserType,
} from "./types";

type State = {
  project: Project | null;
  userList: UserType[];
  tasks: TaskType[];
  subtasks: SubtaskType[];
};

const initialState: State = {
  project: null,
  userList: [],
  tasks: [],
  subtasks: [],
};

export type ReqProject_idType = {
  project_id: number;
  abortController: AbortController;
};

export const getTasksAndSubtasks = createAsyncThunk<
  TaskAndSubtasks, // Ожидаемый тип успешного ответа
  ReqProject_idType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "getProjectTaskAndSubtasks",
  async ({ project_id, abortController }: ReqProject_idType, thunkAPI) => {
    try {
      // Передаем сигнал для отмены запроса
      const res = await projectApi.getProjectTaskAndSubtasks({
        project_id,
        abortController,
      });
      return res as TaskAndSubtasks; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

export const getUserList = createAsyncThunk<
  UserType[], // Ожидаемый тип успешного ответа
  ReqProject_idType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "getUserList",
  async ({ project_id, abortController }: ReqProject_idType, thunkAPI) => {
    try {
      // Передаем сигнал для отмены запроса
      const response = await fetch(`/api/team/${project_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
      return (await response.json()) as UserType[]; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

export const addUserInProject = createAsyncThunk<
  UserType[], // Ожидаемый тип успешного ответа
  ManageUserInProjectReqType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "addUserInProject",
  async (
    { project_id, user_id, abortController }: ManageUserInProjectReqType,
    thunkAPI
  ) => {
    try {
      // Передаем сигнал для отмены запроса
      const res = await projectApi.addUserInProject({
        project_id,
        user_id,
        abortController,
      });
      return res as UserType[]; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

export const removeUserInProject = createAsyncThunk<
  UserType[], // Ожидаемый тип успешного ответа
  ManageUserInProjectReqType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "removeUserInProject",
  async (
    { project_id, user_id, abortController }: ManageUserInProjectReqType,
    thunkAPI
  ) => {
    try {
      // Передаем сигнал для отмены запроса
      const res = await projectApi.removeUser({
        project_id,
        user_id,
        abortController,
      });
      return res as UserType[]; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setDefaultProjects(state) {
      state.tasks = [];
      state.subtasks = [];
    },
  },
  extraReducers: (element) => {
    element.addCase(getTasksAndSubtasks.fulfilled, (state, action) => {
      action.payload.tasks && (state.tasks = action.payload.tasks);
      action.payload.subtasks && (state.subtasks = action.payload.subtasks);
    });
    element.addCase(getUserList.fulfilled, (state, action) => {
      state.userList = action.payload;
    });
    element.addCase(addUserInProject.fulfilled, (state, action) => {
      state.userList = action.payload;
    });
    element.addCase(removeUserInProject.fulfilled, (state, action) => {
      state.userList = action.payload;
    });
  },
});
export const { setDefaultProjects } = projectSlice.actions;
export default projectSlice.reducer;
