import { apiFetch, readApiError } from "../Lib/api/apiFetch";
import { UserType } from "../Lib/Slices/projectSlice/types";

export const getFreeUsers = async (
  project_id: number
): Promise<Error | UserType[]> => {
  try {
    const response = await apiFetch(`/api/project/getFreeUsers`, {
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

export const userProjects = async (
  id: number,
  abortController: AbortController
) => {
  try {
    const response = await apiFetch(`/api/project/getUserProjects/${id}`, {
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
    const response = await apiFetch(`/api/status`, {
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
    const response = await apiFetch(`/api/project/deleteProject/${project_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(await readApiError(response));
    }
    return response.json();
  } catch (error) {
    // текст ошибки отдаём как есть, без обёртки «Error: Error: 403»
    throw error instanceof Error ? error : new Error(`${error}`);
  } finally {
    // abortController.abort();
  }
};

export const isAvailableProject = async (
  project_id: number,
  abortController: AbortController
) => {
  try {
    const response = await apiFetch(`/api/team/isAvailable/${project_id}`, {
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
