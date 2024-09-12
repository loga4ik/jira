import React, { useState } from "react";
import { SubtaskType } from "../../../../../Api/types";
import { Button } from "../../../../../UIKit/Inputs/Button/Button";
type Props = {
  data: SubtaskType;
};
const Subtask: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {data.title}
      <Button
        type="button"
        defaultMP={false}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Subtask;
