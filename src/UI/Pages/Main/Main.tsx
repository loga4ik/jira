import { useSelector } from "react-redux";
import { RootState } from "../../../Lib/store";
import { ProjectList } from "../../Components/ProjectList";

const Main = () => {
  const projectList = useSelector((state: RootState) => state.project.projects);

  return (
    <div className="flex justify-center">
      {projectList ? (
        <ProjectList projectList={projectList} />
      ) : (
        <h1 className="text-3xl font-bold underline">{`Hello world! (main)`}</h1>
      )}
    </div>
  );
};

export default Main;
