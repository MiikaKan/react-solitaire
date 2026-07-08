import { Card, Suit, rankOrder } from "./cards";

export type Deck = Card[];

export function createDeck(): Deck {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"] as Suit[];

  const deck: Deck = [];

  for (const suit of suits) {
    for (const rank of rankOrder) {
      deck.push({ suit, rank, faceUp: false });
    }
  }

  return deck;
}

export function drawCard(cards: Card[]): Card | undefined {
  return cards.pop();
}
