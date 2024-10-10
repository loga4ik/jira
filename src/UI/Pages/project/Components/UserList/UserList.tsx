import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";

const UserList = () => {
  const userList = useSelector((state: RootState) => state.project.userList);

  return (
    <div className="flex items-center">
      <p className="mr-2">команда:</p>
      <div className="flex">
        {userList.map((user) => (
          <p
            key={`${user.id}_user-item`}
            className="border-2 rounded-lg mr-2 py px-3 border-gray-400 h-fit"
          >
            {user.login}
          </p>
        ))}
      </div>
    </div>
  );
};

export default UserList;
