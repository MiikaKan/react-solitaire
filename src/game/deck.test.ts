import { describe, expect, it } from 'vitest';
import { createDeck } from './deck';

describe('createDeck', () => {
  it('creates 52 cards', () => {
    const deck = createDeck();

    expect(deck).toHaveLength(52);
  });

  it('creates unique cards', () => {
    const deck = createDeck();
    const ids = new Set(deck.map((card) => card.id));

    expect(ids.size).toBe(52);
  });

  it('all cards are face down', () => {
    const deck = createDeck(); 

    expect(deck.every((card) => !card.faceUp)).toBe(true);
  });
});