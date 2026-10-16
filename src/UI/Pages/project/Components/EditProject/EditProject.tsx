import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import { SubtaskForm } from "./SubtaskForm";
import "./EditProject.css";
import {
  useGetProjectQuery,
  useGetTasksQuery,
  useUpdateProjectMutation,
  type UpdateProjectBody,
} from "../../../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../../../Lib/api/getErrorMessage";
import { useProjectId } from "../../../../../Hooks/useProjectId";

export type EditProjectType = UpdateProjectBody;

type Props = {
  closeModal: () => void;
};

const EditProject: React.FC<Props> = ({ closeModal }) => {
  const projectId = useProjectId();
  // проект и задачи уже в кэше — их загрузила страница, запросов не будет
  const { data: project } = useGetProjectQuery(projectId ?? skipToken);
  const { data: tasksData } = useGetTasksQuery(projectId ?? skipToken);
  const [updateProject, { isLoading, error }] = useUpdateProjectMutation();

  const { handleSubmit, control, reset } = useForm<EditProjectType>({
    defaultValues: {
      title: project?.title,
      description: project?.description,
      project_id: project?.id,
      tasks: [],
    },
  });

  const { fields: taskFields } = useFieldArray({
    control,
    name: "tasks",
  });

  useEffect(() => {
    if (project && tasksData) {
      reset({
        title: project.title,
        description: project.description,
        project_id: project.id,
        tasks: tasksData.tasks.map((task) => ({
          ...task,
          subtasks: tasksData.subtasks
            .filter((subtask) => subtask.task_id === task.id)
            .map((subtask) => ({ ...subtask })),
        })),
      });
    }
  }, [project, tasksData, reset]);

  // Окно закрываем только после успешного сохранения — иначе показываем ошибку
  // (например, 403, если пользователь не владелец проекта).
  // Обновлять стор руками не нужно: мутация сбросит теги проекта, задач
  // и списка на главной, и они перезапросятся сами.
  const formHandleSubmit = async (data: EditProjectType) => {
    try {
      await updateProject(data).unwrap();
      closeModal();
    } catch {
      // текст ошибки — из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error, {}, "Не удалось сохранить изменения");

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page m-3 max-w-7xl max-h-3xl text-gray-300"
      >
        {serverError && (
          <p role="alert" className="p-3 text-red-400">
            {serverError}
          </p>
        )}
        <div className="flex flex-col">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextInput
                className={"aim_input"}
                inputType="text"
                placeholder="назване"
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextInput
                className={"aim_input"}
                inputType="textarea"
                placeholder="описание"
                {...field}
              />
            )}
          />
        </div>
        <div className="flex flex-wrap">
          {taskFields.map((_, task_id) => (
            <Wrapper
              key={task_id}
              lightShadow={true}
              className="aimForm-task rounded-xl m-3 w-96"
              shadow={false}
            >
              <Controller
                name={`tasks.${task_id}.title`}
                control={control}
                render={({ field }) => (
                  <TextInput
                    className={"task_input"}
                    inputType="text"
                    placeholder="Задача"
                    {...field}
                  />
                )}
              />
              <div className="subTask mb-3">
                <SubtaskForm control={control} task_id={task_id} />
              </div>
            </Wrapper>
          ))}
        </div>
        <Button
          title="отправить"
          className="form_btn"
          bg_color={false}
          lightShadow={true}
          type="submit"
          shadow={false}
          disabled={isLoading}
        >
          {isLoading ? "сохраняем…" : "сохранить"}
        </Button>
      </form>
    </>
  );
};

export default EditProject;
