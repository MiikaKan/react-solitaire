import { Card, Suit } from "./cards";
import { createDeck, Deck, drawCard } from "./deck";
import { GameState } from "./gameState";
import { shuffle } from "./shuffle";
import { Tableau } from "./tableau";

export function dealGame(seed: string): GameState {
    const deck = createDeck() as Deck;
    const shuffledDeck = shuffle(deck, seed);

    const tableau: Tableau = [[], [], [], [], [], [], []];

    for (let i = 0; i < tableau.length; i++) {
        for (let j = 0; j <= i; j++) {

            const card = drawCard(shuffledDeck);

            if(card === undefined) break;

            // Only the top card in each tableau pile is face up
            tableau[i].push({...card, faceUp: j === i });
        }
    }

    const foundations: Record<Suit, Card[]> = {
        'Hearts': [],
        'Diamonds': [],
        'Clubs': [],
        'Spades': []
    };

    return {
        stock: shuffledDeck,
        tableau,
        waste: [],
        foundations
    }
}