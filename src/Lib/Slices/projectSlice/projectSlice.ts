import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectApi from "./projectApi";
// type Project = {
//   id: number;
//   title: string;
//   description: string;
//   owner_id: number;
//   gitLink: string;
//   img: string;
//   owner: boolean;
//   createdAt: Date;
//   updateAt: Date;
// };
interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  gitLink: string;
  img: string;
  createdAt: Date;
  updateAt: Date;
}

type GetProjectsRes = {
  owner: Project;
  working: Project[];
};

export interface ProjectAddIsOwner extends Project {
  isOwner: boolean | null;
}

type State = {
  projects: ProjectAddIsOwner[];
};

const initialState: State = {
  projects: [],
};

export const getUserProjects = createAsyncThunk<
  GetProjectsRes,
  { id: number },
  { rejectValue: string }
>("userProjects", async ({ id }: { id: number }, thunkAPI) => {
  try {
    const res = await projectApi.userProjects(id);
    return res as GetProjectsRes;
  } catch (error) {
    return thunkAPI.rejectWithValue(`${error}`);
  }
});

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setDefaultProjects(state) {
      state.projects = [];
    },
  },
  extraReducers: (element) => {
    element.addCase(getUserProjects.fulfilled, (state, action) => {
      state.projects = [{ ...action.payload.owner, isOwner: true }];
      action.payload.working.map((project) => {
        state.projects.push({ ...project, isOwner: false });
      });
    });
  },
});
export const { setDefaultProjects } = projectSlice.actions;
export default projectSlice.reducer;
