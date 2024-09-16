type ProjectPai_UserRes = {
  id: number;
  login: string;
  name: string;
  surname: string;
  profile_image: string | null;
};

type SubtaskType = {
  id: number;
  title: string;
  task_id: number;
  user_id: number;
  status_id: number;
};

type TaskAndSubtasks = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  subtasks?: SubtaskType[];
};

export type { ProjectPai_UserRes, TaskAndSubtasks, SubtaskType };
