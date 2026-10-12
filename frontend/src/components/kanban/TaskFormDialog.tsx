import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import type { Task, TaskInput, TaskStatus, TaskPriority } from '../../types/task';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskFormDialog({ open, onOpenChange, task }: TaskFormDialogProps) {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    setTitleError(false);
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setPriority(task.priority);
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
    }
  }, [task, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);

    const input: TaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
    };

    if (task) {
      updateMutation.mutate({ id: task.id, input }, { onSuccess: () => onOpenChange(false) });
    } else {
      createMutation.mutate(input, { onSuccess: () => onOpenChange(false) });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const fieldClassName = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 z-40 motion-safe:data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 w-[calc(100%-2rem)] max-w-xl motion-safe:data-[state=open]:animate-slideUp">
          <Dialog.Title className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 mb-1">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {task ? 'Atualize os dados da tarefa.' : 'Preencha os dados para criar uma nova tarefa.'}
          </Dialog.Description>

          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim()) setTitleError(false);
                }}
                required
                aria-invalid={titleError}
                aria-describedby={titleError ? 'task-title-error' : undefined}
                className={clsx(fieldClassName, titleError && 'border-red-500 dark:border-red-500 focus:ring-red-400')}
                placeholder="Título da tarefa"
              />
              {titleError && <p id="task-title-error" role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">Informe o título da tarefa.</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Descrição</label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={clsx(fieldClassName, 'resize-y min-h-[96px]')}
                placeholder="Descrição opcional"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
              <div className="flex-1">
                <label htmlFor="task-priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Prioridade</label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className={fieldClassName}
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="task-status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className={fieldClassName}
                >
                  <option value="todo">A Fazer</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="review">Em Revisão</option>
                  <option value="done">Concluído</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2 border-t border-slate-100 pt-5 md:col-span-2 dark:border-slate-800">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="min-h-[44px] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={isPending}
                className="min-h-[44px] px-5 py-2 text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                {isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
