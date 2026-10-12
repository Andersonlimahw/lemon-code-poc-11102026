# 📜 EVIDENCES — lemon-code-poc-11102026

Log bruto de **todos os comandos executados via lemon-code CLI** (`lc …`) e demais comandos de infraestrutura que sustentam a POC.

> Todos os timestamps são wall-clock local (BRT = GMT-03:00). Cada invocação de `lc chat --runtime claude --headless --yolo` gerou um JSON em `.evidence/lc_*.json`.

---

## E0 — Pré-flight

### `bun install` em `lemon-code/`
- **Objetivo:** corrigir `Cannot find module 'zod/v4' from '.../ai@7.0.105@@@1/dist/index.js'` no primeiro `lc --help`.
- **Comando:** `cd /Users/andersonlimadev/Projects/IA/lemon-code-project/lemon-code && bun install`
- **Resultado:** 320 packages installed em 1.06 s. `lc --help` voltou a funcionar.

### `gh auth status`
- Conta: `Andersonlimahw`. Scopes: `gist`, `read:org`, `repo`, `workflow`.

### `which claude`
- `/Users/andersonlimadev/.local/bin/claude` → `Claude Code 2.1.283`.

---

## E1 — `lc_01` — primeira implementação do backend (Tasks CRUD)

- **Comando:**
  ```
  cd /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026
  LEMON_YOLO_ACKNOWLEDGE=true lc chat --runtime claude --headless --yolo \
      --effort high --json "$(cat .evidence/prompt_backend.md)" \
      > .evidence/lc_01_backend.json 2>&1
  ```
- **Output real (trecho do JSON final):**
  ```json
  {"type":"chunk","content":"Apenas warnings JVM — sem erros de compilação. Build passou.\n\nBACKEND_TASKS_CRUD=OK"}
  {"type":"done","output":"...","provider":"runtime:claude","model":"claude-sonnet-4-6",
   "route":{"attempts":[{"provider":"runtime:claude","outcome":"success","durationMs":103251}]}}
  ```
- **Duração Claude:** 103 251 ms (≈ 1 m 43 s na execução do agente — wall-clock total ~5 min incluindo MCP setup).
- **Arquivos criados (8 java + 1 migration):**
  - `backend/src/main/java/com/lemon/planner/task/TaskStatus.java` (204 B)
  - `backend/src/main/java/com/lemon/planner/task/TaskPriority.java` (192 B)
  - `backend/src/main/java/com/lemon/planner/task/Task.java` (1087 B)
  - `backend/src/main/java/com/lemon/planner/task/TaskRepository.java` (337 B)
  - `backend/src/main/java/com/lemon/planner/task/TaskRequestPayload.java` (202 B)
  - `backend/src/main/java/com/lemon/planner/task/TaskData.java` (597 B)
  - `backend/src/main/java/com/lemon/planner/task/TaskService.java` (2173 B)
  - `backend/src/main/java/com/lemon/planner/task/TaskController.java` (1374 B → passou para 1717 B no lc_02)
  - `backend/src/main/resources/db/migration/V5__create_tasks.sql` (Flyway ordenou após V4__create-table-links.sql)

---

## E2 — Backend smoke test direto + identificação de defeitos

```
$ curl -sX POST http://localhost:8080/api/tasks -H 'Content-Type: application/json' \
       -d '{"title":"Desenhar wireframe","description":"...","priority":"HIGH"}'
{"timestamp":"...","status":400,"error":"Bad Request","path":"/api/tasks"}   ← bug 1: Jackson enums case-sensitive
```

Log do backend:
```
Resolved [org.springframework.http.converter.HttpMessageNotReadableException:
 JSON parse error: Cannot deserialize value of type `com.lemon.planner.task.TaskPriority`
 from String "HIGH": not one of the values accepted for Enum class: [high, low, medium]]
```

```
$ curl -s http://localhost:8080/api/tasks/00000000-0000-0000-0000-000000000000 -w "[%{http_code}]"
[500]   ← bug 2: EntityNotFoundException não mapeado → 500 em vez de 404
```

**Decisão:** lc_02 corrige ambos.

---

## E3 — `lc_02` — fix cirúrgico do backend

- **Comando:** análogo ao E1, com `.evidence/prompt_backend_fix.md`.
- **Output real:**
  ```json
  {"type":"chunk","content":"Build passou (só warnings de JVM, zero erros de compilação).\n\nBACKEND_FIX=OK"}
  ```
- **Duração Claude:** 61 995 ms (≈ 62 s).
- **Mudanças:**
  - `TaskController.java`: assinatura de `move(...)` alterada para aceitar `String statusRaw` + parse manual.
  - Criado `backend/src/main/java/com/lemon/planner/task/TaskExceptionHandler.java` (1133 B, `@ControllerAdvice` para `EntityNotFoundException` → 404 e `MethodArgumentNotValidException` → 400).

### Re-smoke test (após lc_02)

```
$ curl -sX POST ... -d '{"title":"Wireframe","priority":"high"}'
{"id":"dd9576ef-...","status":"todo","priority":"high","position":0,...}      ← 201 ✓

$ curl -sX PATCH ".../dd9576ef-.../move?status=in_progress&position=5"
{"id":"dd9576ef-...","status":"in_progress","priority":"high","position":5,...} ← 200 ✓

$ curl -sX PATCH ".../dd9576ef-.../move?status=IN_PROGRESS&position=3"  ← caixa alta também aceita
{"id":"dd9576ef-...","status":"in_progress","position":3,...}              ← 200 ✓ (toUpperCase no controller)

$ curl -sX PATCH ".../dd9576ef-.../move?status=BANANA&position=1" -w "[%{http_code}]\n"
{"status":400,"error":"Bad Request",...}                                    ← 400 ✓ + JSON descritivo

$ curl -s ".../00000000-0000-0000-0000-000000000000" -w "[%{http_code}]\n" ; cat body
{"status":404,"message":"Task 00000000-... não encontrada","error":"Not Found"}   ← 404 ✓

$ curl -siX DELETE ".../dd9576ef-..." | head -1
HTTP/1.1 204 No Content                                                       ← 204 ✓
```

---

## E4 — `lc_03` — frontend Kanban (primeira passada)

- **Comando:** lc chat claude com `.evidence/prompt_frontend.md`.
- **Output real:** `Runtime claude failed: [timeout] subagent execution exceeded limit` após 301 533 ms.
- **Resultado prático apesar do timeout:** Claude Code já havia aplicado as mudanças. Arquivos criados/modificados:
  - `frontend/src/types/task.ts` ✓
  - `frontend/src/services/tasks.ts` ✓
  - `frontend/src/hooks/useTasks.ts` ✓
  - `frontend/src/components/kanban/TaskCard.tsx` ✓
  - `frontend/src/components/kanban/KanbanColumn.tsx` ✓
  - `frontend/src/components/kanban/KanbanBoard.tsx` ✓
  - `frontend/src/components/kanban/TaskFormDialog.tsx` ✓
  - `frontend/src/pages/Kanban/index.tsx` ✓
  - `frontend/src/main.tsx` (rota `/` → `<Kanban/>`)
  - `frontend/src/mocks/miragejs/routes.js` (passthrough `/api/**`)

---

## E5 — `npm install` + `npm run build` direto (entre E4 e E6)

- 530 packages instalados em 60 s.
- `tsc` falhou em erros do boilerplate (`undici-types`, `route-recognizer`, `MockQueryState` outdated, `use-people-query.ts` retornando `void | T[]`). `vite-plugin-pwa` falhou em `_dlv.default is not a function` no postcss-import.

---

## E6 — `lc_04` — frontend tsc fix

- **Comando:** lc chat claude com `.evidence/prompt_frontend_fix.md`.
- **Output real:**
  ```json
  {"type":"chunk","content":"Build rodando em background, aguardando notificação."}
  ```
- **Duração Claude:** 262 791 ms (≈ 4 m 23 s). Saiu por timeout mas o agent já tinha feito as edições.
- **Mudanças aplicadas:**
  - `frontend/tsconfig.json`: `"skipLibCheck": true`, `"exclude": ["node_modules", "dist", "e2e", "**/*.test.ts", "**/*.test.tsx", "playwright-report", "test-results"]`.
  - `frontend/src/commons/hooks/use-people-query.ts`: retornando `data ?? []`.
  - `frontend/package.json` + `package-lock.json`: adicionado `undici-types@^6` em devDependencies (npm i undici-types --save-dev).

### Re-build direto (após lc_04)

- `tsc` passou ✓
- `vite build` falhou em vite-plugin-pwa → `_dlv.default is not a function` no postcss-import de react-toastify.css ✗

---

## E7 — `lc_05` — frontend PWA/postcss fix

- **Comando:** lc chat claude com `.evidence/prompt_frontend_pwa_fix.md`.
- **Erro fatal:**
  ```json
  {"output":"[ERROR] Runtime claude failed: You've hit your session limit · resets 3:30am (America/Sao_Paulo)",
   "durationMs":203698}
  ```
- **Apesar do erro fatal, Claude já tinha aplicado o edit antes:**
  - `frontend/vite.config.js`: `devOptions: { enabled: false }` (era `true`).

---

## E8 — `npm run build` direto (FINAL — sucesso)

```
$ cd frontend && npm run build

> boilerplate-react@1.0.0 build
> tsc && vite build

vite v6.3.5 building for production...
transforming...
✓ 5004 modules transformed.
rendering chunks...
computing gzip size...
dist/registerSW.js                0.13 kB
dist/manifest.webmanifest         0.18 kB
dist/index.html                   0.85 kB │ gzip:   0.45 kB
dist/assets/index-DED6T_lM.css   36.31 kB │ gzip:   7.11 kB
dist/assets/index-CNAPeamw.js   601.23 kB │ gzip: 188.38 kB
✓ built in 4.93s

PWA v1.0.0
mode      generateSW
precache  6 entries (649.43 KiB)
```

✅ **BUILD SUCCESS** — frontend pronto.

---

## E9 — Frontend dev server + seed de tasks para o Kanban

```
$ npm run dev --host --port 5173
  VITE v6.3.5  ready in 299 ms
  ➜  Local:   http://localhost:5173/
  
$ curl -X POST localhost:8080/api/tasks -d '{"title":"Configurar CI/CD","priority":"high","position":1}'
{"id":"a0d50e0b-...","status":"todo","priority":"high","position":1,...}

$ curl -X POST localhost:8080/api/tasks -d '{"title":"Revisar PRs pendentes","status":"review","priority":"medium"}'
{"id":"72e3dbe7-...","status":"review","priority":"medium",...}

$ curl -X POST localhost:8080/api/tasks -d '{"title":"Documentar endpoints","status":"done","priority":"low"}'
{"id":"f6485eb8-...","status":"done","priority":"low",...}
```

3 tasks seeded para visualização inicial no Kanban.

---

## Resumo das execuções `lc chat --runtime claude --headless --yolo`

| id | prompt | status | duração claude | duração wall-clock | resultado |
|---|---|---|---:|---:|---|
| lc_01 | prompt_backend.md | success | 103 s | ~5 min | BACKEND_TASKS_CRUD=OK |
| lc_02 | prompt_backend_fix.md | success | 62 s | ~3 min | BACKEND_FIX=OK |
| lc_03 | prompt_frontend.md | timeout (mas aplicou) | n/a | ~6 min | arquivos criados, build não validado |
| lc_04 | prompt_frontend_fix.md | timeout (mas aplicou) | n/a | ~5 min | tsc passa, vite-plugin-pwa falha |
| lc_05 | prompt_frontend_pwa_fix.md | session limit hit | n/a | ~3 min | edit aplicado, build não validado |

A operação total `lc chat` wall-clock: ~22 minutos de invocações + 12 min de overhead Claude MCP/CI = **~34 min** consumidos do total de 67 min do goal.

---

## Convenções finais

- **backend build:** `cd backend && ./mvnw -DskipTests package` → gera `target/planner-0.0.1-SNAPSHOT.jar` (~48 MB).
- **backend run:** `java -jar target/planner-0.0.1-SNAPSHOT.jar` → porta 8080.
- **frontend build:** `cd frontend && npm run build` → gera `dist/`.
- **frontend run:** `cd frontend && npm run dev --host --port 5173` → porta 5173.
- **smoke E2E:** rodar dois terminais (backend + frontend), abrir `http://localhost:5173`, drag entre colunas chama `PATCH /api/tasks/{id}/move?status=...&position=...`.
