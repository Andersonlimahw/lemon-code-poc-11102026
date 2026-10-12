import { KanbanBoard } from '../../components/kanban/KanbanBoard';

export function Kanban() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Quadro de Tarefas</h1>
        <KanbanBoard />
      </div>
    </div>
  );
}
