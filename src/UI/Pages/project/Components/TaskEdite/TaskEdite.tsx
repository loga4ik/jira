import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import { editeTask } from "../../../../../Lib/Slices/projectSlice/projectApi";

export type EditeTaskType = {
  id: number;
  title: string;
  description: string;
  subtasks: { id: number | undefined; title: string }[];
};

type Props = {
  closeModal: () => void;
  task_id: number;
};

export const TaskEdite: React.FC<Props> = ({ closeModal, task_id }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { tasks: reduxTasks, subtasks: reduxSubtasks } = useSelector(
    (state: RootState) => state.project
  );

  // Мемоизируем значения для использования в defaultValues
  const defaultValues = useMemo(() => {
    const currentTask = reduxTasks.find((task) => task.id === task_id);

    const subtaskArr = reduxSubtasks
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
  }, [reduxTasks, reduxSubtasks, task_id]);

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

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const formHandleSubmit = (data: EditeTaskType) => {
    (async () => {
      dispatch(editeTask(data));
      closeModal();
      // Логика сохранения
    })();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page p-3 max-w-7xl max-h-3xl text-gray-300"
      >
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
          {subtaskFields.map((subtask, subtask_id) => (
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
          >
            сохранить
          </Button>
        </div>
      </form>
    </>
  );
};
