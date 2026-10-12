import { MagnifyingGlass, X, Funnel, Check, Trash } from '@phosphor-icons/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { useFilterStore } from '../../features/kanban/searchStore';
import type { TaskPriority } from '../../types/task';

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

export function FilterBar() {
  const { query, priorities, setQuery, togglePriority, clearFilters } = useFilterStore();
  const hasFilters = query.trim() !== '' || priorities.length > 0;

  return (
    <div data-testid="kanban-filter-bar" className="flex flex-wrap items-center gap-3 pb-3">
      <div className="relative flex min-w-[200px] flex-1 items-center">
        <MagnifyingGlass size={16} className="absolute left-3 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className={clsx(
              'flex min-h-[38px] items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
              priorities.length > 0
                ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            )}
          >
            <Funnel size={16} aria-hidden="true" />
            Prioridade
            {priorities.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-950">
                {priorities.length}
              </span>
            )}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={4}
            className="z-50 min-w-[160px] rounded-xl border border-slate-200 bg-white p-1 shadow-md animate-popIn dark:border-slate-700 dark:bg-slate-800"
          >
            {PRIORITY_OPTIONS.map(({ value, label }) => (
              <DropdownMenu.Item
                key={value}
                onSelect={(e) => {
                  e.preventDefault();
                  togglePriority(value);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <span
                  className={clsx(
                    'flex h-4 w-4 items-center justify-center rounded border',
                    priorities.includes(value)
                      ? 'border-amber-400 bg-amber-400 text-slate-950'
                      : 'border-slate-300 dark:border-slate-600'
                  )}
                >
                  {priorities.includes(value) && <Check size={10} weight="bold" />}
                </span>
                {label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex min-h-[38px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-800 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
        >
          <Trash size={16} aria-hidden="true" />
          Limpar
        </button>
      )}
    </div>
  );
}
