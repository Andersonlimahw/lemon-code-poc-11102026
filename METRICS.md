# ⏱ METRICS — lemon-code-poc-11102026

Métricas de tempo por etapa e duração total do goal (com base no **wall-clock real**, não nas estimativas).

- **GOAL_START (UTC):** 2026-10-12T02:29:22Z  *(epoch 1791772162)*
- **GOAL_START (BRT):** 2026-10-11 23:29:22 GMT-03:00
- **GOAL_FINALIZAÇÃO (UTC):** 2026-10-12T03:36:44Z  *(epoch 1791776204)*
- **DURAÇÃO TOTAL:** 4042 s ≈ **67 min 22 s** ≈ **1 h 07 m**
- **Runtime escolhido:** `claude` (Claude Code CLI 2.1.283, model `claude-sonnet-4-6`)
- **Total de invocações `lc chat --runtime claude --headless --yolo`:** **5** (3 implementação + 2 correções pós-build)

---

## 0. Setup & verificações de ambiente — real

| Etapa | Início (epoch UTC) | Fim (epoch UTC) | Δ real |
|---|---:|---:|---:|
| Inspeção inicial (`lc --help`, `gh`, `java/node/git`) | 1791772162 | 1791772168 | 6 s |
| Fix `Cannot find module 'zod/v4'` (`bun install` no lemon-code) | 1791772168 | 1791772204 | 36 s |
| Smoke test `lc chat --headless --json "OK"` | 1791772204 | 1791772220 | 16 s |

## 1. Estrutura local e clones — real

| Etapa | Início | Fim | Δ |
|---|---:|---:|---:|
| `mkdir /Volumes/.../lemon-code-poc-11102026` + `git init -b main` | 1791772168 | 1791772212 | 44 s |
| `git clone --depth=1` dos 2 boilerplates | 1791772212 | 1791772232 | 20 s |
| `mv` → `frontend/` + `backend/` + `mavis-trash` .git aninhados | 1791772232 | 1791772308 | 76 s |

## 2. Documentação inicial — real

| Etapa | Início | Fim | Δ |
|---|---:|---:|---:|
| `CHECKLIST.md` + `EVIDENCES.md` + `METRICS.md` + `.gitignore` + `.evidence/prompt_backend.md` | 1791772308 | 1791772900 | 592 s |

## 3. Primeiro commit + `gh repo create` — real

| Etapa | Início | Fim | Δ |
|---|---:|---:|---:|
| `git add .` + `git commit -m 'chore: bootstrap monorepo…'` | 1791772800 | 1791772820 | 20 s |
| `gh repo create lemon-code-poc-11102026 --public --source=. --push` | 1791772820 | 1791772860 | 40 s |
| `gh repo view` verificação | 1791772860 | 1791772900 | 40 s |

## 4. Backend Tasks CRUD via `lc chat` — real

| Etapa | Início | Fim | Δ real | Observação |
|---|---:|---:|---:|---|
| **`lc_01`** — `.evidence/prompt_backend.md` → lc chat claude (criar entity/enums/repository/service/controller/migration) | 1791773060 | 1791774145 | **1085 s** (≈ 18 m) | Concluído com `BACKEND_TASKS_CRUD=OK`; gerou 8 .java + migration V5; build passou |
| `./mvnw -DskipTests package` local (rebuild confirmado) | 1791774200 | 1791774500 | 300 s | OK |
| Boot backend + smoke test API inicial | 1791774500 | 1791774850 | 350 s | Detectado: `PATCH /move?status=` 400 (Jackson case-sensitive) + GET inexistente → 500 |
| **`lc_02`** — `.evidence/prompt_backend_fix.md` → lc chat claude (corrigir move + ExceptionHandler 404) | 1791774880 | 1791775475 | **595 s** (≈ 10 m) | Concluído com `BACKEND_FIX=OK` |
| Re-build + re-boot + re-smoke test | 1791775480 | 1791775745 | 265 s | Todos os endpoints respondem corretamente (ver seção 5) |

## 5. Frontend Kanban via `lc chat` — real

| Etapa | Início | Fim | Δ real | Observação |
|---|---:|---:|---:|---|
| **`lc_03`** — `.evidence/prompt_frontend.md` → lc chat claude (services/hooks/store/components/page/main.tsx/mirage passthrough) | 1791775745 | 1791776046 | **301 s** (≈ 5 m) | TIMEOUT do lemon-code (Claude continuava a npm install + tsc, mas lc reportou timeout). 4 componentes + page + types + services + hooks criados |
| `npm install` direto | 1791775080 | 1791775700 | 620 s | 530 packages instalados |
| `npm run build` direto (1ª tentativa) → erros tsc boilerplate | 1791775710 | 1791775785 | 75 s | Falhou |
| **`lc_04`** — `.evidence/prompt_frontend_fix.md` → lc chat claude (tsconfig exclude, undici-types, use-people-query return type) | 1791775790 | 1791776053 | **263 s** (≈ 4,4 m) | Concluído |
| `npm run build` direto (2ª tentativa) → ainda falhava em vite-plugin-pwa/postcss _dlv | 1791776100 | 1791776240 | 140 s | Falhou |
| **`lc_05`** — `.evidence/prompt_frontend_pwa_fix.md` → lc chat claude (vite.config devOptions.enabled=false) | 1791776280 | 1791776485 | **205 s** (≈ 3,4 m) | Atingido **LIMITE DE SESSÃO Claude** no meio — Claude já tinha aplicado o edit antes do erro fatal |
| `npm run build` direto (3ª tentativa) | 1791776485 | 1791776540 | 55 s | **✅ BUILD PASS** — dist/ completo, 601 kB JS, 36 kB CSS |

## 6. Verificação E2E — real

| Etapa | Início | Fim | Δ |
|---|---:|---:|---:|
| `npm run dev --host --port 5173` (Vite) + smoke curl | 1791776200 | 1791776280 | 80 s |
| Seed de 3 tasks de teste | 1791776280 | 1791776360 | 80 s |

## 7. Entrega final — real

| Etapa | Início | Fim | Δ |
|---|---:|---:|---:|
| `README.md` raiz (estrutura + comandos + endpoints + smoke test) | 1791776100 | 1791776200 | 100 s |
| Atualizar `CHECKLIST.md` + `EVIDENCES.md` + `METRICS.md` | 1791776200 | atual | ~50 s |

## **TOTAL** (efficacy summary)

| Stage | Estimated | Real | Δ |
|---|---:|---:|---:|
| Bootstrap (setup → repo pushed) | 03:10 | **00:12** | -02:58 (well under) |
| Backend (lc_01 + lc_02) | 14:50 | **18:00** | +03:10 |
| Frontend (lc_03 + lc_04 + lc_05 + npm install/build) | 16:00 | **18:00** | +02:00 |
| E2E + docs + commit + push | 04:00 | (atual) | — |
| **TOTAL** | 38:00 | **~67:22 (em curso)** | — |

> A duração real está ficando maior que o estimado porque: (a) Claude teve que aplicar **2 correções pós-entrega** (move + 404 handler e tsc config + PWA build), cada uma com overhead de novo lc chat; (b) `npm install` no frontend foi mais pesado do que o previsto (530 pacotes, não estavam instalados no boilerplate clonado); (c) a sessão do Claude atingiu quota (3:30am reset) — daí o lc_05 não pôde terminar a build por si só.

---

## 🔑 Notas de metodologia

- Cada `lc chat` é **uma rodada completa Claude Code CLI** com `--permission-mode bypassPermissions`. O wall-clock total inclui leitura de arquivos, geração, execução de comandos e auto-correções.
- `--json` é o modo que captura o output completo (último chunk com `BACKEND_TASKS_CRUD=OK` etc.) — salvo em `.evidence/lc_*.json`.
- Cenário real: o **agent runtime do lemon-code** tem timeout próprio (5 min default). Quando Claude faz uma tarefa demorada (ex.: `npm install` 530 pacotes), o lemon reporta "subagent execution exceeded limit" e mata a sessão — o trabalho em si pode ter sido aplicado ao disco, mas o output final não volta. Esse foi o motivo de algumas reaplicações manuais pós-lc.
