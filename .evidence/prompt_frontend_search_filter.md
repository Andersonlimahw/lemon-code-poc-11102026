CONTEXTO: você está em /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026. Frontend em ./frontend. Kanban TODO já está totalmente funcional (lc_03 criou, lc_07 fez UI polish).

O backend Spring Boot roda em :8080 com o CRUD de Tasks (já existe, NÃO MUDE NADA NO BACKEND). Para esse feature você só mexe em ./frontend.

OBJETIVO ÚNICO: adicionar busca textual + filtro por prioridade ao Kanban existente, sem alterar:
- nenhuma chamada API (services/tasks.ts)
- nenhum hook de fetch (hooks/useTasks.ts)
- nenhuma rota (main.tsx)
- nenhum componente de card/coluna/dialog existentes (mantenha intactos)
- nenhum tipo de domínio (types/task.ts)
- nenhuma dependência nova no package.json (use APENAS o que existe: @phosphor-icons/react, @radix-ui/react-dropdown-menu, clsx, react-toastify, tailwindcss)

O QUE ENTREGAR (escopo fechado):

A) ./frontend/src/features/kanban/searchStore.ts (NOVO arquivo)
   - Zustand store com:
     - `query: string` (default "")
     - `priorities: TaskPriority[]` (default [], significando "todas as prioridades")
     - ações: `setQuery(q: string)`, `togglePriority(p: TaskPriority)`, `clearFilters()`
   - Hidrata do localStorage na criação; persiste a cada mudança (chave: `lemon.kanban.filters.v1`)
   - Reset completo quando o usuário chama `clearFilters()`

B) ./frontend/src/features/kanban/useFilteredTasks.ts (NOVO arquivo)
   - Hook puro: `useFilteredTasks(tasks: Task[]): Task[]`
   - Aplicar filtros em ordem:
     1. Se `query.trim()` não vazio: case-insensitive match em `title` (substring) E em `description` se existir
     2. Se `priorities` não vazio: manter apenas tasks cuja `priority` esteja inclusa
   - Importar types de `../../types/task`
   - NENHUMA chamada de rede; função pura sobre `tasks` recebido

C) ./frontend/src/components/kanban/FilterBar.tsx (NOVO arquivo)
   - Barra acima do KanbanBoard (será posicionada em KanbanBoard.tsx). Componentes:
     - Search input (com ícone @phosphor-icons/react `MagnifyingGlass` à esquerda, ícone `X` à direita que aparece quando há texto, limpa com click)
     - Dropdown @radix-ui/react-dropdown-menu para prioridade (trigger com ícone `Funnel`, label "Prioridade", badge mostrando count de selecionadas)
     - Quando `priorities.length > 0`, cada item do menu mostra um check (`Check` icon)
     - Quando há filtros ativos (query ou priorities não-defaults), botão "Limpar" (`Trash` icon) aparece
   - Use clsx para classes condicionais; cores amber para "ativo"
   - `data-testid="kanban-filter-bar"` no container

D) ./frontend/src/components/kanban/KanbanBoard.tsx (EDITAR)
   - Importar `FilterBar` e `useFilteredTasks`
   - Aplicar `useFilteredTasks(tasks)` antes de renderizar colunas
   - Mostrar `<FilterBar />` no topo (entre o header sticky existente e as colunas), com `sticky top-X` consistente com o header
   - Quando filtros estão ativos e o resultado filtrado está vazio mas há tasks: mostrar empty state com "Nenhuma task corresponde aos filtros" + botão "Limpar filtros" (chama clearFilters do store)
   - Quando NÃO há tasks (lista vazia original): manter o empty state existente

E) ./frontend/src/index.css (EDITAR)
   - Adicionar keyframe `fadeIn` (200ms ease-out) — se já existir da lc_07, NÃO duplicar
   - Adicionar classe `.animate-fadeIn` que aplica esse keyframe (se já existir, NÃO duplicar)

F) NÃO mexa em:
   - frontend/src/services/tasks.ts
   - frontend/src/hooks/useTasks.ts
   - frontend/src/types/task.ts
   - frontend/src/components/kanban/TaskCard.tsx
   - frontend/src/components/kanban/KanbanColumn.tsx
   - frontend/src/components/kanban/TaskFormDialog.tsx
   - frontend/src/pages/Kanban/index.tsx
   - frontend/src/main.tsx
   - frontend/package.json
   - backend/ (intacto)

G) Ao final:
   cd frontend && npm run build 2>&1 | tail -20
   Se exit 0 e dist/ atualizou, termine com:
   FRONTEND_SEARCH_FILTER=OK
   Se falhou, mostre o erro e termine com:
   FRONTEND_SEARCH_FILTER=FAIL

Faça TUDO em uma única passada. Sem perguntas. Liste os arquivos modificados/criados no fim.