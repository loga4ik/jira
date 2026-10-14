import React, { useEffect, useState } from "react";
import Card from "../../../../UIKit/Card";
import { userProjects } from "../../../../Api/projectApi";
import { UserProjectsType } from "../../../../Lib/Slices/projectSlice/types";
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
  const [projectList, setProjectList] = useState<UserProjectsType | null>(null);
  const userId = currentUser?.id;
  const [mainId, setMainId] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    // Контроллер создаётся внутри эффекта: раньше он пересоздавался
    // на каждый рендер, и очистка отменяла не тот запрос.
    const abortController = new AbortController();

    (async () => {
      try {
        const res = await userProjects(userId, abortController);
        setProjectList(res);

        // Главный проект удалили или из него исключили — забываем,
        // иначе после входа вели бы на «нет доступа».
        const main = getMainProject(userId);
        const exists = [...res.owner, ...res.working].some(
          (p) => p.id === main,
        );
        if (main && !exists) setMainProject(userId, null);
        setMainId(exists ? main : null);
      } catch {
        // запрос отменён при уходе со страницы — список просто не обновится
      }
    })();

    return () => abortController.abort();
  }, [userId]);

  // повторный клик по звезде снимает выбор
  const toggleMain = (projectId: number) => {
    if (!userId) return;
    const next = projectId === mainId ? null : projectId;
    setMainProject(userId, next);
    setMainId(next);
  };

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
