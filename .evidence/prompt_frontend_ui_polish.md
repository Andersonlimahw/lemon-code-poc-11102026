Você está em /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026. Frontend React+TS+Vite em ./frontend. O Kanban TODO List já está funcional (lc_03 criou) — agora você só vai refinar a UI sem mudar lógica de negócio.

OBJETIVO ÚNICO: polish visual do Kanban existente sem alterar:
- nenhuma chamada API (services/tasks.ts)
- nenhum hook (hooks/useTasks.ts)
- nenhuma rota (main.tsx)
- nenhuma persistência / Mirage passthrough

O QUE MELHORAR (escopo fechado):

A) ./frontend/src/index.css
   - Adicionar keyframes `fadeIn` (200ms ease-out), `slideUp` (250ms cubic-bezier(0.22, 1, 0.36, 1)) e `popIn` (180ms).
   - Importar o animate.css do Tailwind (se preferir, habilite via tailwind.config.js plugin mas NÃO adicione deps novas).
   - Definir `body { @apply bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100; }` e `html { scroll-behavior: smooth; }`.

B) ./tailwind.config.js
   - Manter o que já tem. Apenas garantir que `darkMode: 'class'` está setado (se não estiver, adicionar).

C) ./frontend/src/components/kanban/KanbanBoard.tsx
   - Adicionar header sticky com: título "🍋 Kanban", subtítulo "TODO List da POC lemon-code", chip mostrando total de tasks, e botão "+ Nova Tarefa" com gradiente (`from-amber-400 to-orange-500`).
   - States de carregamento: skeleton de 4 colunas com 3 placeholders cada (use `animate-pulse`).
   - State de erro: card central com ícone, texto descritivo e botão "Tentar novamente" usando `refetch` do useTasks.
   - Container principal: `min-h-screen p-6 lg:p-10 max-w-[1600px] mx-auto`.
   - Use `motion-safe:animate-fadeIn` no container.

D) ./frontend/src/components/kanban/KanbanColumn.tsx
   - Layout: header com gradiente sutil por coluna (TODO=cinza→slate, IN_PROGRESS=azul→cyan, REVIEW=âmbar→laranja, DONE=verde→emerald).
   - Drag-over visual: quando estiver com task sendo arrastada por cima, adicione `ring-2 ring-amber-400 ring-offset-2 bg-amber-50/40` e `scale-[1.01]` transition.
   - Empty state: ícone do phosphor (`ClipboardText`, `CircleNotch`, `Eye`, `CheckCircle` para cada coluna respectivamente), frase curta.
   - Contador no header: badge arredondado com total de cards.

E) ./frontend/src/components/kanban/TaskCard.tsx
   - Hover: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`.
   - Drag handle: cursor `grab active:cursor-grabbing`, opacity-50 quando arrastando.
   - Priority badge: usar gradiente (`low=slate`, `medium=amber-500 text-white`, `high=rose-600 text-white`) — mais legível que bg-200.
   - Description: line-clamp-2 com `text-slate-500 text-sm`.
   - Footer: ícones phosphor `PencilSimple` (edit) e `Trash` (delete) com tooltip `title=...`.

F) ./frontend/src/components/kanban/TaskFormDialog.tsx
   - Use `@radix-ui/react-dialog` (já nas deps) com overlay escuro, animação slideUp/fadeIn (Tailwind `data-[state=open]:animate-*`).
   - Form em 2 colunas em >=md (campos: title full-width no topo, depois description full-width, depois status + priority em grid-cols-2).
   - Footer com botões "Cancelar" (ghost) e "Salvar" (gradient amber→orange, mesmo padrão do FAB).
   - Validação inline: borda vermelha no input + texto de erro abaixo se title vazio.

G) NÃO mexa em:
   - frontend/src/services/tasks.ts
   - frontend/src/hooks/useTasks.ts
   - frontend/src/types/task.ts (a não ser que precise tipar nova prop)
   - frontend/src/pages/Kanban/index.tsx
   - frontend/src/main.tsx
   - frontend/src/mocks/miragejs/* (o passthrough já está ok)
   - frontend/package.json (NÃO adicione dependências novas; use APENAS o que existe: @phosphor-icons/react, @radix-ui/react-dialog, clsx, tailwindcss)

H) Ao final:
   cd frontend && npm run build 2>&1 | tail -20
   Se exit 0 e dist/ atualizou, termine com:
   FRONTEND_UI_POLISH=OK
   Se falhou, mostre o erro e termine com:
   FRONTEND_UI_POLISH=FAIL

Faça TUDO em uma única passada. Sem perguntas. Liste os arquivos modificados no fim.