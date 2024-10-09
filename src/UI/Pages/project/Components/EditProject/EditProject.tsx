import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { Wrapper } from "../../../../../UIKit/Wrapper";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import { SubtaskForm } from "./SubtaskForm";
import "./EditProject.css";
import { updateAllProject } from "../../../../../Lib/Slices/projectSlice/projectApi";

export type EditProjectType = {
  title: string;
  description: string;
  project_id: number;
  tasks: {
    title: string;
    description: string;
    subtasks: {
      title: string;
    }[];
  }[];
};

type Props = {
  closeModal: () => void;
};

const EditProject: React.FC<Props> = ({ closeModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    project,
    tasks: reduxTasks,
    subtasks: reduxSubtasks,
  } = useSelector((state: RootState) => state.project);

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
    if (project && reduxTasks && reduxSubtasks) {
      reset({
        title: project.title,
        description: project.description,
        project_id: project.id,
        tasks: reduxTasks.map((task) => ({
          ...task,
          subtasks: reduxSubtasks
            .filter((reduxSubtasks) => reduxSubtasks.task_id === task.id)
            .map((reduxSubtasks) => ({ ...reduxSubtasks })),
        })),
      });
    }
  }, [project, reduxTasks, reduxSubtasks, reset]);

  const formHandleSubmit = (data: EditProjectType) => {
    dispatch(updateAllProject(data));
    closeModal();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(formHandleSubmit)}
        className="create_aim_page m-3 max-w-7xl max-h-3xl text-gray-300"
      >
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
          {taskFields.map((task, task_id) => (
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
          >
          сохранить
        </Button>
      </form>
    </>
  );
};

export default EditProject;
