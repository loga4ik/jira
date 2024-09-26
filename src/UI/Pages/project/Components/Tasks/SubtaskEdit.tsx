import { SubtaskType } from "../../../../../Lib/Slices/projectSlice/types";
import { useForm } from "react-hook-form";
import TextInput from "../../../../../UIKit/Inputs/TextInput";
import { Radio } from "../../../../../UIKit/Inputs/Radio";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { updateSubtask } from "../../../../../Lib/Slices/projectSlice/projectApi";

type ChangeSabtask = {
  title: string;
  user_id: number;
};

type Props = {
  subtask: SubtaskType;
  closeModal: () => void;
};

const SubtaskEdit: React.FC<Props> = ({ subtask, closeModal }) => {
  const userList = useSelector((state: RootState) => state.project.userList);
  const dispatch = useDispatch<AppDispatch>();

  const { handleSubmit, register } = useForm<ChangeSabtask>({
    defaultValues: {
      title: subtask.title,
      user_id: undefined,
    },
  });

  const formOnSubmitHandler = (data: ChangeSabtask) => {
    (async () => {
      const abortController = new AbortController();
      dispatch(
        updateSubtask({
          id: subtask.id,
          user_id: data.user_id,
          title: data.title,
          abortController,
        })
      );
      closeModal();
    })();
  };

  return (
    <div className="flex flex-col place-items-center h-full">
      <form
        className="flex flex-col place-items-center w-fit h-full justify-between"
        onSubmit={handleSubmit(formOnSubmitHandler)}
      >
        <h1 className="text-xl m-1">делегировать задачу</h1>
        <TextInput
          className="w-full"
          inputType="text"
          placeholder="login"
          register={register("title")}
        />
        <div className="m-2 place-self-start">
          {userList &&
            userList?.length &&
            userList?.map(
              (user) =>
                user.id && (
                  <Radio
                    key={`user-${user.id}`}
                    label={user.login}
                    value={user.id}
                    register={register("user_id")}
                  />
                )
            )}
        </div>
        <Button type="submit" className={"form_submit_btn"}>
          сохранить
        </Button>
      </form>
    </div>
  );
};

export default SubtaskEdit;
