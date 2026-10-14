import { useNavigate, useParams } from "react-router-dom";
import { Wrapper } from "../../../UIKit/Wrapper";
import { useEffect, useState } from "react";
import Chat from "./Components/Chat/Chat";
import Sidebar from "./Components/Sidebar/Sidebar";
import TaskList from "./Components/Tasks/TaskList";
import { ProjectContextWrapper } from "../../../Context/ProjectConstext";
import { AppDispatch, RootState } from "../../../Lib/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getProjectData,
  getTeamUsers,
} from "../../../Lib/Slices/projectSlice/projectApi";
import { setDefaultProjects } from "../../../Lib/Slices/projectSlice/projectSlice";
import { isAvailableProject } from "../../../Api/projectApi";
import { ErrorMadal } from "./Components/ErrorMadal/ErrorMadal";

const Project = () => {
  // id проекта берётся из адреса /project/:id, а не из location.state:
  // так страница работает по прямой ссылке, в новой вкладке и из закладок.
  const { id } = useParams();
  const projectId = Number(id);
  const isValidId = Number.isInteger(projectId) && projectId > 0;

  const { project } = useSelector((state: RootState) => state.project);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isValidId) {
      navigate("/", { replace: true });
      return;
    }

    const abortController = new AbortController();
    // при переходе из одного проекта в другой не показываем данные прошлого
    dispatch(setDefaultProjects());

    (async () => {
      try {
        const isAvailable = await isAvailableProject(projectId, abortController);
        if (!isAvailable) {
          // не участник: данные проекта не грузим, бэк всё равно ответит 403
          setIsOpen(true);
          return;
        }
        await dispatch(getTeamUsers({ project_id: projectId, abortController }));
        await dispatch(getProjectData({ project_id: projectId, abortController }));
      } catch {
        // запрос отменён при уходе со страницы
      }
    })();

    return () => abortController.abort();
  }, [isValidId, projectId, navigate, dispatch]);

  const closeModal = () => {
    setIsOpen(false);
    navigate("/");
  };

  if (!isValidId) return null;

  return (
    <ProjectContextWrapper>
      <div className="flex mx-4 my-8 ">
        <Sidebar project_id={projectId} />
        <Wrapper className="flex-1 ml-6 p-3 min-h-96 rounded-lg relative">
          <div className="flex border px-3 py-1 border-transparent border-b-gray-400">
            <p className="font-semibold text-xl pr-2 h-full border-r border-gray-400">
              {project?.title}
            </p>
            <p className="font-normal text-xl ml-2 ">{project?.description}</p>
          </div>
          <TaskList project_id={projectId} />
        </Wrapper>
        <Chat title={project?.title} project_id={projectId} />
      </div>
      <ErrorMadal open={open} closeModal={closeModal} />
    </ProjectContextWrapper>
  );
};

export default Project;
