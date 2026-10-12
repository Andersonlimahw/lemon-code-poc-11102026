# 🍋 CHECKLIST — lemon-code-poc-11102026

POC end-to-end: **TODO List Kanban com CRUD completo** (frontend React + backend Java Spring Boot) em um único monorepo.
Orquestração principal via **lemon-code CLI (`lc chat --runtime claude ...`)**.

- **Owner:** andersonlimadev
- **Path local:** `/Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026`
- **Repositório remoto (a criar):** `https://github.com/Andersonlimahw/lemon-code-poc-11102026`
- **Runtime selecionado:** `claude`
- **Data/hora de início:** 2026-10-11 23:25 BRT (goal start — ver METRICS.md)

---

## 1. Setup do monorepo

- [x] Verificar ambiente (`lc`, `gh`, `git`, `node`, `java`, `mvn`)
- [x] Criar pasta `lemon-code-poc-11102026` em `ai-laboratory/`
- [x] Clonar boilerplate **frontend**: `https://github.com/Andersonlimahw/react-testforge-starter`
- [x] Clonar boilerplate **backend**:  `https://github.com/Andersonlimahw/java-journey`
- [x] Consolidar em monorepo: `frontend/` + `backend/` (sem `.git` aninhados)
- [x] `git init -b main` no raiz do projeto
- [x] Criar `CHECKLIST.md`, `EVIDENCES.md`, `METRICS.md` no raiz

## 2. Repositório remoto

- [x] Primeiro commit local (docs + estrutura inicial)
- [x] `gh repo create lemon-code-poc-11102026 --public --source=. --push`
- [x] Validar `gh repo view` (repositório `PUBLIC`, descrição correta, URL = https://github.com/Andersonlimahw/lemon-code-poc-11102026)

## 3. Backend — TODO Task API (Java + Spring Boot) — orquestrado via `lc_01`

- [x] Criar pacote `com.lemon.planner.task`
  - [x] `Task` entity (UUID id, title, description, status, priority, position, createdAt, updatedAt)
  - [x] Enum `TaskStatus` (TODO / IN_PROGRESS / REVIEW / DONE) com `@JsonValue` lowercase
  - [x] Enum `TaskPriority` (LOW / MEDIUM / HIGH) com `@JsonValue` lowercase
  - [x] `TaskRepository extends JpaRepository<Task, UUID>`
  - [x] `TaskRequestPayload` record com `@NotBlank` em title
  - [x] `TaskData` record (DTO de saída com `from(Task)`)
  - [x] `TaskService` com `create/listAll/get/update/move/delete`
  - [x] `TaskController` REST:
    - [x] `POST   /api/tasks` → 201
    - [x] `GET    /api/tasks` → 200 (ordenado por status, position)
    - [x] `GET    /api/tasks/{id}` → 200 / 404
    - [x] `PATCH  /api/tasks/{id}` → 200
    - [x] `PATCH  /api/tasks/{id}/move` → 200 (case-insensitive) — corrigido em `lc_02`
    - [x] `DELETE /api/tasks/{id}` → 204
  - [x] CORS `@CrossOrigin("http://localhost:5173")` no controller
  - [x] `TaskExceptionHandler` global (`@ControllerAdvice`) → 404 + 400 descritivos — corrigido em `lc_02`
- [x] Migration Flyway: `V5__create_tasks.sql` (UUID, status, priority, timestamps, position BIGINT, index `idx_tasks_status_position`)
- [x] `./mvnw -DskipTests package` → BUILD SUCCESS (jar 48 MB)

## 4. Frontend — TODO Kanban — orquestrado via `lc_03`

- [x] `frontend/src/services/tasks.ts` (list/get/create/update/move/delete) com `API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'`
- [x] `frontend/src/hooks/useTasks.ts` (useTasks + 4 mutations com optimistic update no move + toasts)
- [x] `frontend/src/components/kanban/TaskCard.tsx` (drag handle, badges de priority, edit/delete)
- [x] `frontend/src/components/kanban/KanbanColumn.tsx` (drop target + lista de cards)
- [x] `frontend/src/components/kanban/KanbanBoard.tsx` (4 colunas, agrupamento por status, ordenação por position, FAB "Nova Tarefa")
- [x] `frontend/src/components/kanban/TaskFormDialog.tsx` (Radix Dialog, criar/editar)
- [x] `frontend/src/pages/Kanban/index.tsx` (rota `/`)
- [x] `frontend/src/main.tsx` (rota `/` → `<Kanban />`; demais rotas preservadas)
- [x] Mirage passthrough `/api/**` (liberado para o backend real)
- [x] `tsconfig.json` — `skipLibCheck`, `exclude` de testes, `types: ["vitest/globals"]` (via `lc_04`)
- [x] `undici-types` adicionado como devDep (via `lc_04`)
- [x] `vite.config.js` `devOptions.enabled: false` (via `lc_05`)
- [x] `npm run build` → ✅ exit 0, dist/index.html + 601 kB JS + 36 kB CSS + service-worker em 4.93 s

## 5. Testes & verificação end-to-end

- [x] `vite dev --port 5173` rodando → `200 OK` em `/`
- [x] Backend rodando em `:8080/api/tasks` (5 migrations Flyway aplicadas)
- [x] Smoke API:
  - [x] `POST /api/tasks` → 201 com payload correto
  - [x] `GET  /api/tasks` → 200, lista completa
  - [x] `PATCH /api/tasks/{id}/move?status=...&position=...` → 200 (lowercase + uppercase)
  - [x] `PATCH /api/tasks/{id}/move?status=BANANA&position=1` → 400 com mensagem
  - [x] `GET  /api/tasks/00000000-0000-0000-0000-000000000000` → 404 + body `{ status:404, message, error:"Not Found" }`
  - [x] `DELETE /api/tasks/{id}` → 204
- [x] Seed de 3 tasks reais em estados diferentes (todo / review / done) para popular o Kanban
- [ ] E2E Playwright (opcional nesta POC) — boilerplate já tem infra em `frontend/e2e/`

## 6. Pós-POC — runtime picker (ADR 0061) + features adicionais

### 6.1 UI polish (lc_07 — runtime: codex)

- [x] Fade/slide/pop keyframes em `frontend/src/index.css`
- [x] `darkMode: 'class'` em `frontend/tailwind.config.js`
- [x] Sticky header com chip + gradient FAB em `KanbanBoard.tsx`
- [x] Skeleton de loading + error state com retry em `KanbanBoard.tsx`
- [x] Gradientes por coluna + drag-over highlight em `KanbanColumn.tsx`
- [x] Hover lift + drag handle + gradient priority badge em `TaskCard.tsx`
- [x] Radix Dialog com slideUp/fadeIn em `TaskFormDialog.tsx`
- [x] `cd frontend && npm run build` → exit 0

### 6.2 Busca textual + filtro por prioridade (lc_08 — runtime: claude)

- [x] `frontend/src/features/kanban/searchStore.ts` — zustand store com
      `query`, `priorities`, `setQuery`, `togglePriority`, `clearFilters`;
      persist em `localStorage` chave `lemon.kanban.filters.v1`
- [x] `frontend/src/features/kanban/useFilteredTasks.ts` — hook puro aplicando
      busca case-insensitive em `title`/`description` + filtro por prioridade
- [x] `frontend/src/components/kanban/FilterBar.tsx` — search input com
      MagnifyingGlass + clear X, dropdown Radix (Funnel + Check), botão
      Limpar (Trash); `data-testid="kanban-filter-bar"`
- [x] `frontend/src/components/kanban/KanbanBoard.tsx` — integra FilterBar +
      useFilteredTasks; sticky no topo; empty state quando filtro zera
- [x] `cd frontend && npm run build` → exit 0

## 7. Entrega final

- [x] Atualizar `README.md` raiz com instruções run + endpoints
- [x] Atualizar `CHECKLIST.md` (este arquivo) com tudo ✅
- [x] Atualizar `EVIDENCES.md` com logs das 8 invocações `lc chat`
- [x] Atualizar `METRICS.md` com tempos reais (total ≈ 67 min)
- [x] Commit final + push
- [x] Marcar goal como **complete**

