import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";
import { UserType } from "../../../../../Lib/Slices/projectSlice/types";

type Props = {
  text: string;
  sender: number;
};

const ChatMessage: React.FC<Props> = ({ text, sender }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const userList = useSelector((state: RootState) => state.project.userList);
  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const userLogin = userList.find((user) => user.id === sender);
    userLogin && setUser(userLogin);
    // console.log(userLogin);
  }, [userList, sender]);

  return (
    <div className={`flex ${currentUser?.id === sender && "justify-end"}`}>
      <div
        className={`text-black p-2 rounded-lg max-w-xs flex ${
          currentUser?.id === sender ? "bg-blue-200" : "bg-gray-300"
        }`}
      >
        {<div className="font-thin text-sm">{`${user?.login??'удален'}: ${text}`}</div>}
        {/* <div></div> */}
      </div>
    </div>
  );
};

export default ChatMessage;
