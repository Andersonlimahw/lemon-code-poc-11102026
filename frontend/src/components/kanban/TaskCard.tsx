import { PencilSimple, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
      className="bg-white rounded-lg p-3 shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 line-clamp-2 flex-1">{task.title}</p>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(task.id)}
            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-700"
          >
            <PencilSimple size={14} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded hover:bg-red-50 text-slate-500 hover:text-red-600"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="mt-2">
        <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', priorityStyles[task.priority])}>
          {priorityLabels[task.priority]}
        </span>
      </div>
    </div>
  );
}
