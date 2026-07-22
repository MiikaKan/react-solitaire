"use client";

import z from "zod";
import { GameState } from "./gameState";

type PersistedGame = z.infer<typeof PersistedGameSchema>;

const LOCAL_STORAGE_KEY: string = "currentGame";
const MAX_PERSISTED_STATE_HISTORY: number = 100;

export function saveGame(
  seed: string,
  gameState: GameState,
  stateHistory: GameState[],
  actionCount: number,
): void {
  try {
    const persistedGame: PersistedGame = {
      version: "1.0",
      seed: seed,
      currentState: gameState,
      stateHistory: stateHistory.slice(-MAX_PERSISTED_STATE_HISTORY),
      actionCount,
    };

    const persistedGameJSON = JSON.stringify(persistedGame);

    localStorage.setItem(LOCAL_STORAGE_KEY, persistedGameJSON);
  } catch (error) {
    console.error(error);
  }
}

export function loadGame(): PersistedGame | null {
  try {
    const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (localStorageItem !== null) {
      const parsed = PersistedGameSchema.safeParse(
        JSON.parse(localStorageItem),
      );

      if (!parsed.success) {
        console.error(parsed.error);
        return null;
      }

      return parsed.data;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

const SuitSchema = z.enum(["Hearts", "Diamonds", "Clubs", "Spades"]);
const RankSchema = z.enum([
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
]);

const CardSchema = z.object({
  suit: SuitSchema,
  rank: RankSchema,
  faceUp: z.boolean(),
});

const TableauSchema = z.array(z.array(CardSchema)); // Card[][]

// z.record with an enum key in zod v4 requires every enum key present —
// which matches your `Record<Suit, Card[]>` shape (all 4 suits always exist)
const FoundationsSchema = z.record(SuitSchema, z.array(CardSchema));

const GameStateSchema = z.object({
  stock: z.array(CardSchema),
  tableau: TableauSchema,
  waste: z.array(CardSchema),
  foundations: FoundationsSchema,
});

const PersistedGameSchema = z.object({
  seed: z.string(),
  version: z.literal("1.0"), // bump this literal when the shape changes
  currentState: GameStateSchema,
  stateHistory: z.array(GameStateSchema),
  actionCount: z.number(),
});
