import React from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { EditProjectType } from "./EditProject";
import TextInput from "../../../../../UIKit/Inputs/TextInput";

type Props = {
  control: Control<EditProjectType>;
  task_id: number;
};

export const SubtaskForm: React.FC<Props> = ({ control, task_id }) => {
  const { fields: subtaskFields } = useFieldArray({
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
              <TextInput
                className={"subtask_input"}
                inputType="text"
                placeholder="Подзадача"
                {...field}
              />
            )}
          />
        </div>
      ))}
    </>
  );
};
