import { useLocation } from "react-router-dom";
import { CardData } from "../../../UIKit/Card";
import { Wrapper } from "../../../UIKit/Wrapper";
import { useEffect } from "react";
import Chat from "./Components/Chat/Chat";
import Sidebar from "./Components/Sidebar/Sidebar";
import TaskList from "./Components/Tasks/TaskList";
import { ProjectContextWrapper } from "../../../Context/ProjectConstext";
import { AppDispatch, RootState } from "../../../Lib/store";
import { useDispatch, useSelector } from "react-redux";
import { getUserList } from "../../../Lib/Slices/projectSlice/projectApi";
const Project = () => {
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state
  const userList = useSelector((state: RootState) => state.project.userList);

  // const [userList, setUserList] = useState<UserType[]>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      const abortController = new AbortController();
      await dispatch(
        getUserList({
          project_id: state.id,
          abortController,
        })
      );
    })();
  }, [state.id]);

  return (
    <ProjectContextWrapper>
      <div className="flex mx-4 my-8 ">
        {/* sidebar */}
        <Sidebar />
        {/* mainBlock */}
        <Wrapper className="flex-1 ml-6 p-3 min-h-96 rounded-lg relative">
          <div className="flex border px-3 py-1 border-transparent border-b-slate-500">
            <p className="font-semibold text-xl mr-2 h-full">{state.title}</p>|
            <p className="font-normal text-xl ml-2 ">{state.description}</p>
            <p className="absolute right-5 font-semibold text-xl">
              {userList?.length}
            </p>
          </div>
          <TaskList project_id={state.id} />
        </Wrapper>
        {/* <ChatIcon /> */}
        <Chat title={state.title} />
      </div>
    </ProjectContextWrapper>
  );
};

export default Project;
