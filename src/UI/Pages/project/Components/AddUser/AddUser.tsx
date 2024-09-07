import { useEffect, useState } from "react";
import { addUserInProject, getUserList } from "../../../../../Api/projectApi";
import { ProjectPai_UserRes } from "../../../../../Api/types";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { useLocation } from "react-router-dom";
import { CardData } from "../../../../../UIKit/Card";

const AddUser = () => {
  const [userList, setUserList] = useState<ProjectPai_UserRes[]>();
  const location = useLocation();
  const state = location.state as CardData; // Приведение типа для использования state

  useEffect(() => {
    try {
      getUserList()
        .then((teamData) => {
          if (!(teamData instanceof Error)) {
            setUserList(teamData);
          }
          console.log(teamData);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }, []);

  useEffect(() => {
    console.log(userList);
  }, [userList]);

  const addClickHandler = (user_id: number) => {
    addUserInProject({ user_id, project_id: state.id });
    
  };

  return (
    <div>
      {userList &&
        userList.length > 0 &&
        userList.map((user) => (
          <div className="flex" key={user.id}>
            <p>
              name: {user.name} login: {user.login}{" "}
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
