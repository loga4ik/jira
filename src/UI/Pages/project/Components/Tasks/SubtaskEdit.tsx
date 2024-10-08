import { SubtaskType } from "../../../../../Lib/Slices/projectSlice/types";
import { useForm, Controller } from "react-hook-form";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import { Radio } from "../../../../../UIKit/Inputs/Radio";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { updateSubtask } from "../../../../../Lib/Slices/projectSlice/projectApi";
import { useEffect, useState } from "react";
import { getStatusList } from "../../../../../Api/projectApi";
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
  const userList = useSelector((state: RootState) => state.project.userList);
  const dispatch = useDispatch<AppDispatch>();
  const [statusList, setStatusList] = useState<{ id: number; title: string }[]>(
    []
  );

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const res = await getStatusList(abortController);
      setStatusList(res);
    })();
    return () => abortController.abort(); // Clean up the request on unmount
  }, []);

  const { handleSubmit, register, control } = useForm<ChangeSubtask>({
    defaultValues: {
      title: subtask.title,
      user_id: undefined,
      status_id: undefined,
    },
  });

  const formOnSubmitHandler = async (data: ChangeSubtask) => {
    const abortController = new AbortController();
    await dispatch(
      updateSubtask({
        id: subtask.id,
        user_id: data.user_id,
        title: data.title,
        status_id: data.status_id,
        abortController,
      })
    );
    closeModal();
  };

  return (
    <form
      className="flex flex-col place-items-center w-2/3 justify-between m-6 text-white"
      onSubmit={handleSubmit(formOnSubmitHandler)}
    >
      <h1 className="text-xl m-1">{`${
        userList[0] ? "Делегировать задачу":'добавьте пользователей'
      }`}</h1>

      <TextInput
        className="w-full"
        inputType="text"
        placeholder="Название подзадачи"
        register={register("title")}
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
              register={register("user_id")}
            />
          ))}
      </div>

      <Button
        title="отправить"
        type="submit"
        bg_color={false}
        lightShadow={true}
        className="form_submit_btn"
      >
        Сохранить
      </Button>
    </form>
  );
};

export default SubtaskEdit;
