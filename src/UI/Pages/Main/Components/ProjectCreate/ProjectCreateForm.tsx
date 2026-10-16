import { useEffect } from "react";
import "./EditProject.css";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useCurrentUser } from "../../../../../Hooks/useCurrentUser";
import { CreateSubtaskForm } from "./CreateSubtaskForm";
import { EditProjectType } from "../../../project/Components/EditProject/EditProject";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import { useCreateProjectMutation } from "../../../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../../../Lib/api/getErrorMessage";
import TextInput from "../../../../../UIKit/Inputs/TextInput";

export type CreateProjectType = Omit<EditProjectType, "project_id"> & {
  user_id: number;
};

export const ProjectCreateForm = () => {
  const { currentUser, isLoading: isUserLoading } = useCurrentUser();
  const [createProject, { isLoading, error }] = useCreateProjectMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, control } = useForm<CreateProjectType>({
    defaultValues: {
      user_id: currentUser?.id,
      title: "",
      description: "",
      tasks: [
        {
          title: "",
          description: "",
          subtasks: [{ title: "" }],
        },
      ],
    },
  });

  const {
    fields: taskFields,
    append: tasksAppend,
    remove: tasksRemove,
  } = useFieldArray({
    control,
    name: "tasks",
  });

  // уводим, только когда точно известно, что пользователя нет:
  // пока он загружается, currentUser тоже undefined
  useEffect(() => {
    if (!isUserLoading && !currentUser) {
      navigate("/");
    }
  }, [isUserLoading, currentUser, navigate]);

  const formHandleSubmit = async ({ title, description, tasks }: CreateProjectType) => {
    try {
      // user_id не отправляем: владельца сервер берёт из токена
      const { project } = await createProject({ title, description, tasks }).unwrap();
      navigate(`/project/${project.id}`);
    } catch {
      // текст ошибки — из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error);

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page p-3 max-w-7xl max-h-3xl "
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
            inputType="text"
            placeholder="описание"
            className="aim_input"
            register={register("description", { required: "обязательное поле" })}
          />
        </div>
        <div className="flex flex-wrap">
          {taskFields.map((_, task_id) => (
            <Wrapper
              key={task_id}
              shadow={false}
              className="aimForm-task rounded-xl m-3 w-96"
            >
              <TextInput
                inputType="text"
                placeholder="задача"
                className="task_input"
                register={register(`tasks.${task_id}.title`, { required: "обязательное поле" })}
              />
              <TextInput
                inputType="text"
                placeholder="описание"
                className="task_input"
                register={register(`tasks.${task_id}.description`, { required: "обязательное поле" })}
              />
              <div className="subTask pl-2">
                <CreateSubtaskForm control={control} task_id={task_id} />
              </div>
              <div className="w-full flex flex-row-reverse">
                <Button
                  title="удалить"
                  className="form_btn m-3 mt-0 px-2 py-1 w-fit text-white"
                  shadow={false}
                  bg_color={false}
                  type="button"
                  defaultMP={false}
                  onClick={() => tasksRemove(task_id)}
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
            type="button"
            className="w-fit text-white"
            shadow={false}
            bg_color={false}
            onClick={() =>
              tasksAppend({
                title: "",
                description: "",
                subtasks: [{ title: "" }],
              })
            }
          >
            добавить задачу
          </Button>

          <Button
            title="отправить"
            className="w-fit text-white"
            shadow={false}
            bg_color={false}
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
