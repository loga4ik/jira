import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProject } from "../../../../../Api/projectApi";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { AppDispatch } from "../../../../../Lib/store";
import { useDispatch } from "react-redux";
import { setDefaultProjects } from "../../../../../Lib/Slices/projectSlice/projectSlice";
type Props = {
  project_id: number;
};
const DeleteModal: React.FC<Props> = ({ project_id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string>();

  // Раньше уходили на главную, не дождавшись ответа: если удаление
  // не прошло (например, 403 у не-владельца), пользователь об этом не узнавал.
  const deleteClickHandler = async () => {
    try {
      await deleteProject(project_id, new AbortController());
      dispatch(setDefaultProjects());
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить проект");
    }
  };

  return (
    <div className="m-2 flex flex-col items-center justify-between">
      <p className="p-3 text-white">
        вы действительно хотите удалить данный проект?
      </p>
      {error && (
        <p role="alert" className="p-3 text-red-400">
          {error}
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
      >
        удалить
      </Button>
    </div>
  );
};

export default DeleteModal;
