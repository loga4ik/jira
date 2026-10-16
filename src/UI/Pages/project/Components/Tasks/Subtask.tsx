import React, { useState } from "react";
import type { SubtaskType } from "../../../../../types/ProjectTypes";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import SubtaskEdit from "./SubtaskEdit";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  useGetStatusesQuery,
  useGetTeamQuery,
} from "../../../../../Lib/api/projectApi";
import { useProjectId } from "../../../../../Hooks/useProjectId";
import { NewModal } from "../../../../../UIKit/Modal/NewModal";
type Props = {
  data: SubtaskType;
};

const Subtask: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const projectId = useProjectId();
  // Те же хуки зовут и другие компоненты — запрос всё равно один на всех,
  // данные берутся из общего кэша.
  const { data: team = [] } = useGetTeamQuery(projectId ?? skipToken);
  const { data: statuses = [] } = useGetStatusesQuery();
  const assignee = team.find((user) => user.id === data.user_id);
  const status = statuses.find((item) => item.id === data.status_id);

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-row justify-between items-center">
        <p>{data.title}</p>
        {data.user_id && (
          <p className="ml-2 border-2 rounded-md mr-2 py-1 px-3 bg-gray-400 border-gray-400 text-gray-800">
            {`исполнитель: ${assignee?.login ?? "не в команде"}`}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-row justify-between items-center">
          {status && (
            <p className="border-2 rounded-md mr-2 py-1 px-2 border-gray-400">
              {status.title}
            </p>
          )}
          <Button
            title="добавить пользователя"
            type="button"
            className="my-2 h-8 w-8"
            changableIconClass="user_add"
            bg_color={false}
            defaultMP={false}
            onClick={() => setIsOpen(true)}
          />
        </div>
        <NewModal open={isOpen} closeModal={() => setIsOpen(!isOpen)}>
          <SubtaskEdit subtask={data} closeModal={() => setIsOpen(!isOpen)} />
        </NewModal>
      </div>
    </div>
  );
};

export default Subtask;
