import  {Card, Suit, Rank} from './cards';

export type Deck = Card[];

export function createDeck(): Deck {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'] as Suit[];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as Rank[];

    const deck: Deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ id: `${rank}-${suit}`, suit, rank, faceUp: false });
        }
    }
    
    return deck;
}

export function drawCard(cards: Card[]): Card | undefined {
    return cards.pop();
}
