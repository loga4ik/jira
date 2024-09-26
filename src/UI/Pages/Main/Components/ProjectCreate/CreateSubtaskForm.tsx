import React, { useContext } from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { CreateProjectType } from "./ProjectCreateForm";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import TextInput from "../../../../../UIKit/Inputs/TextInput";

type Props = {
  control: Control<CreateProjectType>;
  task_id: number;
};

export const CreateSubtaskForm: React.FC<Props> = ({ control, task_id }) => {
  const {
    fields: subtakFields,
    append: subtasksAppend,
    remove: subtasksRemove,
  } = useFieldArray({
    control,
    name: `tasks.${task_id}.subtasks`,
  });

  return (
    <>
      {subtakFields.map((subtask, subtask_id) => (
        <div key={`subtask${subtask_id}`} className="form_subtask flex items-center">
          <TextInput
            className={"subtask_input"}
            inputType="text"
            placeholder="подзача"
            register={control.register(
              `tasks.${task_id}.subtasks.${subtask_id}.title`
            )}
          />
          <Button
            className="h-8 w-8 rounded-full"
            defaultMP={false}
            defaultBorder={false}
            changableIconClass="cross"
            type="button"
            onClick={() => subtasksRemove(subtask_id)}
          />
        </div>
      ))}
      <Button
        className="h-8 w-8 rounded-full"
        defaultMP={false}
        defaultBorder={false}
        changableIconClass="add"
        type="button"
        onClick={() => subtasksAppend({ title: "" })}
      />
    </>
  );
};
