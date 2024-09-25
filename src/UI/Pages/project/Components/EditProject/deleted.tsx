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
import { updateAllProject } from "../../../../../Lib/Slices/projectSlice/projectApi";

export type EditProjectType = {
  title: string;
  description: string;
  // img: string | null;
  // gitLink: string | null;
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
  const {
    project,
    tasks: reduxTasks,
    subtasks: reduxSubtasks,
  } = useSelector((state: RootState) => state.project);

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
    if (project && reduxTasks && reduxSubtasks) {
      reset({
        title: project.title,
        description: project.description,
        tasks: reduxTasks.map((task) => ({
          title: task.title,
          description: task.description,
          subtasks: reduxSubtasks
            .filter((reduxSubtasks) => reduxSubtasks.task_id === task.id)
            .map((reduxSubtasks) => ({ title: reduxSubtasks.title })),
        })),
      });
    }
  }, [project, reduxTasks, reduxSubtasks, reset]);

  const formHandleSubmit = (data: EditProjectType) => {
    console.log(data);
    
    const { tasks, ...projectData } = data;
    const editedTasks: { id?: number; project_id?: number; title: string }[] =
      [];
    const editedSubtasks: { id?: number; task_id?: number; title: string }[] =
      [];

    // Убираем subtasks из tasks
    const formTasks = tasks?.map(({ subtasks, ...rest }) => rest);
    // Собираем все subtasks
    const formSubtasks = tasks?.flatMap((task) => task.subtasks);

    // Функция для извлечения только общих полей (например, title)
    const extractCommonFields = (item: any) => ({
      title: item.title,
    });

    // Преобразуем данные формы и данные из Redux, чтобы они содержали только общие поля
    const formTasksCommon = formTasks?.map(extractCommonFields) || [];
    const reduxTasksCommon = reduxTasks.map((task) => ({
      id: task.id,
      title: task.title,
    }));

    const formSubtasksCommon = formSubtasks?.map(extractCommonFields) || [];
    const reduxSubtasksCommon = reduxSubtasks.map((subtask) => ({
      id: subtask.id,
      title: subtask.title,
    }));

    // Сравниваем задачи и добавляем несопадающие или новые в editedTasks
    formTasksCommon.forEach((formTask, index) => {
      const correspondingReduxTask = reduxTasksCommon.find(
        (reduxTask) => reduxTask.title === formTask.title
      );

      if (!correspondingReduxTask) {
        // Если task не найден в reduxTasks (новый task)
        editedTasks.push({ ...formTask });
      } else if (
        JSON.stringify(formTask) !==
        JSON.stringify(extractCommonFields(correspondingReduxTask))
      ) {
        // Если task найден, но он изменен
        editedTasks.push({ ...formTask, id: correspondingReduxTask.id });
      }
    });

    // Сравниваем подзадачи и добавляем несопадающие или новые в editedSubtasks
    formSubtasksCommon.forEach((formSubtask, index) => {
      const correspondingReduxSubtask = reduxSubtasksCommon.find(
        (reduxSubtask) => reduxSubtask.title === formSubtask.title
      );

      if (!correspondingReduxSubtask) {
        // Если subtask не найден в reduxSubtasks (новый subtask)
        editedSubtasks.push({ ...formSubtask });
      } else if (
        JSON.stringify(formSubtask) !==
        JSON.stringify(extractCommonFields(correspondingReduxSubtask))
      ) {
        // Если subtask найден, но он изменен
        editedSubtasks.push({
          ...formSubtask,
          id: correspondingReduxSubtask.id,
        });
      }
    });

    // Отправляем обновленные данные
    dispatch(
      updateAllProject({
        title:
          projectData.title !== project?.title ? projectData.title : undefined,
        description:
          projectData.description !== project?.description
            ? projectData.description
            : undefined,
        tasks: editedTasks,
        subtasks: editedSubtasks,
      })
    );
  };

  // const GoBackHandleSubmit = () => {
  //   navigate("/");
  // };

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
            <Wrapper key={task_id} className="aimForm-task rounded-xl m-3 w-96">
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
