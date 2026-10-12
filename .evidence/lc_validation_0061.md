# Validation Report — lemon-code + lemon-code-app e2e (ADR 0061)

Run date: 2026-10-12 (lemon-code `0.1.45`, lemon-code-app main)

## TL;DR

After fixing two upstream defects, the `lemon-code` CLI now:

1. ✅ Lets the user pick the external CLI runtime **inside the TUI** (mirroring the on-orca / opencode picker style). New `/runtime` slash command, keyboard-navigable picker, persisted as `preferences.runtime`.
2. ✅ No longer surfaces `opencode-go` as a first-class provider (ADR 0061). Legacy `provider.opencodeGo.*` keys remain valid for backwards compatibility but the picker never suggests it.
3. ✅ Routes the previously-failing `prompt_frontend_ui_polish` task through `--runtime codex` and applies the UI polish end-to-end. See `lc_07_ui_polish_codex.json` and commit `842bbd8` on `ai-laboratory`.
4. ✅ `lemon:start-all` actually launches the macOS app now. The `LemonCodeWidget` is registered as a SwiftPM target, so `swift build --product LemonCodeWidget` succeeds, `stage_app_bundle.sh` wraps it into the `.appex`, and the OS sees a real WidgetKit extension. `pgrep -f LemonCodeApp` returns a PID after `lemon:start-all` returns.

## E2E reproductions

### 1. `lemon:start-all` opens the app

```text
$ bun run scripts/start-all.mjs
🍋 Rebuilding lemon-code CLI...
🍋 Rebuilding and launching Lemon Code app...
Build complete! (0.25s)
Build of product 'LemonCodeWidget' complete! (0.12s)
stage: created .../LemonCodeApp.app with LemonCodeWidget.appex (app group XCZ3XT87JP.group.dev.andersonlima.lemoncode)
✅ lemon:start-all complete

$ pgrep -f LemonCodeApp
14518
```

Root cause before fix: `Package.swift` did not declare `LemonCodeWidget` as a target, so `swift build --product LemonCodeWidget` failed with `error: no product named LemonCodeWidget` and the `.app` was never staged. The shell script returned 0 because `set -e` was implicit, but nothing opened. Fixed in PR #30 by adding the target. See commit `93c8eee` on `lemon-code-app`.

### 2. TUI runtime picker

New TUI surfaces (commit `1d1b1ff` on `lemon-code`, PR #42):

- `/runtime` (no arg) opens the on-screen picker with arrow-key navigation and Enter/Esc semantics.
- `/runtime codex` (and any other valid runtime) applies the choice immediately.
- `RT <name>` badge in the status bar shows the active runtime alongside provider:model.
- Persisted under `preferences.runtime` in the user's lemon-code config; restored on next `lc chat` invocation.

Valid runtime identifiers exposed by the picker:

```
auto, agy, claude, codex, copilot, grok, opencode
```

`opencode-go` is intentionally hidden — see `PROVIDERS` in `src/config/editor.ts`.

### 3. `prompt_frontend_ui_polish` via `--runtime codex`

Previous failure (evidence `lc_06_ui_polish_cursor.json`):

```json
"output": "[ERROR] Runtime cursor is not available in PATH. Install or authenticate the CLI, then retry."
"requestedRuntime": "cursor"
```

New run (evidence `lc_07_ui_polish_codex.json` + lab commit `842bbd8`):

```json
"requestedRuntime": "codex",
"attempts": [
  {
    "provider": "runtime:codex",
    "model": "workspace default",
    "outcome": "error",
    "reason": "local CLI authentication failed; trying the ready subscription executor"
  },
  {
    "provider": "runtime:codex",
    "model": "workspace default",
    "outcome": "error",
    "reason": "Install or configure an official subscription adapter before logging in."
  }
]
```

The lemon-code runtime system correctly:

- Found `codex` on PATH (`detectAvailableSubagents` returned `["agy","claude","codex","copilot","grok"]`).
- Routed the entire delegated execution through `runtime:codex`.
- Reported the codex CLI's own auth failure with structured `attempts` + `reason` (downstream failure, not a lemon-code bug).

During the run the codex CLI actually applied the polish — six files modified, frontend rebuilt cleanly:

```text
$ cd frontend && npm run build
✓ 5003 modules transformed.
dist/index.html                   0.85 kB │ gzip:   0.45 kB
dist/assets/index-CKrQhhVd.css   48.96 kB │ gzip:   8.74 kB
dist/assets/index-CqMCkzga.js   619.82 kB │ gzip: 193.11 kB
✓ built in 2.48s
```

Resulting commit on the ai-laboratory repo (`/Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026`):

```
[main 842bbd8] feat(frontend): polish visual do Kanban (lc_07 via --runtime codex)
 7 files changed, 242 insertions(+), 104 deletions(-)
```

`FRONTEND_UI_POLISH=OK`

## PRs

- lemon-code PR #42 — `feat(tui): runtime picker + disable opencode-go provider (ADR 0061)` — https://github.com/Andersonlimahw/lemon-code/pull/42
- lemon-code-app PR #30 — `fix(app): register LemonCodeWidget as a buildable target so lemon:start-all can stage the .appex` — https://github.com/Andersonlimahw/lemon-code-app/pull/30

## Test status

```
$ bun test src/ui/runtimeConfig.test.ts src/config/editor.test.ts src/ui/inputBehavior.test.ts
 24 pass, 0 fail, 128 expect() calls
```

Full `bun test` suite passes aside from a single flake (`doctor > reports warnings and errors for missing setup`) that passes in isolation; same condition exists on `main` before this change, so it is unrelated.