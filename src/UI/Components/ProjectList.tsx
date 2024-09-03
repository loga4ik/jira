import React, { useEffect } from "react";
import { ProjectAddIsOwner } from "../../Lib/Slices/projectSlice/projectSlice";
import Card from "../../UIKit/Card";

type Props = {
  projectList: ProjectAddIsOwner[];
};

export const ProjectList: React.FC<Props> = ({ projectList }) => {
  useEffect(() => {
    console.log(projectList);
  }, [projectList]);
  return (
    <>
      {projectList.map(({ id, title, description, img, isOwner }, index) => {
        return isOwner ? (
          <div
            className={`flex items-center flex-col`}
            key={`${id}${index}_card`}
          >
            <h3 className="self-start text-xl font-bold m-2">мои проекты</h3>
            <Card title={title} description={description} img={img} id={id} />
          </div>
        ) : (
          <div
            className="flex items-center flex-col m-2"
            key={`${id}${index}_card`}
          >
            <h3 className="self-start text-xl font-bold">участвую</h3>
            <Card title={title} description={description} img={img} id={id} />
          </div>
        );
      })}
    </>
  );
};
