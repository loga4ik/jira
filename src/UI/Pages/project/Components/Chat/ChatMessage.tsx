import React from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetTeamQuery } from "../../../../../Lib/api/projectApi";
import { useProjectId } from "../../../../../Hooks/useProjectId";
import { useCurrentUser } from "../../../../../Hooks/useCurrentUser";

type Props = {
  text: string;
  sender: number;
};

const ChatMessage: React.FC<Props> = ({ text, sender }) => {
  const { currentUser } = useCurrentUser();
  const projectId = useProjectId();
  const { data: userList = [] } = useGetTeamQuery(projectId ?? skipToken);
  // Автор вычисляется из списка при рендере — отдельное состояние
  // и эффект для этого не нужны: они лишь давали лишний рендер.
  const user = userList.find((item) => item.id === sender);

  return (
    <div className={`flex ${currentUser?.id === sender && "justify-end"}`}>
      <div
        className={`text-black p-2 rounded-lg max-w-xs flex ${
          currentUser?.id === sender ? "bg-blue-200" : "bg-gray-300"
        }`}
      >
        {
          <div className="font-thin text-sm">{`${
            user?.login || "удален"
          }: ${text}`}</div>
        }
      </div>
    </div>
  );
};

export default ChatMessage;
