import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskPriority } from '../../types/task';

interface FilterState {
  query: string;
  priorities: TaskPriority[];
  setQuery: (q: string) => void;
  togglePriority: (p: TaskPriority) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      query: '',
      priorities: [],
      setQuery: (q) => set({ query: q }),
      togglePriority: (p) =>
        set((state) => ({
          priorities: state.priorities.includes(p)
            ? state.priorities.filter((x) => x !== p)
            : [...state.priorities, p],
        })),
      clearFilters: () => set({ query: '', priorities: [] }),
    }),
    { name: 'lemon.kanban.filters.v1' }
  )
);
