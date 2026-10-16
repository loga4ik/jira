import type { SubtaskType, TaskType } from "../../../../../types/ProjectTypes";
import Subtask from "./Subtask";
import { useContext } from "react";
import { ProjectContext } from "../../../../../Context/ProjectConstext";

type Props = {
  data: TaskType;
  /** Подзадачи этой задачи — TaskList уже отфильтровал их. */
  subtasks: SubtaskType[];
};

export const Task: React.FC<Props> = ({ data, subtasks }) => {
  const { taskIdToEdite, changeTaskId } = useContext(ProjectContext);

  const taskClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if ((e.target as HTMLElement).tagName !== "BUTTON") {
      changeTaskId(data.id);
    }
  };

  return (
    <div
      className={`border rounded-lg border-gray-400 m-5 px-2 flex ${
        taskIdToEdite === data.id && `border-y-blue-400 border-x-blue-400`
      }`}
      onClick={(e) => taskClickHandler(e)}
    >
      <div className="flex-1 border border-transparent border-r-gray-400">
        <p className="font-semibold text-lg pt-1">{data.title}</p>
        <p className="mx-1">{data.description}</p>
      </div>
      <div className="flex-1 p-2">
        {subtasks.map((subtask) => (
          <Subtask key={subtask.id} data={subtask} />
        ))}
      </div>
    </div>
  );
};
