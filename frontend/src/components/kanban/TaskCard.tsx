import { useState } from 'react';
import { DotsSixVertical, PencilSimple, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700',
  medium: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
  high: 'bg-gradient-to-r from-rose-600 to-rose-700 text-white',
};

const priorityLabels: Record<Task['priority'], string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        setIsDragging(true);
      }}
      onDragEnd={() => setIsDragging(false)}
      className={clsx('rounded-xl border border-slate-200 bg-white p-4 shadow-sm cursor-grab active:cursor-grabbing select-none hover:shadow-lg motion-safe:hover:-translate-y-0.5 transition-all duration-200 motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-800', isDragging && 'opacity-50')}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 flex-1 break-words">{task.title}</p>
        <DotsSixVertical size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
      </div>
      {task.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 break-words">{task.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
        <span className={clsx('text-xs px-2.5 py-1 rounded-full font-semibold', priorityStyles[task.priority])}>
          {priorityLabels[task.priority]}
        </span>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            title="Editar tarefa"
            aria-label={`Editar tarefa: ${task.title}`}
            onClick={() => onEdit(task.id)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          >
            <PencilSimple size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            title="Excluir tarefa"
            aria-label={`Excluir tarefa: ${task.title}`}
            onClick={() => onDelete(task.id)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 dark:hover:bg-rose-950 dark:hover:text-rose-300"
          >
            <Trash size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
