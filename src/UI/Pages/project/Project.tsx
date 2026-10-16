import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Wrapper } from "../../../UIKit/Wrapper";
import Chat from "./Components/Chat/Chat";
import Sidebar from "./Components/Sidebar/Sidebar";
import TaskList from "./Components/Tasks/TaskList";
import { ProjectContextWrapper } from "../../../Context/ProjectConstext";
import { ErrorMadal } from "./Components/ErrorMadal/ErrorMadal";
import { useGetProjectQuery } from "../../../Lib/api/projectApi";
import { getErrorMessage } from "../../../Lib/api/getErrorMessage";

const Project = () => {
  // id проекта берётся из адреса /project/:id, а не из location.state:
  // так страница работает по прямой ссылке, в новой вкладке и из закладок.
  const { id } = useParams();
  const projectId = Number(id);
  const isValidId = Number.isInteger(projectId) && projectId > 0;
  const navigate = useNavigate();

  // Запрос проекта — он же проверка доступа: постороннему сервер ответит 403,
  // на несуществующий проект — 404. Кэш у каждого проекта свой, поэтому
  // при переходе из проекта в проект чужие данные не мелькают.
  const {
    data: project,
    error,
    isLoading,
  } = useGetProjectQuery(isValidId ? projectId : skipToken);

  useEffect(() => {
    if (!isValidId) navigate("/", { replace: true });
  }, [isValidId, navigate]);

  if (!isValidId) return null;

  const status = error && "status" in error ? error.status : undefined;
  if (status === 403 || status === 404) {
    return <ErrorMadal open closeModal={() => navigate("/")} />;
  }

  if (isLoading) return <p role="status">загрузка проекта…</p>;

  if (error || !project) {
    return (
      <p role="alert" className="m-8 text-red-400">
        {getErrorMessage(error, {}, "Не удалось загрузить проект")}
      </p>
    );
  }

  // Задачи, команда и чат грузятся только после того, как доступ подтверждён:
  // иначе посторонний получил бы пачку 403 вместо одного.
  return (
    <ProjectContextWrapper>
      <div className="flex mx-4 my-8 ">
        <Sidebar project_id={projectId} />
        <Wrapper className="flex-1 ml-6 p-3 min-h-96 rounded-lg relative">
          <div className="flex border px-3 py-1 border-transparent border-b-gray-400">
            <p className="font-semibold text-xl pr-2 h-full border-r border-gray-400">
              {project.title}
            </p>
            <p className="font-normal text-xl ml-2 ">{project.description}</p>
          </div>
          <TaskList project_id={projectId} />
        </Wrapper>
        <Chat title={project.title} project_id={projectId} />
      </div>
    </ProjectContextWrapper>
  );
};

export default Project;
