import React, { useEffect, useState } from "react";
import { TaskAndSubtasks } from "../../../../../Api/types";
import { getProjectTaskAndSubtasks } from "../../../../../Api/projectApi";
import { Task } from "./Task";
type Props = {
  project_id: number;
};
const TaskList: React.FC<Props> = ({ project_id }) => {
  const [tasks, setTasks] = useState<TaskAndSubtasks[]>();
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const updatedData = await getProjectTaskAndSubtasks(
        project_id,
        abortController
      );

      if (!(updatedData instanceof Error)) {
        setTasks(updatedData);
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [project_id]);

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

  return (
    <div>
      {tasks?.map((task) => (
        <Task data={task} key={task.id} />
      ))}
    </div>
  );
};

export default TaskList;
