import { api } from "../api";
import type {
  Project,
  StatusType,
  SubtaskType,
  TaskAndSubtasks,
  TaskType,
  UserProjectsType,
  UserType,
} from "../../../types/ProjectTypes";

/** Что отправляем при создании проекта. Владельца сервер берёт из токена. */
export type CreateProjectBody = {
  title: string;
  description: string;
  tasks: {
    title: string;
    description: string;
    subtasks: { title: string }[];
  }[];
};

export type ProjectWithTasks = {
  project: Project;
  tasks: TaskType[];
  subtasks: SubtaskType[];
};

/** Форма редактирования проекта целиком: название, описание, задачи и подзадачи. */
export type UpdateProjectBody = {
  title: string;
  description: string;
  project_id: number;
  tasks: {
    title: string;
    description: string;
    subtasks: { title: string }[];
  }[];
};

/** Форма редактирования одной задачи. Подзадача без id — новая. */
export type EditTaskBody = {
  id: number;
  title: string;
  description: string;
  subtasks: { id: number | undefined; title: string }[];
};

export type UpdateSubtaskBody = {
  id: number;
  title: string;
  user_id: number;
  status_id: number;
};

/** Участник проекта: кто и в каком проекте. */
type MemberArg = { projectId: number; userId: number };

/*
 * Теги — «метки» на данных в кэше. Запрос объявляет, какие метки висят
 * на его ответе (providesTags), мутация — какие метки она сбрасывает
 * (invalidatesTags). Сброшенные данные, на которые кто-то подписан,
 * перезапрашиваются сами.
 *
 *   Project/LIST — список проектов на главной
 *   Project/5    — сам проект 5
 *   Tasks/5      — задачи и подзадачи проекта 5
 *   Team/5       — команда проекта 5 и список «кого можно добавить»
 */
const PROJECT_LIST = { type: "Project", id: "LIST" } as const;
const projectTag = (id: number) => ({ type: "Project" as const, id });
const tasksTag = (projectId: number) => ({ type: "Tasks" as const, id: projectId });
const teamTag = (projectId: number) => ({ type: "Team" as const, id: projectId });

/** Бэк может вернуть одного человека дважды (владелец ещё и в команде). */
const uniqueById = (users: UserType[]) => [
  ...new Map(users.filter(Boolean).map((user) => [user.id, user])).values(),
];

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ─── главная ──────────────────────────────────────────────────────────

    /** Проекты пользователя: где он владелец и где участник. */
    getUserProjects: builder.query<UserProjectsType, number>({
      query: (userId) => `/project/getUserProjects/${userId}`,
      // Тег на список и на каждый проект: удаление одного проекта
      // сбросит и сам проект, и список.
      providesTags: (result) => [
        PROJECT_LIST,
        ...[...(result?.owner ?? []), ...(result?.working ?? [])].map(({ id }) =>
          projectTag(id),
        ),
      ],
    }),

    createProject: builder.mutation<ProjectWithTasks, CreateProjectBody>({
      query: (body) => ({ url: "/project/create", method: "POST", body }),
      invalidatesTags: [PROJECT_LIST],
    }),

    deleteProject: builder.mutation<void, number>({
      query: (projectId) => ({ url: `/project/${projectId}`, method: "DELETE" }),
      invalidatesTags: (_result, error, projectId) =>
        // не удалилось (403, 500) — кэш верный, сбрасывать нечего
        error ? [] : [PROJECT_LIST, projectTag(projectId)],
    }),

    // ─── страница проекта: чтение ─────────────────────────────────────────

    /**
     * Сам проект. Заодно это проверка доступа: постороннему сервер
     * отвечает 403, на несуществующий проект — 404. Отдельный запрос
     * «есть ли доступ» (/team/isAvailable) больше не нужен.
     */
    getProject: builder.query<Project, number>({
      query: (projectId) => `/project/${projectId}`,
      // бэк отдаёт массив из одного проекта (findAll)
      transformResponse: (response: Project[]) => response[0],
      providesTags: (_result, _error, projectId) => [projectTag(projectId)],
    }),

    getTasks: builder.query<TaskAndSubtasks, number>({
      query: (projectId) => `/task/getTasksAndSubtasks/${projectId}`,
      transformResponse: (response: Partial<TaskAndSubtasks>) => ({
        tasks: response.tasks ?? [],
        subtasks: response.subtasks ?? [],
      }),
      providesTags: (_result, _error, projectId) => [tasksTag(projectId)],
    }),

    /** Команда проекта вместе с владельцем. */
    getTeam: builder.query<UserType[], number>({
      query: (projectId) => `/team/${projectId}`,
      transformResponse: uniqueById,
      providesTags: (_result, _error, projectId) => [teamTag(projectId)],
    }),

    /** Кого ещё можно добавить в команду (только для владельца). */
    getFreeUsers: builder.query<UserType[], number>({
      // чтение через POST — так устроен бэк
      query: (projectId) => ({
        url: "/project/getFreeUsers",
        method: "POST",
        body: { project_id: projectId },
      }),
      // тот же тег, что у команды: добавили участника — оба списка обновятся
      providesTags: (_result, _error, projectId) => [teamTag(projectId)],
    }),

    /** Справочник статусов. Одинаков для всех и не меняется — грузим раз в час. */
    getStatuses: builder.query<StatusType[], void>({
      query: () => "/status",
      keepUnusedDataFor: 60 * 60,
    }),

    // ─── страница проекта: изменения ──────────────────────────────────────

    /** Название, описание, задачи и подзадачи проекта — одной формой. */
    updateProject: builder.mutation<ProjectWithTasks, UpdateProjectBody>({
      query: (body) => ({ url: "/project/updateAll", method: "PUT", body }),
      invalidatesTags: (_result, error, { project_id }) =>
        error
          ? []
          : // название видно и на главной — сбрасываем и список
            [projectTag(project_id), tasksTag(project_id), PROJECT_LIST],
    }),

    editTask: builder.mutation<unknown, EditTaskBody & { projectId: number }>({
      // projectId нужен только для тега — на сервер не отправляем
      query: ({ id, title, description, subtasks }) => ({
        url: `/task/edite/${id}`,
        method: "POST",
        body: { title, description, subtasks },
      }),
      invalidatesTags: (_result, error, { projectId }) =>
        error ? [] : [tasksTag(projectId)],
    }),

    /**
     * Статус, исполнитель и название подзадачи. Меняют часто, поэтому
     * не перезапрашиваем все задачи проекта, а заменяем одну подзадачу
     * прямо в кэше getTasks ответом сервера.
     */
    updateSubtask: builder.mutation<
      SubtaskType,
      UpdateSubtaskBody & { projectId: number }
    >({
      query: ({ id, title, user_id, status_id }) => ({
        url: "/subtask/addUserInSubtaskRename",
        method: "PUT",
        body: { id, title, user_id, status_id },
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData("getTasks", projectId, (draft) => {
              // draft — черновик Immer: «мутируем», а в стор уходит новая копия
              const index = draft.subtasks.findIndex(({ id }) => id === updated.id);
              if (index !== -1) draft.subtasks[index] = updated;
            }),
          );
        } catch {
          // ошибку покажет форма через error мутации
        }
      },
    }),

    addMember: builder.mutation<unknown, MemberArg>({
      query: ({ projectId, userId }) => ({
        url: "/team/create",
        method: "PUT",
        body: { user_id: userId, project_id: projectId },
      }),
      invalidatesTags: (_result, error, { projectId }) =>
        error ? [] : [teamTag(projectId)],
    }),

    removeMember: builder.mutation<unknown, MemberArg>({
      query: ({ projectId, userId }) => ({
        url: `/team/deleteUser/${userId}`,
        method: "DELETE",
        body: { project_id: projectId },
      }),
      // с подзадач удалённого участника сервер снимает исполнителя —
      // поэтому сбрасываем и задачи
      invalidatesTags: (_result, error, { projectId }) =>
        error ? [] : [teamTag(projectId), tasksTag(projectId)],
    }),
  }),
});

export const {
  useGetUserProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectQuery,
  useGetTasksQuery,
  useGetTeamQuery,
  useGetFreeUsersQuery,
  useGetStatusesQuery,
  useUpdateProjectMutation,
  useEditTaskMutation,
  useUpdateSubtaskMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = projectApi;
