"use client";

import { GameState } from "./gameState";

type PersistedGame = {
  seed: string;
  version: string;
  currentState: GameState;
  stateHistory: GameState[];
  actionCount: number;
};

const LOCAL_STORAGE_KEY: string = "currentGame";

export function saveGame(
  seed: string,
  gameState: GameState,
  stateHistory: GameState[],
  actionCount: number,
): void {
  const persistedGame: PersistedGame = {
    version: "1.0",
    seed: seed,
    currentState: gameState,
    stateHistory: stateHistory,
    actionCount,
  };

  const persistedGameJSON = JSON.stringify(persistedGame);

  localStorage.setItem(LOCAL_STORAGE_KEY, persistedGameJSON);
}

export function loadGame(): PersistedGame | null {
  try {
    const localStorageItem = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (localStorageItem !== null) {
      const persistedGame: PersistedGame = JSON.parse(localStorageItem);

      return persistedGame;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
