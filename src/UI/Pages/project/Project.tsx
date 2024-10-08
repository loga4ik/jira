import { useLocation, useNavigate } from "react-router-dom";
import { CardData } from "../../../UIKit/Card";
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
  getUserList,
} from "../../../Lib/Slices/projectSlice/projectApi";
import { isAvailableProject } from "../../../Api/projectApi";
import { ErrorMadal } from "./Components/ErrorMadal/ErrorMadal";

const Project = () => {
  const location = useLocation();
  const state = location.state as CardData;
  const { userList, project } = useSelector(
    (state: RootState) => state.project
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    if (!state?.id) {
      navigate("/login");
      return;
    }

    (async () => {
      const abortController = new AbortController();
      const isAvailable = await isAvailableProject(state.id, abortController);
      if (!isAvailable) {
        setIsOpen(true);
      }

      await dispatch(
        getUserList({
          project_id: state.id,
          abortController,
        })
      );
      await dispatch(getProjectData({ project_id: state.id, abortController }));
    })();
  }, [state, navigate, dispatch]);

  const closeModal = () => {
    setIsOpen(!open);
    navigate("/");
  };

  return (
    <ProjectContextWrapper>
      <div className="flex mx-4 my-8 ">
        <Sidebar project_id={state.id} />
        <Wrapper className="flex-1 ml-6 p-3 min-h-96 rounded-lg relative">
          {state && (
            <div className="flex border px-3 py-1 border-transparent border-b-gray-400">
              <p className="font-semibold text-xl mr-2 h-full">
                {project?.title}
              </p>
              |
              <p className="font-normal text-xl ml-2 ">
                {project?.description}
              </p>
              <p className="absolute right-5 font-semibold text-xl">
                {userList?.length}
              </p>
            </div>
          )}
          {state && <TaskList project_id={state.id} />}
        </Wrapper>
        {/* <ChatIcon /> */}
        {state && <Chat title={project?.title} project_id={state.id} />}
      </div>
      <ErrorMadal open={open} closeModal={closeModal} />
    </ProjectContextWrapper>
  );
};

export default Project;
