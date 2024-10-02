import { useLocation, useNavigate } from "react-router-dom";
import { CardData } from "../../../UIKit/Card";
import { Wrapper } from "../../../UIKit/Wrapper";
import { useEffect } from "react";
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

const Project = () => {
  const location = useLocation();
  const state = location.state as CardData | null; // Allow null type for state
  const { userList, project } = useSelector(
    (state: RootState) => state.project
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!state?.id) {
      navigate("/login");
      return;
    }

    (async () => {
      const abortController = new AbortController();
      await dispatch(
        getUserList({
          project_id: state.id,
          abortController,
        })
      );
      await dispatch(getProjectData({ project_id: state.id, abortController }));
    })();
  }, [state, navigate, dispatch]);

  return (
    <ProjectContextWrapper>
      <div className="flex mx-4 my-8 ">
        <Sidebar />
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
    </ProjectContextWrapper>
  );
};

export default Project;
