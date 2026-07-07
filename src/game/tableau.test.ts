import { describe, expect, it } from 'vitest';
import { Card } from './cards';
import { canPlaceCardOnTableau, Tableau } from './tableau';

describe('Tableau', () => {
  it('should allow placing a King on an empty tableau column', () => {
    const tableau: Tableau = [[], [], []];
    const kingCard: Card = { suit: 'Hearts', rank: 'K', faceUp: true, id: 'H-K' };

    expect(canPlaceCardOnTableau(tableau, kingCard, 0)).toBe(true);

    // loop through all ranks except for King and check that they cannot be placed on an empty tableau column
    const ranks: Card['rank'][] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'A'];

    for (const rank of ranks) {
      const card: Card = { suit: 'Hearts', rank, faceUp: true, id: `H-${rank}` };
      expect(canPlaceCardOnTableau(tableau, card, 0)).toBe(false);
    }
  });

    it('should allow placing a card of opposite color and one rank lower on a non-empty tableau column', () => {
            const tableau: Tableau = [[], [], []];
            const topCard: Card = { suit: 'Hearts', rank: '7', faceUp: true, id: 'H-7' };
            tableau[0].push(topCard);

            const validCard: Card = { suit: 'Clubs', rank: '6', faceUp: true, id: 'C-6' };
            const invalidCardSameColor: Card = { suit: 'Diamonds', rank: '6', faceUp: true, id: 'D-6' };
            const invalidCardWrongRank: Card = { suit: 'Clubs', rank: '5', faceUp: true, id: 'C-5' };

            expect(canPlaceCardOnTableau(tableau, validCard, 0)).toBe(true);
            expect(canPlaceCardOnTableau(tableau, invalidCardSameColor, 0)).toBe(false);
            expect(canPlaceCardOnTableau(tableau, invalidCardWrongRank, 0)).toBe(false);

            const topCard2: Card = { suit: 'Spades', rank: 'J', faceUp: true, id: 'S-J' };
            tableau[1].push(topCard2);

            const validCard2: Card = { suit: 'Hearts', rank: '10', faceUp: true, id: 'H-10' };
            const invalidCardSameColor2: Card = { suit: 'Spades', rank: '10', faceUp: true, id: 'S-10' };
            const invalidCardWrongRank2: Card = { suit: 'Hearts', rank: 'Q', faceUp: true, id: 'H-9' };

            expect(canPlaceCardOnTableau(tableau, validCard2, 1)).toBe(true);
            expect(canPlaceCardOnTableau(tableau, invalidCardSameColor2, 1)).toBe(false);
            expect(canPlaceCardOnTableau(tableau, invalidCardWrongRank2, 1)).toBe(false);
    });
});