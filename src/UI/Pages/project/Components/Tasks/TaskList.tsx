import { Task } from "./Task";
import { AppDispatch, RootState } from "../../../../../Lib/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTasksAndSubtasks } from "../../../../../Lib/Slices/projectSlice/projectApi";
type Props = {
  project_id: number;
};
const TaskList: React.FC<Props> = ({ project_id }) => {
  const tasks = useSelector((state: RootState) => state.project.tasks);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    (async () => {
      const abortController = new AbortController();
      await dispatch(
        getTasksAndSubtasks({
          project_id: project_id,
          abortController,
        })
      );
    })();
  }, [project_id]);

  return (
    <div>
      {tasks?.map((task) => (
        <Task data={task} key={task.id} />
      ))}
    </div>
  );
};

export default TaskList;
