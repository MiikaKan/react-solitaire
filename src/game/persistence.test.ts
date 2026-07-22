import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadGame, saveGame } from "./persistence";
import { dealGame } from "./deal";
import { GameState } from "./gameState";

const LOCAL_STORAGE_KEY = "currentGame";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }
}

describe("persistence", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function buildState(): GameState {
    return dealGame("persistence-test-seed");
  }

  describe("saveGame", () => {
    it("writes a JSON blob under the expected key", () => {
      const gameState = buildState();

      saveGame("persistence-test-seed", gameState, [gameState], 3);

      const raw = storage.getItem(LOCAL_STORAGE_KEY);
      expect(raw).not.toBeNull();

      const parsed = JSON.parse(raw!);
      expect(parsed).toMatchObject({
        version: "1.0",
        seed: "persistence-test-seed",
        actionCount: 3,
      });
    });

    it("truncates stateHistory to the most recent 100 entries", () => {
      const gameState = buildState();
      const longHistory = Array.from({ length: 150 }, (_, i) => ({
        ...gameState,
        _index: i, // tag each entry so we can identify which ones survive truncation
      })) as unknown as GameState[];

      saveGame("persistence-test-seed", gameState, longHistory, 150);

      const raw = JSON.parse(storage.getItem(LOCAL_STORAGE_KEY)!);
      expect(raw.stateHistory).toHaveLength(100);
      expect(raw.stateHistory[0]._index).toBe(50);
      expect(raw.stateHistory[99]._index).toBe(149);
    });

    it("does not throw when localStorage.setItem throws", () => {
      vi.spyOn(storage, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const gameState = buildState();

      expect(() =>
        saveGame("persistence-test-seed", gameState, [gameState], 0),
      ).not.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("loadGame", () => {
    it("returns null when nothing is saved", () => {
      expect(loadGame()).toBeNull();
    });

    it("round-trips a game saved with saveGame", () => {
      const gameState = buildState();

      saveGame("persistence-test-seed", gameState, [gameState], 5);
      const loaded = loadGame();

      expect(loaded).not.toBeNull();
      expect(loaded!.seed).toBe("persistence-test-seed");
      expect(loaded!.actionCount).toBe(5);
      expect(loaded!.currentState).toEqual(gameState);
      expect(loaded!.stateHistory).toEqual([gameState]);
    });

    it("returns null when the stored value is not valid JSON", () => {
      storage.setItem(LOCAL_STORAGE_KEY, "{not json");

      expect(loadGame()).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("returns null when the stored value fails schema validation", () => {
      storage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ seed: "abc", version: "1.0" }), // missing currentState, stateHistory, actionCount
      );

      expect(loadGame()).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it("returns null when the saved version does not match", () => {
      const gameState = buildState();
      saveGame("persistence-test-seed", gameState, [gameState], 0);

      const raw = JSON.parse(storage.getItem(LOCAL_STORAGE_KEY)!);
      raw.version = "0.9";
      storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(raw));

      expect(loadGame()).toBeNull();
    });

    it("returns null when a card in the saved state has an invalid shape", () => {
      const gameState = buildState();
      saveGame("persistence-test-seed", gameState, [gameState], 0);

      const raw = JSON.parse(storage.getItem(LOCAL_STORAGE_KEY)!);
      raw.currentState.tableau[0][0] = { suit: "Joker", rank: "1", faceUp: true };
      storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(raw));

      expect(loadGame()).toBeNull();
    });

    it("does not throw when localStorage.getItem throws", () => {
      vi.spyOn(storage, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });

      expect(() => loadGame()).not.toThrow();
      expect(loadGame()).toBeNull();
    });
  });
});
