import { describe, expect, it } from 'vitest';
import { canMoveToFoundation, drawFromStock } from './gameState';
import { dealGame } from './deal';
import { Card } from './cards';

describe('drawFromStock', () => {
    it('draws a card from stock to waste', () => {
        const seed = 'test-seed';
        const gameState = dealGame(seed);

        const initialStockLength = gameState.stock.length;
        const initialWasteLength = gameState.waste.length;

        let updatedGameState = drawFromStock(gameState);

        expect(updatedGameState.stock.length).toBe(initialStockLength - 1);
        expect(updatedGameState.waste.length).toBe(initialWasteLength + 1);
        expect(updatedGameState.waste[updatedGameState.waste.length - 1].faceUp).toBe(true);

        // Draw all remaining cards from stock
        const stockSize = updatedGameState.stock.length;

        for(let i = 0; i < stockSize; i++) {
            updatedGameState = drawFromStock(updatedGameState);
        }

        // Now stock should be empty, and waste should have all cards
        expect(updatedGameState.stock.length).toBe(0);
        expect(updatedGameState.waste.length).toBe(initialStockLength);

        // Draw from empty stock should reset stock from waste
        const finalGameState = drawFromStock(updatedGameState);
        expect(finalGameState.stock.length).toBe(initialStockLength);
        expect(finalGameState.waste.length).toBe(0);
    });

    it('does not mutate the original game state', () => {
        const gameState = dealGame('test-seed');
        const originalFirstStockCard = { ...gameState.stock[gameState.stock.length - 1] };

        const nextState = drawFromStock(gameState);

        expect(nextState).not.toBe(gameState);
        expect(nextState.stock).not.toBe(gameState.stock);
        expect(nextState.waste).not.toBe(gameState.waste);
        expect(gameState.stock[gameState.stock.length - 1]).toEqual(originalFirstStockCard);

        nextState.stock.forEach(card => expect(card.faceUp).toBe(false));
    });

    it('recycles waste back into stock face down', () => {
        let gameState = dealGame('test-seed');
        const initialStockLength = gameState.stock.length;

        for (let i = 0; i < initialStockLength; i++) {
            gameState = drawFromStock(gameState);
        }

        expect(gameState.stock).toHaveLength(0);
        expect(gameState.waste).toHaveLength(initialStockLength);
        expect(gameState.waste.every((card) => card.faceUp)).toBe(true);

        const recycledState = drawFromStock(gameState);

        expect(recycledState.stock).toHaveLength(initialStockLength);
        expect(recycledState.waste).toHaveLength(0);
        expect(recycledState.stock.every((card) => !card.faceUp)).toBe(true);
    });
});

describe('canMoveToFoundation', () => {
    it('allows moving an Ace to an empty foundation', () => {
        const aceOfHearts = { suit: 'Hearts', rank: 'A', faceUp: true, id: 'Hearts-A' } as Card;
        const foundation: Card[] = [];

        expect(canMoveToFoundation(aceOfHearts, foundation)).toBe(true);
    });

    it('does not allow moving a non-Ace to an empty foundation', () => {
        const twoOfHearts = { suit: 'Hearts', rank: '2', faceUp: true, id: 'Hearts-2' } as Card ;
        const foundation: Card[] = [];

        expect(canMoveToFoundation(twoOfHearts, foundation)).toBe(false);
    });

    it('allows moving a card of the same suit and one rank higher to a non-empty foundation', () => {
        const aceOfHearts = { suit: 'Hearts', rank: 'A', faceUp: true, id: 'Hearts-A' } as Card;
        const twoOfHearts = { suit: 'Hearts', rank: '2', faceUp: true, id: 'Hearts-2' } as Card;
        const foundation: Card[] = [aceOfHearts];

        expect(canMoveToFoundation(twoOfHearts, foundation)).toBe(true);
    });

    it('does not allow moving a card of a different suit to a non-empty foundation', () => {
        const aceOfHearts = { suit: 'Hearts', rank: 'A', faceUp: true, id: 'Hearts-A' } as Card;
        const twoOfDiamonds = { suit: 'Diamonds', rank: '2', faceUp: true, id: 'Diamonds-2' } as Card;
        const foundation: Card[] = [aceOfHearts];

        expect(canMoveToFoundation(twoOfDiamonds, foundation)).toBe(false);
    });

    it('does not allow moving a card of the same suit but not one rank higher to a non-empty foundation', () => {
        const aceOfHearts = { suit: 'Hearts', rank: 'A', faceUp: true, id: 'Hearts-A' } as Card;
        const threeOfHearts = { suit: 'Hearts', rank: '3', faceUp: true, id: 'Hearts-3' } as Card;
        const foundation: Card[] = [aceOfHearts];

        expect(canMoveToFoundation(threeOfHearts, foundation)).toBe(false);
    });
});