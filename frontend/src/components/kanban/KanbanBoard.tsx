import { useState } from 'react';
import { Plus, WarningCircle, ArrowClockwise } from '@phosphor-icons/react';
import { TASK_COLUMNS, type TaskStatus } from '../../types/task';
import { useTasks, useDeleteTask, useMoveTask } from '../../hooks/useTasks';
import { KanbanColumn } from './KanbanColumn';
import { TaskFormDialog } from './TaskFormDialog';

export function KanbanBoard() {
  const { data: tasks = [], isLoading, isError, refetch, isFetching } = useTasks();
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

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-[1600px] mx-auto motion-safe:animate-fadeIn">
      <header className="sticky top-0 z-20 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/95 py-5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">🍋 Kanban</h2>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tabular-nums text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {isLoading || isError ? '— tarefas' : `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'}`}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">TODO List da POC lemon-code</p>
        </div>
        <button
          type="button"
          disabled={isLoading || isError}
          onClick={() => {
            setSelectedTaskId(null);
            setIsFormOpen(true);
          }}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} weight="bold" aria-hidden="true" />
          Nova Tarefa
        </button>
      </header>

      {isLoading ? (
        <div role="status" aria-label="Carregando tarefas" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <span className="sr-only">Carregando tarefas...</span>
          {TASK_COLUMNS.map((col) => (
            <div key={col.id} aria-hidden="true" className="rounded-2xl border border-slate-200 bg-white/60 p-3 motion-safe:animate-pulse dark:border-slate-700 dark:bg-slate-800/60">
              <div className="mb-4 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
              {[0, 1, 2].map((placeholder) => (
                <div key={placeholder} className="mb-3 space-y-3 rounded-xl bg-white p-4 dark:bg-slate-800">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 rounded bg-slate-100 dark:bg-slate-700" />
                  <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-700" />
                  <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : isError ? (
        <div role="alert" className="mx-auto mt-16 max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm dark:border-rose-900 dark:bg-slate-800">
          <WarningCircle size={40} className="mx-auto mb-4 text-rose-500" aria-hidden="true" />
          <h3 className="font-semibold">Não foi possível carregar as tarefas</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Verifique sua conexão e tente carregar o quadro novamente.</p>
          <button type="button" disabled={isFetching} onClick={() => void refetch()} className="mx-auto mt-6 flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900">
            <ArrowClockwise size={18} aria-hidden="true" />
            {isFetching ? 'Tentando...' : 'Tentar novamente'}
          </button>
        </div>
      ) : (
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
      )}

      <TaskFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        task={selectedTask}
      />
    </div>
  );
}
