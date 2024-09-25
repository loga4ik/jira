import React, { useEffect, useState } from "react";
import Card from "../../../../UIKit/Card";
import { RootState } from "../../../../Lib/store";
import { useSelector } from "react-redux";
import { userProjects } from "../../../../Api/projectApi";
import { UserProjectsType } from "../../../../Lib/Slices/projectSlice/types";
export const ProjectList: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [projectList, setProjectList] = useState<UserProjectsType | null>(null);
  const abortController = new AbortController();

  useEffect(() => {
    currentUser &&
      currentUser.id &&
      (async () => {
        try {
          const res = await userProjects(currentUser?.id, abortController);
          setProjectList(res);
        } catch (error) {}
      })();
    return () => abortController.abort();
  }, [currentUser]);

  return (
    <>
      {projectList && (
        <>
          {projectList.owner.length > 0 && (
            <div className="flex items-center flex-col">
              <h3 className="self-start text-xl font-bold m-2">мои проекты</h3>
              <div className="w-full flex flex-wrap place-content-around">
                {projectList.owner.map(
                  ({ id, title, description, img }, index) => (
                    <Card
                      key={`${id}${index}_card`}
                      title={title}
                      description={description}
                      img={img}
                      id={id}
                    />
                  )
                )}
              </div>
            </div>
          )}
          {projectList.working.length > 0 && (
            <div className="flex items-center flex-col m-2">
              <h3 className="self-start text-xl font-bold">участвую</h3>
              {projectList.working.map(
                ({ id, title, description, img }, index) => (
                  <Card
                    key={`${id}${index}_card`}
                    title={title}
                    description={description}
                    img={img}
                    id={id}
                  />
                )
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};
