import React, { useContext, useEffect } from "react";
import { ProjectAddIsOwner } from "../../Lib/Slices/projectSlice/projectSlice";
import { ThemeContext } from "../../Context/ThemeContext";
import Card from "../../UIKit/Card";

type Props = {
  projectList: ProjectAddIsOwner[];
};

export const ProjectList: React.FC<Props> = ({ projectList }) => {
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    console.log(projectList);
  }, [projectList]);
  return (
    <div
      className={`w-full p-3 m-3 rounded-xl ${
        theme === "dark" ? "dark_out_big  text_dark" : "light_out_big"
      }`}
    >
      {projectList.map(({ id, title, description, img, isOwner }, index) => {
        return isOwner ? (
          <div className={`flex items-center flex-col`}>
            <h3 className="self-start text-xl font-bold m-2">мои проекты</h3>
            <Card
              title={title}
              description={description}
              img={img}
              id={id}
              key={`${id}${index}_card`}
            />
          </div>
        ) : (
          <div className="flex items-center flex-col m-2">
            <h3 className="self-start text-xl font-bold">участвую</h3>
            <Card
              title={title}
              description={description}
              img={img}
              id={id}
              key={`${id}${index}_card`}
            />
          </div>
        );
      })}
    </div>
  );
};
