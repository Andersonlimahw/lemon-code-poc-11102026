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
- [ ] Validar `gh repo view` (leitura pública funciona)

## 3. Backend — TODO Task API (Java + Spring Boot)

- [ ] Criar pacote `com.lemon.planner.task`
  - [ ] `Task` entity (id, title, description, status, priority, position, createdAt, updatedAt)
  - [ ] Enum `TaskStatus` (TODO / IN_PROGRESS / REVIEW / DONE)
  - [ ] Enum `TaskPriority` (LOW / MEDIUM / HIGH)
  - [ ] `TaskRepository extends JpaRepository<Task, UUID>`
  - [ ] `TaskRequestPayload` (DTO de entrada)
  - [ ] `TaskData` / `TaskResponse` (DTO de saída)
  - [ ] `TaskService` com regras: criação, listagem por status, atualização, mover (status+position), deletar
  - [ ] `TaskController` REST:
    - [ ] `POST   /api/tasks`
    - [ ] `GET    /api/tasks`
    - [ ] `GET    /api/tasks/{id}`
    - [ ] `PATCH  /api/tasks/{id}`
    - [ ] `PATCH  /api/tasks/{id}/move` (status + position)
    - [ ] `DELETE /api/tasks/{id}`
  - [ ] CORS liberado para `http://localhost:5173` (Vite dev)
- [ ] Migration Flyway: `V1__create_tasks.sql` (UUID, status enum, priority enum, timestamps, position BIGINT)
- [ ] Compilar backend (`./mvnw -DskipTests package`) — esperado: BUILD SUCCESS

## 4. Frontend — TODO Kanban (React + TypeScript + Vite + Zustand + React Query)

- [ ] Camada `src/services/tasks.ts`: `listTasks`, `createTask`, `updateTask`, `moveTask`, `deleteTask`
- [ ] Hook `useTasks()` (React Query) com cache invalidation
- [ ] Zustand store para UI state (coluna foco, drag ativo, filtros)
- [ ] Componente `KanbanBoard.tsx` com 4 colunas (TODO / IN_PROGRESS / REVIEW / DONE)
- [ ] Componente `TaskCard.tsx` (drag handle, badges de priority e status)
- [ ] Componente `TaskFormDialog.tsx` (create/edit via Radix Dialog)
- [ ] Componente `EmptyColumnState.tsx`
- [ ] Integração drag & drop (HTML5 DnD ou `@dnd-kit`) com chamada a `PATCH /move`
- [ ] Rota `/` mostra o Kanban; rota `/about` placeholder
- [ ] `npm run build` (vitest) — esperado: sem erros TS

## 5. Testes & verificação end-to-end

- [ ] `vite dev` (frontend) — esperado: `http://localhost:5173` com Kanban renderizado
- [ ] `./mvnw spring-boot:run` (backend) — esperado: API em `:8080/api/tasks`
- [ ] Smoke API:
  - [ ] `curl POST /api/tasks` cria uma task
  - [ ] `curl GET /api/tasks` lista
  - [ ] `curl PATCH /api/tasks/{id}/move` muda status
  - [ ] `curl DELETE /api/tasks/{id}` remove
- [ ] E2E (Playwright já presente no boilerplate) — opcional nesta POC

## 6. Entrega final

- [ ] Atualizar `README.md` raiz com instruções run + endpoints
- [ ] Commit final + push (`gh repo view` confirma último commit no remote)
- [ ] `CHECKLIST.md` ✅ todos os itens críticos
- [ ] `EVIDENCES.md` ✅ logs de cada comando `lc` rodado
- [ ] `METRICS.md` ✅ duração por etapa e total
- [ ] Marcar goal como **complete**
