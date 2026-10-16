import { Wrapper } from "../../../../../UIKit/Wrapper";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import "./Sidebar.css";
import React, { useContext, useState } from "react";
import AddUser from "../AddUser/AddUser";
import EditProject from "../EditProject/EditProject";
import { NewModal } from "../../../../../UIKit/Modal/NewModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import { ProjectContext } from "../../../../../Context/ProjectConstext";
import { TaskEdite } from "../TaskEdite/TaskEdite";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../../../../Hooks/useCurrentUser";
import { useGetProjectQuery } from "../../../../../Lib/api/projectApi";

type OpenedElement = "edit" | "delete" | "add_user" | false;
type Props = {
  project_id: number;
};
const Sidebar: React.FC<Props> = ({ project_id }) => {
  const [openElement, setOpenElement] = useState<OpenedElement>(false);
  const { taskIdToEdite } = useContext(ProjectContext);
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  // проект уже в кэше — его загрузила страница
  const { data: project } = useGetProjectQuery(project_id);

  // Управлять проектом может только владелец — бэк всё равно ответит 403,
  // поэтому участнику эти кнопки не показываем. Редактировать задачу
  // может любой участник: кнопка редактирования нужна, когда задача выбрана.
  const isOwner = Boolean(
    project && currentUser && project.owner_id === currentUser.id
  );
  const canEdit = isOwner || Boolean(taskIdToEdite);

  const buttonClickHandler = (name: OpenedElement) => {
    setOpenElement(name);
  };

  // Раньше перед уходом стор чистили руками (setDefaultProjects), чтобы
  // в следующем проекте не мелькнули данные этого. Кэш RTK Query
  // хранит каждый проект отдельно — чистить нечего.
  const homeButtonClickHandler = () => navigate("/");

  return (
    <Wrapper className="py-8 flex flex-col flex-none w-20 rounded-full z-10 justify-between">
      <div className="flex flex-col flex-none">
        {isOwner && (
          <Button
            title="добавление пользователя"
            type="button"
            changableIconClass="user_add"
            defaultMP={false}
            bg_color={false}
            className="h-12 w-12 mb-5  place-self-center"
            onClick={() => buttonClickHandler("add_user")}
          />
        )}
        {isOwner && (
          <Button
            title="удаление"
            type="button"
            changableIconClass="bin"
            defaultMP={false}
            bg_color={false}
            className="h-12 w-12 mb-5  place-self-center"
            onClick={() => buttonClickHandler("delete")}
          />
        )}
        {canEdit && (
          <Button
            title="редактироване"
            type="button"
            changableIconClass="edit"
            defaultMP={false}
            bg_color={false}
            className="h-12 w-12 mb-5  place-self-center"
            onClick={() => buttonClickHandler("edit")}
          />
        )}
      </div>
      <Button
        title="домой"
        type="button"
        changableIconClass="home"
        defaultMP={false}
        bg_color={false}
        className="h-12 w-12 mb-5  place-self-center"
        onClick={homeButtonClickHandler}
      />
      <NewModal open={!!openElement} closeModal={() => setOpenElement(false)}>
        {openElement === "add_user" && <AddUser />}
        {openElement === "delete" && <DeleteModal project_id={project_id} />}
        {openElement === "edit" &&
          (taskIdToEdite ? (
            <TaskEdite
              task_id={taskIdToEdite}
              closeModal={() => setOpenElement(false)}
            />
          ) : (
            <EditProject closeModal={() => setOpenElement(false)} />
          ))}
      </NewModal>
    </Wrapper>
  );
};

export default Sidebar;
