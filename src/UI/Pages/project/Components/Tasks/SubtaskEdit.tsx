import { SubtaskType } from "../../../../../Lib/Slices/projectSlice/types";
import { useForm } from "react-hook-form";
import Input from "../../../../../UIKit/Inputs/Input";
import { Radio } from "../../../../../UIKit/Inputs/Radio";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { updateSubtask } from "../../../../../Lib/Slices/projectSlice/projectApi";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";

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

  const { handleSubmit, register } = useForm<ChangeSabtask>({
    defaultValues: {
      title: subtask.title,
      user_id: undefined,
    },
  });

  const formOnSubmitHandler = (data: ChangeSabtask) => {
    (async () => {
      const res = updateSubtask(subtask.id, data.user_id, data.title);
      console.log(res);
      closeModal();
    })();
  };

  return (
    <div className="flex flex-col place-items-center h-full">
      <form
        className="flex flex-col place-items-center w-fit h-full justify-between"
        onSubmit={handleSubmit(formOnSubmitHandler)}
      >
        <h1 className="text-xl m-1">делигировать задачу</h1>
        <Input
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
