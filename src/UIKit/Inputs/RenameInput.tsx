import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import { Button } from "./Button/Button";

type FormType = {
  text: string;
};
type Props = {
  propsFunc: (text: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  deleteTodo: () => void;
  isOpen: boolean;
  text: string;
};

export const RenameInput: React.FC<Props> = ({
  propsFunc,
  setIsOpen,
  deleteTodo,
  isOpen,
  text,
}) => {
  const { register, handleSubmit, reset } = useForm<FormType>({
    defaultValues: {
      text: text,
    },
  });
  const deleteItemHandler = () => {
    deleteTodo();
  };

  const formSubmitHandler = (data: FormType) => {
    propsFunc(data.text);
    //reset - сброс значений инпута
    reset({ text: "" });
    setIsOpen(!isOpen);
  };
  return (
    <form className="edit-from" onSubmit={handleSubmit(formSubmitHandler)}>
      <Input
        className="form_input"
        inputType="text"
        placeholder="new title"
        register={register("text")}
      />
      <Button
        type="submit"
        className="edit-element  margin_left_1"
        changableIconClass="save"
      />
      <Button
        type="button"
        className="edit-element  margin_left_1"
        changableIconClass="bin"
        onClick={handleSubmit(deleteItemHandler)}
      />
    </form>
  );
};
