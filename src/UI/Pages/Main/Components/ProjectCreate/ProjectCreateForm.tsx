import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./EditProject.css";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { CreateSubtaskForm } from "./CreateSubtaskForm";
import { EditProjectType } from "../../../project/Components/EditProject/EditProject";
import Input from "../../../../../UIKit/Inputs/Input";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";

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
    console.log(data);
    // dispatch(createProject(data)); // Вы можете раскомментировать, чтобы добавить логику сохранения
    navigate("/");
  };

  const GoBackHandleSubmit = () => {
    navigate("/");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page m-3 max-w-7xl max-h-3xl"
      >
        <div className="flex flex-col">
          <Input
            inputType="text"
            placeholder="название"
            className="aim_input"
            register={register("title")}
            // {...register("title")}
          />
          <Input
            inputType="text"
            placeholder="описание"
            className="aim_input"
            register={register("description")}
          />
          <Button
            className="form_btn"
            type="button"
            onClick={GoBackHandleSubmit}
          >
            назад
          </Button>
        </div>
        {taskFields.map((task, task_id) => (
          <Wrapper key={task_id} className="aimForm-task rounded-xl m-3 w-96">
            <Input
              inputType="text"
              placeholder="задача"
              className="task_input"
              register={register(`tasks.${task_id}.title`)}
            />
            <Input
              inputType="text"
              placeholder="описание"
              className="task_input"
              register={register(`tasks.${task_id}.description`)}
            />
            <div className="subTask">
              <CreateSubtaskForm control={control} task_id={task_id} />
            </div>
            <Button
              className="form_btn"
              type="button"
              onClick={() => tasksRemove(task_id)}
            >
              удалить
            </Button>
          </Wrapper>
        ))}
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
      </form>
    </>
  );
};
