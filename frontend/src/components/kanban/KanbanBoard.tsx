import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { TASK_COLUMNS, type TaskStatus } from '../../types/task';
import { useTasks, useDeleteTask, useMoveTask } from '../../hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';
import { TaskFormDialog } from './TaskFormDialog';

export function KanbanBoard() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const deleteMutation = useDeleteTask();
  const moveMutation = useMoveTask();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const tasksByStatus = TASK_COLUMNS.reduce<Record<TaskStatus, typeof tasks>>(
    (acc, col) => {
      acc[col.id] = tasks
        .filter((t) => t.status === col.id)
        .sort((a, b) => a.position - b.position);
      return acc;
    },
    { todo: [], in_progress: [], review: [], done: [] }
  );

  function handleEdit(id: string) {
    setSelectedTaskId(id);
    setIsFormOpen(true);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  function handleDropTask(taskId: string, targetStatus: TaskStatus) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;
    const newPosition = tasksByStatus[targetStatus].length;
    moveMutation.mutate({ id: taskId, status: targetStatus, position: newPosition });
  }

  function handleFormClose(open: boolean) {
    setIsFormOpen(open);
    if (!open) setSelectedTaskId(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-slate-500 text-sm">Carregando...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-red-500 text-sm">Erro ao carregar tarefas.</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            tasks={tasksByStatus[col.id]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      <button
        onClick={() => {
          setSelectedTaskId(null);
          setIsFormOpen(true);
        }}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
      >
        <Plus size={18} weight="bold" />
        <span className="text-sm font-medium">Nova Tarefa</span>
      </button>

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        task={selectedTask}
      />
    </div>
  );
}
