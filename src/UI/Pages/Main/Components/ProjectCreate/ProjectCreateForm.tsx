import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EditProject.css";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { CreateSubtaskForm } from "./CreateSubtaskForm";
import { EditProjectType } from "../../../project/Components/EditProject/EditProject";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import { createNewProject } from "../../../../../Lib/Slices/projectSlice/projectApi";
import TextInput from "../../../../../UIKit/Inputs/TextInput";

export type CreateProjectType = Omit<EditProjectType, "project_id"> & {
  user_id: number;
};

export const ProjectCreateForm = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
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

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const formHandleSubmit = (data: CreateProjectType) => {
    (async () => {
      const res = await dispatch(createNewProject(data)); // Вы можете раскомментировать, чтобы добавить логику сохранения
      if (typeof res.payload !== "string" && res.payload?.project) {
        navigate("/project", { state: res.payload.project });
      }
    })();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page p-3 max-w-7xl max-h-3xl bg-gray-300"
      >
        <div className="flex flex-col">
          <TextInput
            inputType="text"
            placeholder="название проекта"
            className="aim_input"
            register={register("title")}
          />
          <TextInput
            inputType="text"
            placeholder="описание"
            className="aim_input"
            register={register("description")}
          />
        </div>
        <div className="flex flex-wrap">
          {taskFields.map((task, task_id) => (
            <Wrapper key={task_id} className="aimForm-task rounded-xl m-3 w-96">
              <TextInput
                inputType="text"
                placeholder="задача"
                className="task_input"
                register={register(`tasks.${task_id}.title`)}
              />
              <TextInput
                inputType="text"
                placeholder="описание"
                className="task_input"
                register={register(`tasks.${task_id}.description`)}
              />
              <div className="subTask pl-2">
                <CreateSubtaskForm control={control} task_id={task_id} />
              </div>
              <div className="w-full flex flex-row-reverse">
                <Button
                  className="form_btn m-3 mt-0 px-2 py-1"
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
            className="form_btn"
            type="button"
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

          <Button className="form_btn" type="submit">
            сохранить
          </Button>
        </div>
      </form>
    </>
  );
};
