import React from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  useFieldArray,
} from "react-hook-form";
import { EditProjectType } from "./EditProject";
import Input from "../../../../../UIKit/Inputs/Input";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";

type Props = {
  control: Control<EditProjectType>;
  task: FieldArrayWithId<EditProjectType, "tasks", "id">;
  task_id: number;
};

export const SubtaskForm: React.FC<Props> = ({ control, task, task_id }) => {
  const {
    fields: subtaskFields,
    append: subtasksAppend,
    remove: subtasksRemove,
  } = useFieldArray({
    control,
    name: `tasks.${task_id}.subtasks`, // Correctly reference the subtasks field
  });

  return (
    <>
      {subtaskFields.map((subtask, subtask_id) => (
        <div key={`subtask${subtask_id}`} className="form_subtask">
          <Controller
            name={`tasks.${task_id}.subtasks.${subtask_id}.title`} // Corrected to "title" as per your subtask structure
            control={control}
            render={({ field }) => (
              <Input
                className={"subtask_input"}
                inputType="text"
                placeholder="Подзадача"
                {...field}
              />
            )}
          />
          <Button
            className="aimFormDelete"
            type="button"
            onClick={() => subtasksRemove(subtask_id)}
          >
            Удалить
          </Button>
        </div>
      ))}
      <Button
        className="aimFormAdd"
        type="button"
        onClick={() => subtasksAppend({ title: "" })} // Ensure "title" is appended
      >
        Добавить подзадачу
      </Button>
    </>
  );
};
