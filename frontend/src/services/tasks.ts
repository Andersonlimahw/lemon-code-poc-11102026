import type { Task, TaskInput, TaskStatus } from '../types/task';

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function listTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/api/tasks`);
  return handleResponse<Task[]>(res);
}

export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`);
  return handleResponse<Task>(res);
}

export async function createTask(input: TaskInput): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(id: string, input: TaskInput): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handleResponse<Task>(res);
}

export async function moveTask(id: string, status: TaskStatus, position: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}/move?status=${status}&position=${position}`, {
    method: 'PATCH',
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || `HTTP ${res.status}`);
  }
}
