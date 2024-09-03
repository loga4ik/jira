import React, { useState } from "react";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import "./ChatIcon.css";
import ChatBoard from "./ChatBoard";

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" flex flex-col fixed bottom-0 right-0 m-3">
      {isOpen && <ChatBoard />}
      <Button
        changableIconClass="chat-class"
        defaultBorder={false}
        defaultMP={false}
        className="h-14 w-14 border place-self-end rounded-full "
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      />
      <ChatBoard />
    </div>
  );
};

export default Chat;
