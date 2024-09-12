import { ProjectPai_UserRes, TaskAndSubtasks } from "./types";
export type GetFreeUsers = {
  freeUsers: ProjectPai_UserRes[];
  activeUsers: ProjectPai_UserRes[];
};
export const getTeam = async (
  project_id: number
): Promise<Error | ProjectPai_UserRes[]> => {
  const abortController = new AbortController();
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

export const getUserList = async (
  project_id: number
): Promise<Error | GetFreeUsers> => {
  try {
    console.log(project_id);

    const response = await fetch(`/api/project/getFreeUsers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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

type ManageUserInProjectReq = {
  user_id: number;
  project_id: number;
};

export const addUserInProject = async ({
  user_id,
  project_id,
}: ManageUserInProjectReq): Promise<Error | GetFreeUsers> => {
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
}: ManageUserInProjectReq): Promise<Error | GetFreeUsers> => {
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

export const getProjectTaskAndSubtasks = async (
  project_id: number,
  abortController: AbortController
): Promise<Error | TaskAndSubtasks[]> => {
  try {
    const response = await fetch(
      `/api/task/getTasksAndSubtasks/${project_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Указываем тип содержимого
        },
        signal: abortController.signal,
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json(); // Ожидание ответа в формате JSON
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};
