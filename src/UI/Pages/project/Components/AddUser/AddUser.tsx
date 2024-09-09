import { useEffect, useState } from "react";
import {
  addUserInProject,
  GetFreeUsers,
  getUserList,
  removeUser,
} from "../../../../../Api/projectApi";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { useLocation } from "react-router-dom";
import { CardData } from "../../../../../UIKit/Card";

const AddUser = () => {
  const [userList, setUserList] = useState<GetFreeUsers | undefined>(undefined);
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state

  // Функция для обновления данных пользователя
  const fetchUserList = async () => {
    try {
      const teamData = await getUserList(state.id);
      if (!(teamData instanceof Error)) {
        setUserList(teamData);
      }
      console.log(teamData);
    } catch (error) {
      console.error("Error fetching team:", error);
    }
  };

  useEffect(() => {
    fetchUserList(); // Загрузка данных при монтировании компонента
  }, []);

  useEffect(() => {
    console.log(userList);
  }, [userList]);

  const addClickHandler = async (user_id: number) => {
    try {
      const updatedData = await addUserInProject({ user_id, project_id: state.id });
      if (!(updatedData instanceof Error)) {
        setUserList(updatedData);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const removeClickHandler = async (user_id: number) => {
    try {
      const updatedData = await removeUser({ user_id, project_id: state.id });
      if (!(updatedData instanceof Error)) {
        setUserList(updatedData);
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <div>
      Уже на проекте:
      {userList && userList.activeUsers.length > 0 &&
        userList.activeUsers.map((user) => (
          <div className="flex" key={user.id}>
            <p>
              Name: {user.name} Login: {user.login}{" "}
              <Button
                type="button"
                className="h-8"
                changableIconClass="bin"
                onClick={() => removeClickHandler(user.id)}
              />
            </p>
          </div>
        ))}
      Добавить:
      {userList && userList.freeUsers.length > 0 &&
        userList.freeUsers.map((user) => (
          <div className="flex" key={user.id}>
            <p>
              Name: {user.name} Login: {user.login}{" "}
              <Button
                type="button"
                className="h-8"
                changableIconClass="add"
                onClick={() => addClickHandler(user.id)}
              />
            </p>
          </div>
        ))}
    </div>
  );
};

export default AddUser;
