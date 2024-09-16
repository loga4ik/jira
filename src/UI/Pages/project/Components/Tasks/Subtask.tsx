import React, { useContext, useState } from "react";
import { SubtaskType } from "../../../../../Api/types";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
import Modal from "../../../../../UIKit/Modal/Modal";
import { ProjectContext } from "../../../../../Context/ProjectConstext";
import SubtaskEdit from "./SubtaskEdit";
type Props = {
  data: SubtaskType;
};

const Subtask: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { statuses } = useContext(ProjectContext);

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div className="flex justify-between">
      {data.title}.{statuses[data.status_id]}
      <div>
        <Button
          type="button"
          className="my-2 h-6 w-6"
          changableIconClass="user_add"
          defaultMP={false}
          onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <Modal closeModal={closeModal}>
            <SubtaskEdit subtask={data}/>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Subtask;
