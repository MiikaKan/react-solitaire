# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is pnpm.

- `pnpm dev` — start Next.js dev server (http://localhost:3000)
- `pnpm build` — production build
- `pnpm lint` — run ESLint (flat config in `eslint.config.mjs`, based on `eslint-config-next`)
- `pnpm test` — run vitest in watch mode
- `pnpm test:run` — run vitest once (CI-style)
- Run a single test file: `pnpm vitest run src/game/gameState.test.ts`
- Run tests matching a name: `pnpm vitest run -t "canMoveToFoundation"`

There is no separate typecheck script; `tsc` runs implicitly via `next build` (`noEmit: true` in `tsconfig.json`).

## Architecture

This is a Klondike Solitaire game built with Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4.

The codebase is split into two layers with a strict one-way dependency: **game logic never imports from components.**

### Game logic (`src/game/`)

Pure, framework-free TypeScript. All functions are pure and return new state rather than mutating — `GameState` is treated as immutable throughout (`gameState.ts` has a `copyState` helper that deep-copies stock/tableau/waste/foundations before every mutation).

- `cards.ts` — `Card`, `Suit`, `Rank` types and rank/suit comparison helpers (`isOneRankHigher`, `isRedSuit`, etc.). `rankOrder` (A low, K high) is the source of truth for rank comparisons.
- `deck.ts` — builds a full 52-card `Deck` and pops cards off it.
- `seededRandom.ts` — a seeded PRNG (hash seed → mulberry32) so shuffles are deterministic and reproducible from a string seed.
- `shuffle.ts` — Fisher-Yates shuffle driven by the seeded random.
- `deal.ts` — `dealGame(seed)` builds the initial `GameState` (7 tableau columns, only the last card in each face up).
- `tableau.ts` — `Tableau = Card[][]` and tableau-placement rule (`canPlaceCardOnTableau`). Note: `gameState.ts` has its own overlapping `canMoveToTableauColumn` — check both when touching tableau placement rules.
- `gameState.ts` — the core state machine: `GameState = { stock, tableau, waste, foundations }`. All moves (`drawFromStock`, `moveCardFromWasteToFoundation`, `moveCardFromTableauToFoundation`, `moveCardFromTableauToTableau`, etc.) are pure functions `(GameState, ...) => GameState` that return the **same object reference** when a move is illegal/no-op, and a new object when a move succeeds. Callers rely on this reference equality to detect whether a move happened (see `GameBoard.tsx`). `autoMoveTableauCard`/`autoMoveWasteCard` try foundation placement first, then tableau placement.
- `debugGameState.ts` — builds a hand-crafted `GameState` that's one move from winning, useful for testing the win screen/end-of-game UI.

### Components (`src/components/`)

Presentational React components driven entirely by props from `GameBoard`, which is the single stateful component (`"use client"`):

- `GameBoard.tsx` owns `gameState`, an undo stack (`stateHistory`, push-before-mutate), and `selectedCard`. It composes `Stock`, `Waste`, `Foundations`, and `TableauColumn` (one per pile) and wires their click handlers to the `gameState.ts` move functions.
- Click-to-move UX: clicking a face-up tableau/waste card calls the relevant `autoMove*` function immediately (foundation first, then tableau) — there is no drag-and-drop and no separate "select then click destination" flow yet; `selectedCard` currently just drives the highlight ring.
- `Card.tsx` renders a single card; face-down cards show a pattern, face-up cards show rank text plus a suit image from `public/cards/{suit}.png` (one shared image per suit, not per-card art).
- `EmptySlot.tsx` renders the placeholder for an empty tableau column.

### Path alias

`@/*` maps to the repo root (`tsconfig.json`), e.g. `@/src/components/GameBoard` (used in `app/page.tsx`). Files within `src/` otherwise use relative imports (e.g. `../game/cards`).

## Testing conventions

Tests are colocated as `*.test.ts` next to the module they test (e.g. `src/game/shuffle.test.ts`), using vitest's `describe`/`it`/`expect`. Game logic is the primary tested surface; there are currently no component tests.
