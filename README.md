# 🍋 lemon-code-poc-11102026

POC end-to-end de um **TODO List Kanban CRUD completo** em monorepo único: backend **Spring Boot 3.3.1 (Java 21 + JPA + H2 + Flyway)** e frontend **React 18 + TypeScript + Vite + Zustand + TanStack Query + Radix UI + react-toastify**.

> Toda a implementação de feature foi **orquestrada via [`lemon-code`](https://github.com/lemon-code) CLI** com runtime `claude` — ver `EVIDENCES.md` para o log bruto de cada `lc chat …` e `METRICS.md` para tempos por etapa.

---

## 📁 Estrutura

```
lemon-code-poc-11102026/
├── backend/                         # Spring Boot 3.3.1 (boilerplate: java-journey)
│   ├── src/main/java/com/lemon/planner/
│   │   ├── activity/                 # boilerplate (não tocado)
│   │   ├── link/                     # boilerplate (não tocado)
│   │   ├── participant/              # boilerplate (não tocado)
│   │   ├── trip/                     # boilerplate (não tocado)
│   │   ├── PlannerApplication.java   # boilerplate (não tocado)
│   │   └── task/                     # ★ Feature Kanban — Task CRUD
│   │       ├── Task.java
│   │       ├── TaskStatus.java
│   │       ├── TaskPriority.java
│   │       ├── TaskRepository.java
│   │       ├── TaskRequestPayload.java
│   │       ├── TaskData.java
│   │       ├── TaskService.java
│   │       ├── TaskController.java
│   │       └── TaskExceptionHandler.java
│   └── src/main/resources/db/migration/
│       ├── V1__create-table-trips.sql
│       ├── V2__create-table-participants.sql
│       ├── V3__create-table-activities.sql
│       ├── V4__create-table-links.sql
│       └── V5__create_tasks.sql     # ★ migration da feature
├── frontend/                         # React + Vite (boilerplate: react-testforge-starter)
│   └── src/
│       ├── types/task.ts
│       ├── services/tasks.ts
│       ├── hooks/useTasks.ts
│       ├── components/kanban/
│       │   ├── KanbanBoard.tsx
│       │   ├── KanbanColumn.tsx
│       │   ├── TaskCard.tsx
│       │   └── TaskFormDialog.tsx
│       └── pages/Kanban/index.tsx
├── CHECKLIST.md                     # plano de execução
├── EVIDENCES.md                     # log bruto dos lc chat … outputs
├── METRICS.md                       # tempos por etapa
└── README.md (este arquivo)
```

---

## 🚀 Como rodar

### Pré-requisitos

- Java 21 (ou 24 — project compila com JDK atual instalado)
- Maven 3.9+
- Node 22+
- npm 10+
- gh CLI autenticado em `Andersonlimahw` (já OK nesta máquina)

### Backend

```bash
cd backend
./mvnw -DskipTests package                       # build → target/planner-0.0.1-SNAPSHOT.jar
java -jar target/planner-0.0.1-SNAPSHOT.jar     # sobe em :8080
```

Alternativa com reload:
```bash
cd backend
./mvnw spring-boot:run
```

Endpoints disponíveis:
- `GET    /api/tasks`
- `GET    /api/tasks/{id}`
- `POST   /api/tasks`
- `PATCH  /api/tasks/{id}`
- `PATCH  /api/tasks/{id}/move?status=<enum>&position=<long>`
- `DELETE /api/tasks/{id}`

Banco padrão: **H2 em memória**, migrations via Flyway sob `src/main/resources/db/migration`.

### Frontend

```bash
cd frontend
npm install                                       # (uma vez; já feito no bootstrap)
npm run dev                                       # dev em :5173
# ou build de produção:
npm run build && npm run preview
```

Aponte o backend via env var (default: `http://localhost:8080`):
```bash
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

A página `/` renderiza o Kanban de 4 colunas (A Fazer / Em Andamento / Em Revisão / Concluído) com drag&drop.

---

## 🧪 Smoke test rápido (curl)

```bash
# 1) criar
curl -sX POST localhost:8080/api/tasks -H 'Content-Type: application/json' \
  -d '{"title":"Desenhar wireframe","priority":"high"}'

# 2) listar
curl -s localhost:8080/api/tasks | jq .

# 3) mover (status lowercase!)
ID=...
curl -sX PATCH "localhost:8080/api/tasks/${ID}/move?status=in_progress&position=2"

# 4) editar
curl -sX PATCH "localhost:8080/api/tasks/${ID}" -H 'Content-Type: application/json' \
  -d '{"priority":"medium","description":"detalhes"}'

# 5) deletar
curl -siX DELETE "localhost:8080/api/tasks/${ID}"
```

> ⚠️ Devido ao `@JsonValue` lowercase nos enums, status e priority devem ser enviados em **minúsculas**:
> `task status`: `todo`, `in_progress`, `review`, `done`
> `task priority`: `low`, `medium`, `high`

---

## 🧱 Arquitetura

| Camada | Backend | Frontend |
|---|---|---|
| Linguagem / stack | Java 21, Spring Boot 3.3.1 | TypeScript, React 18 |
| Persistência | JPA + H2 + Flyway | — |
| API | REST (`/api/tasks/*`), OpenAPI implícito | fetch() direto |
| Estado servidor | — | TanStack Query v5 (cache + invalidation) |
| Estado UI | — | React state local (form modal) |
| Validação | `jakarta.validation` no payload | HTML5 + cliente |
| Erros | `@ControllerAdvice` → 404 NotFound / 400 validation | `react-toastify` toasts |
| CORS | `@CrossOrigin("http://localhost:5173")` no controller | — |

---

## 📚 Documentos auxiliares

- [CHECKLIST.md](CHECKLIST.md): plano de execução com checkboxes por etapa.
- [EVIDENCES.md](EVIDENCES.md): log bruto dos comandos `lc chat` rodados — auditoria.
- [METRICS.md](METRICS.md): tempos por etapa e total do goal (estimado + real).
- [.evidence/prompt_*.md](.evidence/): prompts exatos enviados ao Claude.
- [.evidence/lc_*.json](.evidence/): outputs `--json` de cada invocação do `lc chat`.

---

## 🔁 Reprodução em outra máquina

```bash
# 1) Backend
cd backend && ./mvnw spring-boot:run &

# 2) Frontend
cd frontend && npm install && npm run dev &

# Abrir http://localhost:5173 → Kanban renderizado com 4 colunas
# Drag&Drop entre colunas atualiza o backend via PATCH /move
```

---

🍋 **POC orquestrada via lemon-code CLI (runtime: claude).** Cada feature entregue em uma única passada por Claude Code, sob comando e critério do humano (orquestrador).