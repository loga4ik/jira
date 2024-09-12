import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";

type Props = {
  text: string;
  sender: number;
};

const ChatMessage: React.FC<Props> = ({ text, sender }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  return (
    <div className={`flex ${currentUser?.id === sender && "justify-end"}`}>
      <div
        className={`text-black p-2 rounded-lg max-w-xs flex ${
          currentUser?.id === sender ? "bg-blue-200" : "bg-gray-300"
        }`}
      >
        {/* <div className="font-thin text-sm">{sender}</div> */}
        <div>{text}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
