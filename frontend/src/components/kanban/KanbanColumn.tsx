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

export function KanbanColumn({ id, label, color, tasks, onEdit, onDelete, onDropTask }: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col flex-1 min-w-[240px] max-w-xs"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId) onDropTask(taskId, id);
      }}
    >
      <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg ${color}`}>
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs font-bold bg-white/50 rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-b-lg min-h-[200px] flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
