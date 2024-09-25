import { ProjectList } from "./Components/ProjectList";
import { ThemeContext } from "../../../Context/ThemeContext";
import { useContext } from "react";
import { Button } from "../../../UIKit/Inputs/Button/Button";

const Main = () => {
  // const projectList = useSelector((state: RootState) => state.project.projects);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`p-3 mt-3 rounded-xl relative ${
        theme === "dark" ? "dark_out_big  text_dark" : "light_out_big"
      }`}
    >
      <ProjectList />
      <Button
        type="button"
        changableIconClass="add"
        className="absolute rounded-full top-0 right-2 h-10"
        defaultBorder={false}
      />
    </div>
  );
};

export default Main;
