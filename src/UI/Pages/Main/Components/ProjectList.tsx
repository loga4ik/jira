import React, { useEffect, useState } from "react";
import Card from "../../../../UIKit/Card";
import { PageLoader } from "../../../../UIKit/PageLoader";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetUserProjectsQuery } from "../../../../Lib/api/projectApi";
import type { UserProjectsType } from "../../../../types/ProjectTypes";
import { useCurrentUser } from "../../../../Hooks/useCurrentUser";
import {
  getMainProject,
  setMainProject,
} from "../../../../features/mainProject/mainProject";

type ProjectSectionProps = {
  title: string;
  projects: UserProjectsType["owner"];
  mainId: number | null;
  onToggleMain: (projectId: number) => void;
};

const ProjectSection: React.FC<ProjectSectionProps> = ({
  title,
  projects,
  mainId,
  onToggleMain,
}) => {
  if (projects.length === 0) return null;
  return (
    <div className="flex items-center flex-col">
      <h3 className="self-start text-xl font-bold m-2">{title}</h3>
      <div className="w-full flex flex-wrap place-content-around">
        {projects.map(({ id, title, description, img, owner_id }, index) => (
          <Card
            key={`${id}${index}_card`}
            title={title}
            description={description}
            img={img}
            id={id}
            owner_id={owner_id}
            isMain={id === mainId}
            onToggleMain={() => onToggleMain(id)}
          />
        ))}
      </div>
    </div>
  );
};

export const ProjectList: React.FC = () => {
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  // skipToken — «пока не спрашивай»: без пользователя запрос не уходит.
  // Отмену при уходе со страницы, кэш и повтор при возврате на вкладку
  // RTK Query делает сам — раньше для этого был AbortController и useEffect.
  const {
    data: projectList,
    isLoading,
    isError,
  } = useGetUserProjectsQuery(userId ?? skipToken);
  const [mainId, setMainId] = useState<number | null>(null);

  useEffect(() => {
    if (!userId || !projectList) return;
    // Главный проект удалили или из него исключили — забываем,
    // иначе после входа вели бы на «нет доступа».
    const main = getMainProject(userId);
    const exists = [...projectList.owner, ...projectList.working].some(
      (p) => p.id === main,
    );
    if (main && !exists) setMainProject(userId, null);
    setMainId(exists ? main : null);
  }, [userId, projectList]);

  // повторный клик по звезде снимает выбор
  const toggleMain = (projectId: number) => {
    if (!userId) return;
    const next = projectId === mainId ? null : projectId;
    setMainProject(userId, next);
    setMainId(next);
  };

  if (isLoading) return <PageLoader text="загрузка проектов…" />;
  if (isError)
    return (
      <p role="alert" className="text-red-400">
        Не удалось загрузить проекты
      </p>
    );

  return (
    <>
      {projectList && (
        <>
          <ProjectSection
            title="мои проекты"
            projects={projectList.owner}
            mainId={mainId}
            onToggleMain={toggleMain}
          />
          <ProjectSection
            title="участвую"
            projects={projectList.working}
            mainId={mainId}
            onToggleMain={toggleMain}
          />
        </>
      )}
    </>
  );
};
