# 📜 EVIDENCES — lemon-code-poc-11102026

Log bruto de **todos os comandos executados via lemon-code CLI** (`lc …`) e dos comandos de infraestrutura que sustentam a POC.
Formato: timestamp ISO-8601 UTC · comando · resultado (parâmetros são checáveis rodando o mesmo comando).

> Onde este documento aparece “Evidence gap”, significa que o comando ainda não foi executado por decisão de ordem (a etapa correspondente virá a seguir). Cada nova entrada é adicionada em ordem cronológica.

---

## E0 — Bootstrap & verificações de ambiente

### `lc --help` — listagem dos subcomandos disponíveis
- **Quando:** T+0 (após `bun install` em `lemon-code` para resolver `Cannot find module 'zod/v4'`).
- **Evidência:** a saída começa com `Usage: lc [options] [command]` e lista `chat`, `setup`, `config`, `profile`, `sessions`, `goal`, `plan`, etc.

### `lc chat --help` — confirmar flags disponíveis
- Confirmou: `--runtime <name>` aceita `claude | codex | gemini | agy | opencode | copilot | grok | cursor`.
- Confirmou: `--yolo` (= `--skip-permissions`), `--headless`, `--json`.

### `gh auth status`
- Confirma login em `github.com` como `Andersonlimahw`. Scopes: `gist`, `read:org`, `repo`, `workflow`. Necessário para `gh repo create --push`.

### `git config user.name` / `git config user.email`
- `Anderson Lima <andersonlimahw@gmail.com>` — autor usado em todos os commits.

### Versões de toolchain
- `git 2.52.0`, `node v26.8.1`, `java 24.0.2`, `mvn 3.9.11`. Backend usa `<java.version>21</java.version>` (compatível, JDK 24 compila).

---

## E1 — Estrutura local e clones dos boilerplates

### `mkdir + git clone --depth=1`
- `git clone --depth=1 https://github.com/Andersonlimahw/react-testforge-starter.git` → ok
- `git clone --depth=1 https://github.com/Andersonlimahw/java-journey.git` → ok

### `mv … frontend / backend` + `mavis-trash …` no `_tmp_clones` e `.git` aninhados
- `frontend/` agora contém o boilerplate sem histórico git próprio.
- `backend/` agora contém o boilerplate sem histórico git próprio.

### `git init -b main` no raiz
- Repositório único `lemon-code-poc-11102026` criado com branch `main`.

---

## E2 — Comandos `lc …` (a executar nas próximas fases)

A partir daqui, **toda implementação é feita via `lc chat …`**. Cada bloco abaixo será preenchido conforme rodamos.

### `lc explain …` / `lc ground …` / `lc plan …` (se necessário)
> *Evidence gap.*

### `lc chat --runtime claude --headless --yolo …` — backend (Tasks CRUD)
> *Evidence gap.*

### `lc chat --runtime claude --headless --yolo …` — frontend (Kanban CRUD)
> *Evidence gap.*

### `lc chat --runtime claude --headless --yolo …` — README + cross-link
> *Evidence gap.*

---

## E3 — `gh …`

### `gh repo create lemon-code-poc-11102026 --public --source=. --remote=origin --push`
> *Evidence gap — será executado após o primeiro commit local.*

---

## E4 — Verificações finais

### `gh repo view lemon-code-poc-11102026`
> *Evidence gap.*

### `npm run build` (frontend) e `./mvnw -DskipTests package` (backend)
> *Evidence gap.*

### `curl …` smoke tests do backend
> *Evidence gap.*

---

## Convenções

- **Cada bloco E2/E3/E4 acima** será preenchido com:
  - comando exato (incluindo flags)
  - working directory
  - trecho representativo da saída (stdout ou `--json`)
  - arquivos criados/modificados (resultado de `git status --short` antes/depois)
- Logs completos disponíveis no histórico do shell; este arquivo é a versão reduzida e organizada para auditoria.
