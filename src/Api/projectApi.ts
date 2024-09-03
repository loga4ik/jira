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
