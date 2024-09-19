import { GetFreeUsers } from "./projectApi";
import { UserType } from "../Lib/Slices/projectSlice/types";

export const getUserList = async (
  project_id: number
): Promise<Error | UserType[]> => {
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
