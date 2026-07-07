import { describe, expect, it } from 'vitest';
import { dealGame } from './deal';

describe('dealGame', () => {
    it('deals a game with correct tableau, waste, and foundations', () => {
        const seed = 'test-seed';
        const gameState = dealGame(seed);

        expect(gameState.tableau).toHaveLength(7);
        expect(gameState.stock).toHaveLength(24); // 52 - (1+2+3+4+5+6+7) = 24

        // Check that the tableau has the correct number of cards in each pile
        for (let i = 0; i < gameState.tableau.length; i++) {
            expect(gameState.tableau[i]).toHaveLength(i + 1);

            for(let j = 0; j < gameState.tableau[i].length; j++) {
                if (j === gameState.tableau[i].length - 1) {
                    expect(gameState.tableau[i][j].faceUp).toBe(true);
                } else {
                    expect(gameState.tableau[i][j].faceUp).toBe(false);
                }
            }
        }

        expect(gameState.waste).toHaveLength(0);

        expect(gameState.foundations.Hearts).toHaveLength(0);
        expect(gameState.foundations.Diamonds).toHaveLength(0);
        expect(gameState.foundations.Clubs).toHaveLength(0);
        expect(gameState.foundations.Spades).toHaveLength(0);
    });
});