import { ProjectList } from "./Components/ProjectList";
import { ThemeContext } from "../../../Context/ThemeContext";
import { useContext, useState } from "react";
import { Button } from "../../../UIKit/Inputs/Button/Button";
import { NewModal } from "../../../UIKit/Modal/NewModal";
import { ProjectCreateForm } from "./Components/ProjectCreate/ProjectCreateForm";

const Main = () => {
  const [open, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`p-3 mt-3 rounded-xl relative ${
        theme === "dark" ? "dark_out_big  text_dark" : "light_out_big"
      }`}
    >
      <ProjectList />
      <Button
              title="добавить"
        type="button"
        changableIconClass="add"
        className="absolute rounded-full top-0 right-2 h-10"
        defaultBorder={false}
        onClick={() => setIsOpen(!open)}
      />
      <NewModal open={open} closeModal={() => setIsOpen(!open)}>
        <ProjectCreateForm />
      </NewModal>
    </div>
  );
};

export default Main;
