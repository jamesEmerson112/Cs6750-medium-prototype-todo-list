"use client";
import React, { useState } from "react";
import Column from "./components/Column";
import { stripEmoji, shuffle } from "./utils/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { eisenhowerData } from "./data/eisenhowerData";

const allTasks: string[] = eisenhowerData.flatMap(col => col.tasks.map(stripEmoji));

// Sortable item component for dnd-kit
function SortableTaskItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-neutral-700 text-white rounded px-3 py-2 shadow-sm flex items-center"
    >
      {children}
    </li>
  );
}

export default function Home() {
  const [sorted, setSorted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [shuffledTasks, setShuffledTasks] = useState<string[] | null>(null);

  // For sortable tasks in the first column
  const [tasks0, setTasks0] = useState(eisenhowerData[0].tasks);

  // DnD-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Shuffle tasks only on client after mount
  React.useEffect(() => {
    setShuffledTasks(shuffle(allTasks));
  }, []);

  // Animation handler
  const handleToggle = () => {
    setAnimating(true);
    setTimeout(() => {
      setSorted(s => !s);
      setAnimating(false);
    }, 400); // Animation duration
  };

  // DnD-kit drag end handler for first column
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tasks0.indexOf(active.id as string);
      const newIndex = tasks0.indexOf(over?.id as string);
      setTasks0(arrayMove(tasks0, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center py-8 px-2 transition-colors duration-500">
      <h1 className="text-3xl font-bold text-white mb-8">Eisenhower Todo Prototype</h1>
      <button
        className="mb-8 px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        onClick={handleToggle}
        disabled={animating}
      >
        {sorted ? "Back to List" : "Sort"}
      </button>
      <div
        className={`w-full flex justify-center items-start transition-all duration-500 ${
          animating ? "opacity-50 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {!sorted ? (
          <div className="w-full max-w-lg bg-neutral-800 rounded-lg shadow-lg p-6">
            {shuffledTasks === null ? (
              <div className="text-white text-center py-8">Loading...</div>
            ) : (
              <ul className="space-y-4">
                {shuffledTasks.map((task, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-neutral-700 text-white rounded px-3 py-2 shadow-sm"
                  >
                    <span>{task}</span>
                    <span className="flex gap-2 opacity-60">
                      <span className="cursor-pointer select-none px-2 py-1 rounded bg-neutral-600">＋</span>
                      <span className="cursor-pointer select-none px-2 py-1 rounded bg-neutral-600">－</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6 w-full max-w-7xl">
            {/* First column with dnd-kit sortable */}
            <div className="flex flex-col rounded-lg shadow-lg bg-neutral-800">
              <div className="p-4 rounded-t-lg font-semibold text-lg text-center bg-red-600 text-white">
                {eisenhowerData[0].title}
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks0} strategy={verticalListSortingStrategy}>
                  <ul className="flex-1 p-4 space-y-3">
                    {tasks0.map((task) => (
                      <SortableTaskItem key={task} id={task}>
                        {task}
                      </SortableTaskItem>
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
            {/* Other columns static */}
            {eisenhowerData.slice(1).map((col) => (
              <Column
                key={col.title}
                title={col.title}
                tasks={col.tasks}
                headerClass={col.headerClass}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
