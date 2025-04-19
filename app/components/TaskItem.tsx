import React from "react";

interface TaskItemProps {
  children: React.ReactNode;
  className?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ children, className = "" }) => (
  <li
    className={`bg-neutral-700 text-white rounded px-3 py-2 shadow-sm flex items-center ${className}`}
  >
    {children}
  </li>
);

export default TaskItem;
