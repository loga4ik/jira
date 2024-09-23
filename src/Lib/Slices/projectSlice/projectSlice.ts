import { createSlice } from "@reduxjs/toolkit";
import { Project, SubtaskType, TaskType, UserType } from "./types";
import {
  addUserInProject,
  getProjectData,
  getTasksAndSubtasks,
  getUserList,
  removeUserInProject,
  updateSubtask,
} from "./projectApi";

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
      state.userList = action.payload.activeUsers;
    });
    element.addCase(removeUserInProject.fulfilled, (state, action) => {
      state.userList = action.payload.activeUsers;
    });
    element.addCase(getProjectData.fulfilled, (state, action) => {
      state.project = action.payload;
      console.log(action.payload);
    });
    element.addCase(updateSubtask.fulfilled, (state, action) => {
      state.subtasks = state.subtasks.map((subtask) =>
        subtask.id === action.payload.id ? action.payload : subtask
      );
    });
  },
});
export const { setDefaultProjects } = projectSlice.actions;
export default projectSlice.reducer;
