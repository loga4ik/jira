import { useNavigate } from "react-router-dom";
import { useDeleteProjectMutation } from "../../../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../../../Lib/api/getErrorMessage";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
type Props = {
  project_id: number;
};
const DeleteModal: React.FC<Props> = ({ project_id }) => {
  const navigate = useNavigate();
  const [deleteProject, { isLoading, error }] = useDeleteProjectMutation();

  // Раньше уходили на главную, не дождавшись ответа: если удаление
  // не прошло (например, 403 у не-владельца), пользователь об этом не узнавал.
  const deleteClickHandler = async () => {
    try {
      await deleteProject(project_id).unwrap();
      navigate("/");
    } catch {
      // текст ошибки — из error мутации ниже
    }
  };

  const serverError = getErrorMessage(error);

  return (
    <div className="m-2 flex flex-col items-center justify-between">
      <p className="p-3 text-white">
        вы действительно хотите удалить данный проект?
      </p>
      {serverError && (
        <p role="alert" className="p-3 text-red-400">
          {serverError}
        </p>
      )}
      <Button
        title="удалить"
        type="button"
        className="w-fit text-white"
        bg_color={false}
        lightShadow={true}
        shadow={false}
        onClick={deleteClickHandler}
        disabled={isLoading}
      >
        {isLoading ? "удаляем…" : "удалить"}
      </Button>
    </div>
  );
};

export default DeleteModal;
