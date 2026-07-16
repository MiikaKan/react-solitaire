import { describe, expect, it } from 'vitest';
import { canMoveToFoundation, drawFromStock, GameState, moveSelectedCardToTableauColumn } from './gameState';
import { dealGame } from './deal';
import { Card } from './cards';

function buildGameState(tableau: Card[][], waste: Card[] = []): GameState {
    return {
        stock: [],
        waste,
        tableau,
        foundations: { Hearts: [], Diamonds: [], Clubs: [], Spades: [] },
    };
}

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

describe('moveSelectedCardToTableauColumn', () => {
    it('moves a card from a non-zero tableau column onto a valid target column', () => {
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const redEight = { suit: 'Hearts', rank: '8', faceUp: true } as Card;

        const gameState = buildGameState([
            [],
            [blackSeven],
            [redEight],
        ]);

        const nextState = moveSelectedCardToTableauColumn(gameState, blackSeven, 1, 2);

        expect(nextState).not.toBe(gameState);
        expect(nextState.tableau[1]).toHaveLength(0);
        expect(nextState.tableau[2]).toEqual([redEight, blackSeven]);
    });

    it('moves a card from tableau column 0 onto a valid target column', () => {
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const redEight = { suit: 'Hearts', rank: '8', faceUp: true } as Card;

        const gameState = buildGameState([
            [blackSeven],
            [],
            [redEight],
        ]);

        const nextState = moveSelectedCardToTableauColumn(gameState, blackSeven, 0, 2);

        expect(nextState).not.toBe(gameState);
        expect(nextState.tableau[0]).toHaveLength(0);
        expect(nextState.tableau[2]).toEqual([redEight, blackSeven]);
    });

    it('moves a valid descending sequence of cards together', () => {
        const heartsEight = { suit: 'Hearts', rank: '8', faceUp: true } as Card;
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const redSix = { suit: 'Diamonds', rank: '6', faceUp: true } as Card;
        const diamondsEight = { suit: 'Diamonds', rank: '8', faceUp: true } as Card;

        const gameState = buildGameState([
            [heartsEight, blackSeven, redSix],
            [diamondsEight],
        ]);

        const nextState = moveSelectedCardToTableauColumn(gameState, blackSeven, 0, 1);

        expect(nextState.tableau[0]).toEqual([heartsEight]);
        expect(nextState.tableau[1]).toEqual([diamondsEight, blackSeven, redSix]);
    });

    it('flips the newly exposed card in the source column', () => {
        const faceDownSix = { suit: 'Diamonds', rank: '6', faceUp: false } as Card;
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const redEight = { suit: 'Hearts', rank: '8', faceUp: true } as Card;

        const gameState = buildGameState([
            [faceDownSix, blackSeven],
            [redEight],
        ]);

        const nextState = moveSelectedCardToTableauColumn(gameState, blackSeven, 0, 1);

        expect(nextState.tableau[0]).toEqual([{ ...faceDownSix, faceUp: true }]);
    });

    it('moves the top waste card onto a valid tableau column when fromColumnIndex is null', () => {
        const redEight = { suit: 'Hearts', rank: '8', faceUp: true } as Card;
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;

        const gameState = buildGameState([[redEight]], [blackSeven]);

        const nextState = moveSelectedCardToTableauColumn(gameState, blackSeven, null, 0);

        expect(nextState.waste).toHaveLength(0);
        expect(nextState.tableau[0]).toEqual([redEight, blackSeven]);
    });

    it('only allows a King onto an empty column', () => {
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const redKing = { suit: 'Hearts', rank: 'K', faceUp: true } as Card;

        const gameState = buildGameState([
            [blackSeven],
            [],
            [redKing],
        ]);

        const rejected = moveSelectedCardToTableauColumn(gameState, blackSeven, 0, 1);
        expect(rejected).toBe(gameState);

        const accepted = moveSelectedCardToTableauColumn(gameState, redKing, 2, 1);
        expect(accepted.tableau[1]).toEqual([redKing]);
        expect(accepted.tableau[2]).toHaveLength(0);
    });

    it('rejects a move onto a column with an incompatible top card', () => {
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const blackNine = { suit: 'Spades', rank: '9', faceUp: true } as Card;

        const gameState = buildGameState([
            [blackSeven],
            [blackNine],
        ]);

        const nextState = moveSelectedCardToTableauColumn(gameState, blackSeven, 0, 1);

        expect(nextState).toBe(gameState);
    });

    it('does not mutate the original game state', () => {
        const blackSeven = { suit: 'Clubs', rank: '7', faceUp: true } as Card;
        const redEight = { suit: 'Hearts', rank: '8', faceUp: true } as Card;

        const gameState = buildGameState([
            [],
            [blackSeven],
            [redEight],
        ]);

        moveSelectedCardToTableauColumn(gameState, blackSeven, 1, 2);

        expect(gameState.tableau[1]).toEqual([blackSeven]);
        expect(gameState.tableau[2]).toEqual([redEight]);
    });
});