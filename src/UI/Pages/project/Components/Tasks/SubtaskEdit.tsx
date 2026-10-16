import type { SubtaskType } from "../../../../../types/ProjectTypes";
import { useForm, Controller } from "react-hook-form";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import { Radio } from "../../../../../UIKit/Inputs/Radio";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  useGetStatusesQuery,
  useGetTeamQuery,
  useUpdateSubtaskMutation,
} from "../../../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../../../Lib/api/getErrorMessage";
import { useProjectId } from "../../../../../Hooks/useProjectId";
import DropDown from "../../../../../UIKit/Inputs/DropDown";

type ChangeSubtask = {
  title: string;
  user_id: number;
  status_id: number;
};

type Props = {
  subtask: SubtaskType;
  closeModal: () => void;
};

const SubtaskEdit: React.FC<Props> = ({ subtask, closeModal }) => {
  const projectId = useProjectId();
  const { data: userList = [] } = useGetTeamQuery(projectId ?? skipToken);
  // Раньше статусы запрашивались при каждом открытии окна —
  // теперь берутся из кэша, запрос был один раз за сессию.
  const { data: statusList = [] } = useGetStatusesQuery();
  const [updateSubtask, { isLoading, error }] = useUpdateSubtaskMutation();

  const { handleSubmit, register, control } = useForm<ChangeSubtask>({
    defaultValues: {
      title: subtask.title,
      user_id: undefined,
      status_id: undefined,
    },
  });

  // Окно закрываем только после успеха — иначе показываем ошибку
  // (например, 400, если исполнитель уже не в команде).
  const formOnSubmitHandler = async (data: ChangeSubtask) => {
    if (!projectId) return;
    try {
      await updateSubtask({
        projectId,
        id: subtask.id,
        user_id: Number(data.user_id),
        title: data.title,
        status_id: data.status_id,
      }).unwrap();
      closeModal();
    } catch {
      // текст ошибки — из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error);

  return (
    <form
      className="flex flex-col place-items-center w-2/3 justify-between m-6 text-white"
      onSubmit={handleSubmit(formOnSubmitHandler)}
    >
      <h1 className="text-xl m-1">{`${
        userList[0] ? "Делегировать задачу" : "добавьте пользователей"
      }`}</h1>

      {serverError && (
        <p role="alert" className="p-3 text-red-400">
          {serverError}
        </p>
      )}

      <TextInput
        className="w-full ml-0"
        inputType="text"
        placeholder="Название подзадачи"
        register={register("title", { required: "обязательное поле" })}
      />

      {statusList.length > 0 && (
        <Controller
          control={control}
          name="status_id"
          render={({ field: { onChange, value } }) => (
            <DropDown
              options={statusList}
              placeholder="Выберите статус"
              value={value}
              onChange={onChange}
            />
          )}
        />
      )}

      <div className="m-2 place-self-start">
        {userList?.length > 0 &&
          userList.map((user) => (
            <Radio
              key={`user-${user.id}`}
              label={user.login}
              value={user.id}
              register={register("user_id", { required: "обязательное поле" })}
            />
          ))}
      </div>

      <Button
        title="отправить"
        type="submit"
        bg_color={false}
        shadow={false}
        className="form_submit_btn"
        disabled={isLoading}
      >
        {isLoading ? "Сохраняем…" : "Сохранить"}
      </Button>
    </form>
  );
};

export default SubtaskEdit;
