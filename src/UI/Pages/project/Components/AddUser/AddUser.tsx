import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFreeUsers } from "../../../../../Api/projectApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { UserType } from "../../../../../Lib/Slices/projectSlice/types";
import {
  addUserInProject,
  removeUserInProject,
} from "../../../../../Lib/Slices/projectSlice/projectApi";

const AddUser = () => {
  const [freeUsers, setFreeUsers] = useState<UserType[]>([]);
  const [error, setError] = useState<string>();
  const activeUsers = useSelector((state: RootState) => state.project.userList);

  const dispatch = useDispatch<AppDispatch>();
  // id проекта — из адреса /project/:id, владелец — из загруженного проекта
  const projectId = Number(useParams().id);
  const ownerId = useSelector(
    (state: RootState) => state.project.project?.owner_id
  );

  useEffect(() => {
    (async () => {
      try {
        const teamData = await getFreeUsers(projectId);

        if (!(teamData instanceof Error)) {
          setFreeUsers(teamData);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    })(); // Загрузка при открытии и при смене проекта
  }, [projectId]);

  const addClickHandler = async (user_id: number) => {
    const abortController = new AbortController();
    const res = await dispatch(
      addUserInProject({ user_id, project_id: projectId, abortController })
    );
    // проверяем именно успех: при ошибке payload — строка с текстом ошибки,
    // и проверка if (res.payload) пропускала её как удачу
    if (addUserInProject.fulfilled.match(res)) {
      setFreeUsers(freeUsers.filter((user) => user.id !== user_id));
    } else {
      setError(res.payload ?? "Не удалось добавить пользователя");
    }
  };

  const removeClickHandler = async (user_id: number) => {
    const abortController = new AbortController();
    const res = await dispatch(
      removeUserInProject({ user_id, project_id: projectId, abortController })
    );

    if (removeUserInProject.fulfilled.match(res)) {
      const deletedUser = activeUsers.filter((user) => user.id === user_id);
      setFreeUsers([...freeUsers, deletedUser[0]]);
    } else {
      setError(res.payload ?? "Не удалось удалить пользователя");
    }
  };

  return (
    <div className="text-white">
      {error && (
        <p role="alert" className="p-3 text-red-400">
          {error}
        </p>
      )}
      <div className="p-4">
        <p>Уже на проекте:</p>
        {activeUsers.length > 0 &&
          activeUsers.map(
            (user) =>
              user.id !== ownerId && (
                <div className="flex items-center" key={user.id}>
                  <p>
                    имя: {user.name} логин: {user.login}
                  </p>
                  <Button
                    title="удалить"
                    type="button"
                    className="h-10 border-transparent"
                    changableIconClass="bin"
                    shadow={false}
                    onClick={() => removeClickHandler(user.id)}
                  />
                </div>
              )
          )}
      </div>
      <hr />
      <div className="p-4">
        <p>Добавить:</p>
        {freeUsers.length > 0 &&
          freeUsers.map((user) => (
            <div className="flex items-center" key={user.id}>
              <p>
              имя: {user.name} логин: {user.login}
              </p>
              <Button
                title="добавить"
                type="button"
                className="h-10 border-transparent"
                changableIconClass="add"
                shadow={false}
                onClick={() => addClickHandler(user.id)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddUser;
