import { Card, isOneRankHigher, isSameSuit, Suit } from "./cards";
import { drawCard } from "./deck";
import { Tableau } from "./tableau";

export type GameState = {
    stock: Card[];
    tableau: Tableau;
    waste: Card[];
    foundations: Record<Suit, Card[]>;
}

function copyState(state: GameState): GameState {
    return {
        stock: [...state.stock],
        tableau: state.tableau.map(column => [...column]),
        waste: [...state.waste],

        foundations: {
            'Hearts': [...state.foundations['Hearts']],
            'Diamonds': [...state.foundations['Diamonds']],
            'Clubs': [...state.foundations['Clubs']],
            'Spades': [...state.foundations['Spades']]
        }
    };
}

export function drawFromStock(gameState: GameState): GameState {

    const newState = copyState(gameState);

    const card = drawCard(newState.stock);

    if (card) {
        return {
            ...newState,
            waste: [...newState.waste, { ...card, faceUp: true }]
        }
    }

    // If stock is empty, recycle waste back into stock
    return {
        ...gameState,
        stock: newState.waste.reverse().map((wasteCard) => ({
            ...wasteCard,
            faceUp: false,
        })),
        waste: [],
    };
}

export function canMoveToFoundation(card: Card, foundation: Card[]): boolean {
    if (foundation.length === 0) {
        return card.rank === 'A'; // Only Ace can be placed on an empty foundation
    }

    const topCard = foundation[foundation.length - 1];

    return isSameSuit(card, topCard) && isOneRankHigher(card, topCard);
}