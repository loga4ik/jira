import { UserType } from "../Lib/Slices/projectSlice/types";
export type GetFreeUsers = {
  freeUsers: UserType[];
  activeUsers: UserType[];
};

export const userProjects = async (
  id: number,
  abortController: AbortController
) => {
  try {
    const response = await fetch(`/api/project/getUserProjects/${id}`, {
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

export const getStatusList = async (abortController: AbortController) => {
  try {
    const response = await fetch(`/api/status`, {
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

export const deleteProject = async (
  project_id: number,
  abortController: AbortController
) => {
  try {
    const response = await fetch(`/api/project/deleteProject/${project_id}`, {
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

export const isAvailableProject = async (
  project_id: number,
  abortController: AbortController
) => {
  try {
    const response = await fetch(`/api/team/isAvailable/${project_id}`, {
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
