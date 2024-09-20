import React, { useContext, useState } from "react";
import { SubtaskType } from "../../../../../Lib/Slices/projectSlice/types";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import Modal from "../../../../../UIKit/Modal/Modal";
import { ProjectContext } from "../../../../../Context/ProjectConstext";
import SubtaskEdit from "./SubtaskEdit";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";
type Props = {
  data: SubtaskType;
};

const Subtask: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { statuses } = useContext(ProjectContext);
  const activeUsers = useSelector((state: RootState) => state.project.userList);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-row justify-between items-center">
        <p>{data.title}</p>
        {data.user_id && (
          <p className="ml-2 border-2 rounded-md mr-2 py-1 px-2 bg-teal-200">
            {activeUsers.find((user) => user.id === data.user_id)?.login}
          </p>
        )}
      </div>
      <div>
        <div className="flex flex-row justify-between items-center">
          {data.status_id && (
            <p className="border-2 rounded-md mr-2 py-1 px-2 border-teal-200">
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
        {isOpen && (
          <Modal closeModal={closeModal}>
            <SubtaskEdit subtask={data} closeModal={closeModal} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Subtask;
