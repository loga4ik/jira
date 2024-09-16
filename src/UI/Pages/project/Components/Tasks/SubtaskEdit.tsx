import React from "react";
import { SubtaskType } from "../../../../../Api/types";
import { useForm } from "react-hook-form";
import Input from "../../../../../UIKit/Inputs/Input";

type ChangeSabtask = {
  title: string;
  user_id: number;
};

type Props = {
  subtask: SubtaskType;
};

const SubtaskEdit: React.FC<Props> = ({ subtask }) => {
  console.log(subtask);
  const { handleSubmit, register } = useForm<ChangeSabtask>({
    defaultValues: {
      title: subtask.title,
      user_id: undefined,
    },
  });
  const formOnSubmitHandler = (data: ChangeSabtask) => {
    (async () => {
      console.log(data);
    })();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(formOnSubmitHandler)}>
        <Input
          className="w-1/2"
          inputType="text"
          placeholder="login"
          register={register("title")}
        />
      </form>
    </div>
  );
};

export default SubtaskEdit;
