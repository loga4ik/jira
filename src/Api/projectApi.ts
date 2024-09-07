import { ProjectPai_UserRes } from "./types";

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

export const getUserList = async (): Promise<Error | ProjectPai_UserRes[]> => {
  try {
    const response = await fetch(`/api/user/getAllUsers`);
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

type AddUserInProjectReq = {
  user_id: number;
  project_id: number;
};

export const addUserInProject = async ({
  user_id,
  project_id,
}: AddUserInProjectReq): Promise<Error | true> => {
  try {
    const response = await fetch(`/api/project/addUserInProject`, {
      method: "POST",
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
