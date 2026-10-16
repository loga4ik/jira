import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import {
  useEditTaskMutation,
  useGetTasksQuery,
  type EditTaskBody,
} from "../../../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../../../Lib/api/getErrorMessage";
import { useProjectId } from "../../../../../Hooks/useProjectId";

export type EditeTaskType = EditTaskBody;

type Props = {
  closeModal: () => void;
  task_id: number;
};

export const TaskEdite: React.FC<Props> = ({ closeModal, task_id }) => {
  const projectId = useProjectId();
  const { data: tasksData } = useGetTasksQuery(projectId ?? skipToken);
  const [editTask, { isLoading, error }] = useEditTaskMutation();

  // Мемоизируем значения для использования в defaultValues
  const defaultValues = useMemo(() => {
    const currentTask = tasksData?.tasks.find((task) => task.id === task_id);

    const subtaskArr = (tasksData?.subtasks ?? [])
      .filter((subtask) => subtask.task_id === task_id)
      .map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
      }));

    return {
      id: task_id,
      title: currentTask?.title || "",
      description: currentTask?.description || "",
      subtasks: subtaskArr.length ? subtaskArr : [{ title: "" }],
    };
  }, [tasksData, task_id]);

  const { register, handleSubmit, control } = useForm<EditeTaskType>({
    defaultValues, // Используем мемоизированные значения
  });

  const {
    fields: subtaskFields,
    append: subtasksAppend,
    remove: subtasksRemove,
  } = useFieldArray({
    control,
    name: "subtasks",
  });

  // Раньше окно закрывалось сразу, не дожидаясь ответа: ошибка сохранения
  // терялась. Теперь закрываем только после успеха.
  const formHandleSubmit = async (data: EditeTaskType) => {
    if (!projectId) return;
    try {
      await editTask({ ...data, projectId }).unwrap();
      closeModal();
    } catch {
      // текст ошибки — из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error, {}, "Не удалось сохранить задачу");

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page p-3 max-w-7xl max-h-3xl text-gray-300"
      >
        {serverError && (
          <p role="alert" className="p-3 text-red-400">
            {serverError}
          </p>
        )}
        <div className="flex flex-col">
          <TextInput
            inputType="text"
            placeholder="название проекта"
            className="aim_input"
            register={register("title", { required: "обязательное поле" })}
          />
          <TextInput
            inputType="textarea"
            placeholder="описание"
            className="aim_input"
            register={register("description", { required: "обязательное поле" })}
          />
        </div>
        <div className="flex flex-wrap">
          {subtaskFields.map((_, subtask_id) => (
            <Wrapper
              key={subtask_id}
              lightShadow={true}
              className="aimForm-task rounded-xl m-3 w-96"
              shadow={false}
            >
              <TextInput
                inputType="text"
                placeholder="задача"
                className="task_input"
                register={register(`subtasks.${subtask_id}.title`, { required: "обязательное поле" })}
              />
              <div className="w-full flex flex-row-reverse">
                <Button
                  title="удалить"
                  className="form_btn m-3 mt-0 px-2 py-1"
                  type="button"
                  defaultMP={false}
                  bg_color={false}
                  lightShadow={true}
                  shadow={false}
                  onClick={() => subtasksRemove(subtask_id)}
                >
                  удалить
                </Button>
              </div>
            </Wrapper>
          ))}
        </div>
        <div className="flex justify-between">
          <Button
            title="добавить"
            className="form_btn"
            type="button"
            bg_color={false}
            lightShadow={true}
            shadow={false}
            onClick={() =>
              subtasksAppend({
                id: undefined,
                title: "",
              })
            }
          >
            добавить задачу
          </Button>

          <Button
            title="отправить"
            className="form_btn"
            bg_color={false}
            lightShadow={true}
            shadow={false}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "сохраняем…" : "сохранить"}
          </Button>
        </div>
      </form>
    </>
  );
};
