import { Wrapper } from "../../../../../UIKit/Wrapper";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import "./Sidebar.css";
import React, { useContext, useEffect, useState } from "react";
import AddUser from "../AddUser/AddUser";
import EditProject from "../EditProject/EditProject";
import { NewModal } from "../../../../../UIKit/Modal/NewModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { ProjectContext } from "../../../../../Context/ProjectConstext";
import { TaskEdite } from "../TaskEdite/TaskEdite";

type OpenedElement = "edit" | "delete" | "add_user" | false;
type Props = {
  project_id: number;
};
const Sidebar: React.FC<Props> = ({ project_id }) => {
  const [openElement, setOpenElement] = useState<OpenedElement>(false);
  const { taskIdToEdite } = useContext(ProjectContext);

  const buttonClickHandler = (name: OpenedElement) => {
    setOpenElement(name);
  };

  return (
    <Wrapper className="py-8 flex flex-col flex-none w-20 rounded-full z-10">
      <Button
        type="button"
        changableIconClass="user_add"
        defaultMP={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={() => buttonClickHandler("add_user")}
      />
      <Button
        type="button"
        changableIconClass="bin"
        defaultMP={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={() => buttonClickHandler("delete")}
      />
      <Button
        type="button"
        changableIconClass="edit"
        defaultMP={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={() => buttonClickHandler("edit")}
      />
      <NewModal open={!!openElement} closeModal={() => setOpenElement(false)}>
        {openElement === "add_user" && <AddUser />}
        {openElement === "delete" && <DeleteModal project_id={project_id} />}
        {openElement === "edit" && !taskIdToEdite ? (
          <EditProject closeModal={() => setOpenElement(false)} />
        ) : (
          taskIdToEdite && <TaskEdite task_id={taskIdToEdite} />
        )}
      </NewModal>
    </Wrapper>
  );
};

export default Sidebar;
