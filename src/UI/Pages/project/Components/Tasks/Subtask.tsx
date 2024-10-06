import React, { useContext, useState } from "react";
import { SubtaskType } from "../../../../../Lib/Slices/projectSlice/types";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import { ProjectContext } from "../../../../../Context/ProjectConstext";
import SubtaskEdit from "./SubtaskEdit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";
import { NewModal } from "../../../../../UIKit/Modal/NewModal";
type Props = {
  data: SubtaskType;
};

const Subtask: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { statuses } = useContext(ProjectContext);
  const activeUsers = useSelector((state: RootState) => state.project.userList);

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-row justify-between items-center">
        <p>{data.title}</p>
        {data.user_id && (
          <p className="ml-2 border-2 rounded-md mr-2 py-1 px-3 bg-gray-400 border-gray-400 text-gray-800">
            {activeUsers.find((user) => user.id === data.user_id)?.login}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-row justify-between items-center">
          {data.status_id && (
            <p className="border-2 rounded-md mr-2 py-1 px-2 border-gray-400">
              {statuses[data.status_id]}
            </p>
          )}
          <Button
            type="button"
            className="my-2 h-8 w-8"
            changableIconClass="user_add"
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
