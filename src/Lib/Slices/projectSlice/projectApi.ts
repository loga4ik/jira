import { GetFreeUsers } from "../../../Api/projectApi";
import { ManageUserInProjectReqType, TaskAndSubtasks, UserType } from "./types";
import { ReqProject_idType } from "./projectSlice";

export const getProjectTaskAndSubtasks = async ({
  project_id,
  abortController,
}: ReqProject_idType) => {
  try {
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
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const updateSubtask = async (
  id: number,
  user_id: number,
  title: string
): Promise<Error | TaskAndSubtasks[]> => {
  try {
    const response = await fetch(`/api/subtask/addUserInSubtaskRename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Указываем тип содержимого
      },
      body: JSON.stringify({ id, user_id, title }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json(); // Ожидание ответа в формате JSON
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const getTeam = async ({
  project_id,
  abortController,
}: ReqProject_idType): Promise<Error | UserType[]> => {
  try {
    const response = await fetch(`/api/team/${project_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    });
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    // abortController.abort();
  }
};

export const addUserInProject = async ({
  user_id,
  project_id,
}: ManageUserInProjectReqType): Promise<Error | UserType[]> => {
  try {
    const response = await fetch(`/api/team/create`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        project_id,
      }),
    });
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    // abortController.abort();
  }
};

export const removeUser = async ({
  user_id,
  project_id,
}: ManageUserInProjectReqType): Promise<Error | UserType[]> => {
  try {
    const response = await fetch(`/api/team/deleteUser/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", // Указываем тип содержимого
      },
      body: JSON.stringify({ project_id }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json(); // Ожидание ответа в формате JSON
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};
