import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CardData } from "../../../../../UIKit/Card";
import { getUserList } from "../../../../../Api/userApi";
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
  const activeUsers = useSelector((state: RootState) => state.project.userList);

  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state

  useEffect(() => {
    (async () => {
      try {
        const teamData = await getUserList(state.id);

        if (!(teamData instanceof Error)) {
          setFreeUsers(teamData);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    })(); // Загрузка данных при монтировании компонента
  }, []);

  const addClickHandler = async (user_id: number) => {
    const abortController = new AbortController();
    const res = await dispatch(
      addUserInProject({ user_id, project_id: state.id, abortController })
    );
    if (res.payload) {
      setFreeUsers(freeUsers.filter((user) => user.id !== user_id));
    }
  };

  const removeClickHandler = async (user_id: number) => {
    const abortController = new AbortController();
    const res = await dispatch(
      removeUserInProject({ user_id, project_id: state.id, abortController })
    );

    if (res.payload) {
      const deletedUser = activeUsers.filter((user) => user.id === user_id);
      setFreeUsers([...freeUsers, deletedUser[0]]);
    }
  };

  return (
    <div className="text-white">
      <div className="p-4">
        <p>Уже на проекте:</p>
        {activeUsers.length > 0 &&
          activeUsers.map((user) => (
            <div className="flex" key={user.id}>
              <p>
                Name: {user.name} Login: {user.login}{" "}
                <Button
                  type="button"
                  className="h-8"
                  changableIconClass="bin"
                  lightShadow={true}
                  onClick={() => removeClickHandler(user.id)}
                />
              </p>
            </div>
          ))}
      </div>
      <hr />
      <div className="p-4">
        <p>Добавить:</p>
        {freeUsers.length > 0 &&
          freeUsers.map((user) => (
            <div className="flex" key={user.id}>
              <p>
                Name: {user.name} Login: {user.login}{" "}
                <Button
                  type="button"
                  className="h-8"
                  changableIconClass="add"
                  lightShadow={true}
                  onClick={() => addClickHandler(user.id)}
                />
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddUser;
