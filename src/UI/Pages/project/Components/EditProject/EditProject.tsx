import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import Input from "../../../../../UIKit/Inputs/Input";
import { SubtaskForm } from "./SubtaskForm";
import "./EditProject.css";

export type EditProjectType = {
  title: string;
  description: string;
  img: string | null;
  gitLink: string | null;
  tasks: {
    title: string;
    description: string;
    subtasks: {
      title: string;
    }[];
  }[];
};

const EditProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { project, tasks, subtasks } = useSelector(
    (state: RootState) => state.project
  );

  const { watch, handleSubmit, control, reset } = useForm<EditProjectType>({
    defaultValues: {
      title: project?.title,
      description: project?.description,
      tasks: [],
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
    if (project && tasks && subtasks) {
      reset({
        title: project.title,
        description: project.description,
        tasks: tasks.map((task) => ({
          ...task,
          subtasks: subtasks.filter((subtask) => subtask.task_id === task.id),
        })),
      });
    }
  }, [project, tasks, subtasks, reset]);

  const formHandleSubmit = (data: EditProjectType) => {
    // Dispatch the form data
    console.log(data);
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
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
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
              <Input
                className={"aim_input"}
                inputType="textarea"
                placeholder="описание"
                {...field}
              />
            )}
          />
        </div>
        <div className="flex flex-wrap">
          {taskFields.map((task, task_id) => (
            <Wrapper key={task_id} className="aimForm-task rounded-xl m-3">
              <Controller
                name={`tasks.${task_id}.title`}
                control={control}
                render={({ field }) => (
                  <Input
                    className={"task_input"}
                    inputType="text"
                    placeholder="Задача"
                    {...field}
                  />
                )}
              />
              <div className="subTask">
                <SubtaskForm control={control} task={task} task_id={task_id} />
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
        </div>
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
          добавить
        </Button>
        <Button className="form_btn" type="submit">
          сохранить
        </Button>
      </form>
    </>
  );
};

export default EditProject;
