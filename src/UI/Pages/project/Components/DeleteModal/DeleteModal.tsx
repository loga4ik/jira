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
  const abortController = new AbortController();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const deleteClickHandler = () => {
    deleteProject(project_id, abortController);
    navigate("/");
    dispatch(setDefaultProjects());
  };

  return (
    <div className="m-2 flex flex-col items-center justify-between">
      <p className="p-3 text-white">
        вы действительно хотите удалить данный проект?
      </p>
      <Button
        type="button"
        className="w-fit text-white"
        bg_color={false}
        lightShadow={true}
        onClick={deleteClickHandler}
      >
        удалить
      </Button>
    </div>
  );
};

export default DeleteModal;
