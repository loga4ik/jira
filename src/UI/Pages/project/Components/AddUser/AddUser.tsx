import { useEffect, useState } from "react";
import { GetFreeUsers } from "../../../../../Api/projectApi";
import { useLocation } from "react-router-dom";
import { CardData } from "../../../../../UIKit/Card";
import { getUserList } from "../../../../../Api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import {
  addUserInProject,
  removeUserInProject,
} from "../../../../../Lib/Slices/projectSlice/projectSlice";
import { UserType } from "../../../../../Lib/Slices/projectSlice/types";

const AddUser = () => {
  const [userList, setUserList] = useState<GetFreeUsers | undefined>(undefined);
  const [freeUsers, setFreeUsers] = useState<UserType[]>();
  
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state
  const activeUsers = useSelector((state: RootState) => state.project.userList);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    (async () => {
      try {
        const teamData = await getUserList(state.id);

        if (!(teamData instanceof Error)) {
          setUserList({ activeUsers: activeUsers, freeUsers: teamData });
        }
        console.log(teamData);
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    })(); // Загрузка данных при монтировании компонента
  }, []);

  useEffect(() => {
    console.log(userList);
  }, [userList]);

  const addClickHandler = async (user_id: number) => {
    const abortController = new AbortController();
    const res = dispatch(
      addUserInProject({ user_id, project_id: state.id, abortController })
    );

    console.log(res);
  };

  const removeClickHandler = async (user_id: number) => {
    const abortController = new AbortController();
    dispatch(
      removeUserInProject({ user_id, project_id: state.id, abortController })
    );
  };

  return (
    <div>
      Уже на проекте:
      {userList &&
        userList.activeUsers.length > 0 &&
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
      {userList &&
        userList.freeUsers.length > 0 &&
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
