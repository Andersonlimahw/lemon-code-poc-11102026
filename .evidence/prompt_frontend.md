CONTEXTO: você está em /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026. Frontend em ./frontend — cópia do boilerplate react-testforge-starter (React 18 + TypeScript + Vite + Tailwind + Zustand + @tanstack/react-query + Radix UI + react-router-dom + react-toastify).

Backend Spring Boot está rodando em http://localhost:8080 e expõe o CRUD de Tasks com:
- GET    /api/tasks             → TaskData[]
- GET    /api/tasks/{id}        → TaskData
- POST   /api/tasks             → 201 (body TaskRequestPayload: title obrigatório, description/status/priority/position opcionais; enums de status e priority case-sensitive LOWERCASE: "todo","in_progress","review","done" e "low","medium","high")
- PATCH  /api/tasks/{id}        → 200 (mesmos campos do POST)
- PATCH  /api/tasks/{id}/move?status=<enum>&position=<long>  → 200
- DELETE /api/tasks/{id}        → 204

Shape de TaskData (campos): id (uuid string), title, description (nullable), status (todo|in_progress|review|done), priority (low|medium|high), position (number), createdAt (ISO string), updatedAt (ISO string).

OBJETIVO ÚNICO: implementar um Kanban TODO de 4 colunas (TODO / IN_PROGRESS / REVIEW / DONE) com CRUD completo e drag&drop para mover entre colunas. Stack OBRIGATÓRIA: react-router-dom (mantém), @tanstack/react-query (mantém), zustand (mantém), @radix-ui (qualquer subpacote que precisar do que JÁ está nas deps), @phosphor-icons/react, react-toastify (já tem). NÃO adicione novas dependências ao package.json — use apenas o que já está no package.json do boilerplate.

ENTREGÁVEIS (caminhos relativos a ./frontend):

1) ./src/types/task.ts
   - export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
   - export type TaskPriority = 'low' | 'medium' | 'high';
   - export interface Task { id: string; title: string; description: string | null; status: TaskStatus; priority: TaskPriority; position: number; createdAt: string; updatedAt: string; }
   - export interface TaskInput { title: string; description?: string | null; status?: TaskStatus; priority?: TaskPriority; position?: number; }
   - export const TASK_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
       { id: 'todo', label: 'A Fazer', color: 'bg-slate-200 text-slate-800' },
       { id: 'in_progress', label: 'Em Andamento', color: 'bg-blue-200 text-blue-800' },
       { id: 'review', label: 'Em Revisão', color: 'bg-amber-200 text-amber-800' },
       { id: 'done', label: 'Concluído', color: 'bg-emerald-200 text-emerald-800' },
     ];

2) ./src/services/tasks.ts
   - export API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
   - export async function listTasks(): Promise<Task[]>  → GET API_BASE + '/api/tasks'
   - export async function getTask(id: string): Promise<Task> → GET /api/tasks/{id}, lança com mensagem vinda do backend se 404
   - export async function createTask(input: TaskInput): Promise<Task> → POST /api/tasks (JSON body)
   - export async function updateTask(id: string, input: TaskInput): Promise<Task> → PATCH /api/tasks/{id}
   - export async function moveTask(id: string, status: TaskStatus, position: number): Promise<Task> → PATCH /api/tasks/{id}/move?status=...&position=...
   - export async function deleteTask(id: string): Promise<void> → DELETE /api/tasks/{id}
   - Use fetch(), JSON.stringify/parse, e headers Content-Type: application/json. Trate errors lendo { message } quando 4xx.

3) ./src/hooks/useTasks.ts
   - export function useTasks() retornando useQuery({ queryKey: ['tasks'], queryFn: listTasks, staleTime: 0, refetchOnWindowFocus: false })
   - export function useCreateTask() com useMutation e invalida ['tasks'] em success, toast.success('Tarefa criada')
   - export function useUpdateTask() idem, toast.success('Tarefa atualizada')
   - export function useMoveTask() com optimistic update: cancelQueries ['tasks'] antes, snapshot previous, setQueryData para nova lista onde a task mudou de coluna/posição, e onError rollback; toast.success('Movida') ou erro.
   - export function useDeleteTask() idem, toast.success('Removida')

4) ./src/components/kanban/TaskCard.tsx
   - recebe { task: Task; onEdit: (id: string) => void; onDelete: (id: string) => void }
   - mostra título, description (truncada), badge de priority (use clsx para cores: low=cinza, medium=amarelo, high=vermelho), botão pencil pra onEdit e Trash pra onDelete
   - draggable=true, onDragStart com dataTransfer.setData('text/plain', task.id)

5) ./src/components/kanban/KanbanColumn.tsx
   - recebe { id: TaskStatus; label: string; color: string; tasks: Task[]; onEdit, onDelete, onDropTask }
   - renderiza header com label + cor + contador
   - container com onDragOver={e=>e.preventDefault()} e onDrop={e=>{ const id = e.dataTransfer.getData('text/plain'); if(id) onDropTask(id, id_status_local); }}
   - lista de TaskCard

6) ./src/components/kanban/KanbanBoard.tsx
   - lista = useTasks()
   - estado local selectedTaskId e isFormOpen
   - agrupa tasks por status, conta, ordena por position ASC dentro de cada coluna
   - Drag&Drop: chama useMoveTask.mutate(id, newStatus, newPosition) onde newPosition = tasks_no_destino.length (empurra pro fim)
   - renderiza 4 KanbanColumn, botão flutuante "Nova Tarefa" e TaskFormDialog

7) ./src/components/kanban/TaskFormDialog.tsx
   - Props: { open: boolean; onOpenChange: (o: boolean) => void; task?: Task | null; }
   - Usa Radix Dialog @radix-ui/react-alert-dialog OU @radix-ui/react-dialog (qualquer um serve). Campos: title (TextInput obrigatório), description (Textarea), priority (Select low/medium/high), status (Select 4 valores). Botões: Cancelar e Salvar.
   - submit chama useCreateTask (se sem task) ou useUpdateTask (se editando)

8) ./src/pages/Kanban/index.tsx
   - export function Kanban() { retorna <KanbanBoard/> com padding/container do Tailwind }

9) ./src/main.tsx
   - substitua a rota "/" para renderizar <Kanban/> em vez do Login atual
   - mantenha Chat, Groups, Profile, Community, Settings acessíveis (em sub-rotas /chat etc.)
   - se for muito caro mexer em muita coisa, remova apenas as rotas de Login que era "/", deixe as outras no final (router.children)

10) ./src/mocks/miragejs/index.js
    - Adicione `this.passthrough('/api/**');` no final do método server() para o Mirage NÃO interceptar /api/* e deixar ir pro backend real.

11) NÃO adicione dependências novas ao package.json. Use APENAS o que já está lá. NÃO delete arquivos existentes a não ser Login/index.tsx se realmente não for reusado; pode mantê-lo.

12) Ao final, rode:
     cd frontend && npm install (silencioso se já tiver node_modules) e depois:
     npm run build
   Se PASSAR, termine com a linha EXATA:
   FRONTEND_KANBAN_CRUD=OK
   Se FALHAR, mostre o erro curto e termine com:
   FRONTEND_KANBAN_CRUD=FAIL

Faça TUDO em UMA ÚNICA PASSADA. Sem perguntas. Sem placeholders. Ao concluir, liste os caminhos criados/modificados.