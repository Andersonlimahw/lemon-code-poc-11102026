export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  position?: number;
}

export const TASK_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'A Fazer', color: 'bg-slate-200 text-slate-800' },
  { id: 'in_progress', label: 'Em Andamento', color: 'bg-blue-200 text-blue-800' },
  { id: 'review', label: 'Em Revisão', color: 'bg-amber-200 text-amber-800' },
  { id: 'done', label: 'Concluído', color: 'bg-emerald-200 text-emerald-800' },
];
