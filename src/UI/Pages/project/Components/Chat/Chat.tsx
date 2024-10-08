import React, { useState } from "react";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import "./ChatIcon.css";
import ChatBoard from "./ChatBoard";

type Props = {
  title?: string;
  project_id: number;
};

const Chat: React.FC<Props> = ({ title, project_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" flex flex-col fixed bottom-0 right-0 m-3 justify-end">
      {isOpen && <ChatBoard title={title} project_id={project_id} />}

      <Button
              title="чат"
        changableIconClass="chat-class"
        defaultBorder={false}
        defaultMP={false}
        className="h-10 w-10 border place-self-end rounded-full m-3"
        type="button"
        // bg_color={false}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Chat;
