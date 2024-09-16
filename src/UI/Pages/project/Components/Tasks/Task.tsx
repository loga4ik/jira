import React from "react";
import { TaskAndSubtasks } from "../../../../../Api/types";
import Subtask from "./Subtask";
type Props = {
  data: TaskAndSubtasks;
};
export const Task: React.FC<Props> = ({ data }) => {
  return (
    <div className="border rounded-lg border-slate-500 m-5 px-2 flex">
      <div className="flex-1 border border-r-slate-500">
        <p className="font-semibold text-lg pt-1">{data.title}</p>
        <p className="mx-1">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          quasi, saepe accusantium quae enim ad inventore, dolorum facere atque
          sapiente, quo iusto officiis quia iste explicabo accusamus a totam.
          Perspiciatis?
        </p>
      </div>
      <div className="flex-1 p-2">
        {data.subtasks?.map((subtask) => (
          <Subtask key={subtask.id} data={subtask} />
        ))}
      </div>
    </div>
  );
};
