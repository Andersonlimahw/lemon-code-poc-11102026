import { useFilterStore } from './searchStore';
import type { Task } from '../../types/task';

export function useFilteredTasks(tasks: Task[]): Task[] {
  const { query, priorities } = useFilterStore();

  let result = tasks;

  const trimmed = query.trim().toLowerCase();
  if (trimmed) {
    result = result.filter((t) => {
      const inTitle = t.title.toLowerCase().includes(trimmed);
      const inDesc = t.description ? t.description.toLowerCase().includes(trimmed) : false;
      return inTitle || inDesc;
    });
  }

  if (priorities.length > 0) {
    result = result.filter((t) => priorities.includes(t.priority));
  }

  return result;
}
