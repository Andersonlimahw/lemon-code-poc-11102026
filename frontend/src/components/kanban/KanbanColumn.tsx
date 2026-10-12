import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: TaskStatus;
  label: string;
  color: string;
  tasks: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => void;
}

const columnStyles = {
  todo: { gradient: 'from-gray-100 to-slate-200 text-slate-700 dark:from-slate-700 dark:to-slate-800 dark:text-slate-200', icon: ClipboardText, empty: 'Tudo começa com uma tarefa.' },
  in_progress: { gradient: 'from-blue-100 to-cyan-100 text-blue-900 dark:from-blue-950 dark:to-cyan-950 dark:text-cyan-200', icon: CircleNotch, empty: 'Pronto para começar?' },
  review: { gradient: 'from-amber-100 to-orange-100 text-amber-900 dark:from-amber-950 dark:to-orange-950 dark:text-amber-200', icon: Eye, empty: 'Nenhuma tarefa em revisão.' },
  done: { gradient: 'from-green-100 to-emerald-100 text-emerald-900 dark:from-green-950 dark:to-emerald-950 dark:text-emerald-200', icon: CheckCircle, empty: 'Suas próximas conquistas ficam aqui.' },
};

export function KanbanColumn({ id, label, tasks, onEdit, onDelete, onDropTask }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { gradient, icon: EmptyIcon, empty } = columnStyles[id];
  return (
    <section aria-label={label}
      className={clsx('flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white/60 shadow-sm transition-all duration-200 motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-800/50', isDragOver && 'ring-2 ring-amber-400 ring-offset-2 bg-amber-50/40 motion-safe:scale-[1.01] dark:bg-amber-950/30 dark:ring-offset-slate-900')}
      onDragOver={(e) => {
        e.preventDefault();
        if (e.dataTransfer.types.includes('text/plain')) setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsDragOver(false);
      }}
      onDragEnd={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(taskId, id);
      }}
    >
      <div className={clsx('flex items-center justify-between gap-2 rounded-t-2xl bg-gradient-to-r px-4 py-4', gradient)}>
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold tabular-nums dark:bg-slate-900/40">{tasks.length}</span>
      </div>
      <div className="flex min-h-[320px] flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
            <EmptyIcon size={32} weight="light" aria-hidden="true" />
            <p className="mt-3 text-sm">{empty}</p>
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}
import { useState } from 'react';
import { ClipboardText, CircleNotch, Eye, CheckCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
