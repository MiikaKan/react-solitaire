export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type Rank =
  "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export function getCardId(card: Card) {
  return `${card.rank}-${card.suit}`;
}

export function isRedSuit(card: Card): boolean {
  return card.suit === "Hearts" || card.suit === "Diamonds";
}

export function isBlackSuit(card: Card): boolean {
  return card.suit === "Clubs" || card.suit === "Spades";
}

export function isSameSuit(card1: Card, card2: Card): boolean {
  return card1.suit === card2.suit;
}

export function isOneRankLower(card: Card, target: Card): boolean {
  return rankOrder.indexOf(card.rank) === rankOrder.indexOf(target.rank) - 1;
}

export function isOneRankHigher(card: Card, target: Card): boolean {
  return rankOrder.indexOf(card.rank) === rankOrder.indexOf(target.rank) + 1;
}

export const rankOrder: Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
