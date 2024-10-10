import { createSlice } from "@reduxjs/toolkit";
import { Project, SubtaskType, TaskType, UserType } from "./types";
import {
  addUserInProject,
  createNewProject,
  editeTask,
  getProjectData,
  getTasksAndSubtasks,
  getUserList,
  removeUserInProject,
  updateAllProject,
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
      state.project = null;
    },
  },
  extraReducers: (element) => {
    element.addCase(getTasksAndSubtasks.fulfilled, (state, action) => {
      action.payload.tasks && (state.tasks = action.payload.tasks);
      action.payload.subtasks && (state.subtasks = action.payload.subtasks);
    });
    element.addCase(getUserList.fulfilled, (state, action) => {
      const uniqueArray = [
        ...new Set(action.payload.map((item) => item.id)),
      ]
        .map((id) => action.payload.find((item) => item.id === id))
        .filter((item): item is UserType => item !== undefined); // Filter out undefined
    
      state.userList = uniqueArray;
    });
    element.addCase(addUserInProject.fulfilled, (state, action) => {
      state.userList = action.payload.activeUsers;
    });
    element.addCase(editeTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.map((task) => {
        if (action.payload.taskData.id === task.id) {
          return action.payload.taskData;
        }
        return task;
      });

      state.subtasks = [
        // Добавляем подзадачи, у которых task_id не совпадает с новым task_id
        ...state.subtasks.filter(
          (oldSubtask) => oldSubtask.task_id !== action.payload.taskData.id
        ),

        // Обновляем или добавляем новые подзадачи из нового списка
        ...action.payload.subtaskList.map((newSubtask) => {
          // Ищем соответствующую подзадачу в старом списке
          const existingSubtask = state.subtasks.find(
            (subtask) => subtask.id === newSubtask.id
          );

          // Возвращаем новую подзадачу, если она существует, либо добавляем новую
          return existingSubtask
            ? { ...existingSubtask, ...newSubtask }
            : newSubtask;
        }),
      ];
    });
    element.addCase(removeUserInProject.fulfilled, (state, action) => {
      // Обновляем массив subtasks, заменяя объекты по id
      state.subtasks = state.subtasks.map((item1) => {
        const matchingItem = action.payload.updatedSubtasks.find(
          (item2) => item2.id === item1.id
        );
        return matchingItem ? matchingItem : item1;
      });
      // Обновляем список пользователей
      state.userList = action.payload.activeUsers;
    });

    element.addCase(getProjectData.fulfilled, (state, action) => {
      state.project = action.payload;
    });
    element.addCase(updateAllProject.fulfilled, (state, action) => {
      state.project = action.payload.project;
      state.tasks = action.payload.tasks;
      state.subtasks = action.payload.subtasks;
    });
    element.addCase(createNewProject.fulfilled, (state, action) => {
      state.project = action.payload.project;
      state.tasks = action.payload.tasks;
      state.subtasks = action.payload.subtasks;
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
