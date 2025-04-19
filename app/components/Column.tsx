import React from "react";
import TaskItem from "./TaskItem";

interface ColumnProps {
  title: string;
  tasks: string[];
  headerClass?: string;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, headerClass = "" }) => (
  <div className="flex flex-col rounded-lg shadow-lg bg-neutral-800">
    <div
      className={`p-4 rounded-t-lg font-semibold text-lg text-center ${headerClass}`}
    >
      {title}
    </div>
    <ul className="flex-1 p-4 space-y-3">
      {tasks.map((task, i) => (
        <TaskItem key={i}>{task}</TaskItem>
      ))}
    </ul>
  </div>
);

export default Column;
