import { TaskType } from "../../../../../Lib/Slices/projectSlice/types";
import Subtask from "./Subtask";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../Lib/store";

type Props = {
  data: TaskType;
};

export const Task: React.FC<Props> = ({ data }) => {
  const subtasks = useSelector((state: RootState) => state.project.subtasks);

  return (
    <div className="border rounded-lg border-gray-400 m-5 px-2 flex">
      <div className="flex-1 border border-transparent border-r-gray-400">
        <p className="font-semibold text-lg pt-1">{data.title}</p>
        <p className="mx-1">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          quasi, saepe accusantium quae enim ad inventore, dolorum facere atque
          sapiente, quo iusto officiis quia iste explicabo accusamus a totam.
          Perspiciatis?
        </p>
      </div>
      <div className="flex-1 p-2">
        {subtasks?.map(
          (subtask) =>
            subtask.task_id === data.id && (
              <Subtask key={subtask.id} data={subtask} />
            )
        )}
      </div>
    </div>
  );
};
