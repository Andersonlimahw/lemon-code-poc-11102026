CONTEXTO: você está em /Volumes/lemon-ssd/projects-ssd/ai/ai-laboratory/lemon-code-poc-11102026. Frontend React+Vite+TS em ./frontend. Acabei de implementar o Kanban de Tasks CRUD que pediu, e npm install rodou com sucesso. Mas `npm run build` (que faz `tsc && vite build`) está falhando no `tsc`. Os erros vêm do BOILERPLATE pré-existente + algumas tipagens de teste; não causam impacto funcional em produção, mas bloqueiam o build.

OBJETIVO: fazer `npm run build` (tsc + vite build) terminar com exit 0 sem perder nenhum arquivo do Kanban (./src/types/task.ts, ./src/services/tasks.ts, ./src/hooks/useTasks.ts, ./src/components/kanban/, ./src/pages/Kanban/) que acabei de adicionar.

DIAGNÓSTICO (erros que aparecem em `tsc --noEmit`):

1. `node_modules/@testing-library/jest-dom/types/jest.d.ts(1,23): error TS2688: Cannot find type definition file for 'jest'.`
   - Solução: no tsconfig.json, remova 'jest' (e similares que não existam em @types/) da array `"types"` se houver, OU defina `"types": ["vitest/globals"]` apenas.

2. `node_modules/@types/node/globals.d.ts(...): error TS2307: Cannot find module 'undici-types'`
   - Solução 1: atualize @types/node para uma versão mais nova que tenha essa dep embutida (>=20.10).
   - Solução 2: adicione `undici-types` como devDependency e rode `npm i`.

3. `node_modules/vitest/node_modules/vite/...` erros de incompatibilidade de ViteRuntimeImportMeta / parseAst.
   - Solução: alinhe versões de vite/vitest (provavelmente subir vitest para ^1.6.1 ou superior coerente com vite 5+) OU se for caro, ignore esses paths via tsconfig.

4. `node_modules/route-recognizer/dist/route-recognizer.d.ts(1,56): error TS2307: Cannot find module './route-recognizer/dsl'` — pacote pré-existente sem .d.ts próprios; ignore via tsconfig exclude ou não exija tipagem dele (adicione `"skipLibCheck": true` ao tsconfig — talvez já esteja true, mas confirme; se estiver false, mude para true; isso silencia erros em .d.ts de libs de terceiros).

5. `src/commons/hooks/use-people-query.ts(22,5): error TS2322: Type 'void | PeopleModel[]' is not assignable to type 'PeopleModel[] | undefined'.`
   - Solução rápida: ajuste o return de usePeopleQuery para garantir `return data || [];` (NÃO `return data;`) — provavelmente é o padrão de MirageJS.

6. `src/pages/Groups/index.test.tsx(45,17): error TS7031...` + erros TS2322 em MockQueryState — esses são testes, NUNCA são compilados pelo `vite build`. Como `tsc` em modo "check all" está validando eles, a melhor saída é excluir testes do tsc:
   - Em tsconfig.json, adicione `"exclude": ["node_modules", "dist", "e2e", "**/*.test.ts", "**/*.test.tsx"]` (ou crie um `tsconfig.build.json` que não inclua testes e use-o no build).

AÇÕES EXATAS (apenas estas):

A) Editar frontend/tsconfig.json:
   - Adicionar ou mudar `"skipLibCheck": true`
   - Adicionar `"exclude": ["node_modules", "dist", "e2e", "**/*.test.ts", "**/*.test.tsx", "playwright-report", "test-results"]`
   - Garantir `"types": ["vitest/globals"]`
   - NÃO mexa em compilerOptions.library/target/module/jsx.

B) Em frontend/src/commons/hooks/use-people-query.ts, encontre o return e force `return data ?? [];` em vez de `return data;` (se já for esse formato, mantenha). Não altere lógica.

C) Não toque em mais nada do boilerplate. NÃO altere meus arquivos do Kanban. NÃO altere package.json a menos que seja ABSOLUTAMENTE necessário para `undici-types` (se for, adicione `"undici-types": "^6.0.0"` em devDependencies e rode `npm i undici-types --save-dev --no-audit --no-fund`).

D) Ao final, rode:
   cd frontend && npm run build 2>&1 | tail -50
   Se exit 0 e o dist/ foi gerado, termine com a linha EXATA:
   FRONTEND_BUILD_OK
   Se falhou, mostre os últimos 30 erros e termine com:
   FRONTEND_BUILD_FAIL

Faça em uma única passada. Sem perguntas.