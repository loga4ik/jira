import { Task } from "./Task";
import { useGetTasksQuery } from "../../../../../Lib/api/projectApi";

type Props = {
  project_id: number;
};

const TaskList: React.FC<Props> = ({ project_id }) => {
  const { data, isLoading, isError } = useGetTasksQuery(project_id);

  if (isLoading) return <p role="status">загрузка задач…</p>;
  if (isError)
    return (
      <p role="alert" className="text-red-400">
        Не удалось загрузить задачи
      </p>
    );

  return (
    <div>
      {data?.tasks.map((task) => (
        <Task
          key={task.id}
          data={task}
          subtasks={data.subtasks.filter(({ task_id }) => task_id === task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;
