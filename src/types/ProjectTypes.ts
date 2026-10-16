type UserType = {
  id: number;
  login: string;
  name: string;
  surname: string;
  profile_image: string | null;
};

type Project = {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  gitLink: string;
  img: string;
  owner: boolean;
  createdAt: Date;
  updateAt: Date;
};

type SubtaskType = {
  id: number;
  title: string;
  task_id: number;
  user_id: number;
  status_id: number;
  createdAt: Date;
  updateAt: Date;
};

type TaskType = {
  id: number;
  project_id: number;
  title: string;
  description: string;
  createdAt: Date;
  updateAt: Date;
};

/** Задачи и подзадачи проекта — ответ GET /task/getTasksAndSubtasks/:id. */
type TaskAndSubtasks = {
  tasks: TaskType[];
  subtasks: SubtaskType[];
};

type StatusType = {
  id: number;
  title: string;
};

type UserProjectsType = {
  owner: Project[];
  working: Project[];
};

export type {
  UserType,
  TaskAndSubtasks,
  TaskType,
  SubtaskType,
  Project,
  UserProjectsType,
  StatusType,
};
