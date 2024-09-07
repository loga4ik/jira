import { useSelector } from "react-redux";
import { RootState } from "../../../Lib/store";
import { ProjectList } from "../../Components/ProjectList";
import { ThemeContext } from "../../../Context/ThemeContext";
import { useContext } from "react";
import { Button } from "../../../UIKit/Inputs/Button/Button";

const Main = () => {
  const projectList = useSelector((state: RootState) => state.project.projects);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`p-3 mt-3 rounded-xl relative ${
        theme === "dark" ? "dark_out_big  text_dark" : "light_out_big"
      }`}
    >
      {projectList ? (
        <ProjectList projectList={projectList} />
      ) : (
        <h1 className="text-3xl font-bold underline">{`Hello world! (main)`}</h1>
      )}
      <Button
        type="button"
        changableIconClass="add"
        className="absolute rounded-full top-0 right-2"
        defaultBorder={false}
      >
        asd
      </Button>
    </div>
  );
};

export default Main;
