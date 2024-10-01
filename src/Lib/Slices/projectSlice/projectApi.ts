import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ManageUserInProjectReqType,
  Project,
  SubtaskType,
  TaskAndSubtasks,
  TaskType,
  UserType,
} from "./types";
import { EditProjectType } from "../../../UI/Pages/project/Components/EditProject/EditProject";
import { CreateProjectType } from "../../../UI/Pages/Main/Components/ProjectCreate/ProjectCreateForm";

export type ReqProject_idType = {
  project_id: number;
  abortController: AbortController;
};

export type ResActiveAndFreeUsers = {
  freeUsers: UserType[];
  activeUsers: UserType[];
  updatedSubtasks: SubtaskType[];
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
      const response = await fetch(
        `/api/task/getTasksAndSubtasks/${project_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: abortController.signal,
        }
      );
      return (await response.json()) as TaskAndSubtasks; // Возвращаем успешный результат
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
  ResActiveAndFreeUsers, // Ожидаемый тип успешного ответа
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
      const response = await fetch(`/api/team/create`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({
          user_id,
          project_id,
        }),
      });
      return (await response.json()) as ResActiveAndFreeUsers; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

export const removeUserInProject = createAsyncThunk<
  ResActiveAndFreeUsers, // Ожидаемый тип успешного ответа
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
      const response = await fetch(`/api/team/deleteUser/${user_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Указываем тип содержимого
        },
        signal: abortController.signal,
        body: JSON.stringify({ project_id }),
      });
      return (await response.json()) as ResActiveAndFreeUsers; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

type UpdateSubtaskReq = {
  id: number;
  user_id: number;
  status_id: number;
  title: string;
  abortController: AbortController;
};

export const updateSubtask = createAsyncThunk<
  SubtaskType, // Ожидаемый тип успешного ответа
  UpdateSubtaskReq, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "updateSubtask",
  async (
    { id, user_id, status_id, title, abortController }: UpdateSubtaskReq,
    thunkAPI
  ) => {
    try {
      // Передаем сигнал для отмены запроса
      const response = await fetch(`/api/subtask/addUserInSubtaskRename`, {
        method: "put",
        headers: {
          "Content-Type": "application/json", // Указываем тип содержимого
        },
        body: JSON.stringify({ id, user_id, status_id, title }),
        signal: abortController.signal,
      });
      return (await response.json()) as SubtaskType; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

export const getProjectData = createAsyncThunk<
  Project, // Ожидаемый тип успешного ответа
  ReqProject_idType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "getProjectData",
  async ({ project_id, abortController }: ReqProject_idType, thunkAPI) => {
    try {
      const response = await fetch(`/api/project/${project_id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
      });
      const res = await response.json();

      return res[0] as Project; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);
type updateAllType = {
  project: Project;
  tasks: TaskType[];
  subtasks: SubtaskType[];
};

export const updateAllProject = createAsyncThunk<
  updateAllType, // Ожидаемый тип успешного ответа
  EditProjectType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "updateAllProject",
  async (
    { title, description, project_id, tasks }: EditProjectType,
    thunkAPI
  ) => {
    try {
      const response = await fetch(`/api/project/updateAll`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          project_id,
          tasks,
        }),
        // signal: abortController.signal,
      });
      const res = await response.json();

      return res as updateAllType; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);

export const createNewProject = createAsyncThunk<
  updateAllType, // Ожидаемый тип успешного ответа
  CreateProjectType, // Тип аргументов
  { rejectValue: string } // Тип для ошибки
>(
  "createNewProject",
  async (
    { title, description, user_id, tasks }: CreateProjectType,
    thunkAPI
  ) => {
    try {
      const response = await fetch(`/api/project/create`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          user_id,
          tasks,
        }),
        // signal: abortController.signal,
      });
      const res = await response.json();
      console.log(res);

      return res as updateAllType; // Возвращаем успешный результат
    } catch (error) {
      return thunkAPI.rejectWithValue(`${error}`);
    }
  }
);
