import { Card, Rank, Suit, rankOrder } from "./cards";
import { GameState } from "./gameState";

export function createFoundationDebugGameState(): GameState {
  const foundations = createAlmostCompleteFoundations();

  return {
    stock: [],
    waste: [
      card("K", "Spades"),
      card("K", "Clubs"),
    ],
    foundations,
    tableau: [
      [card("K", "Hearts")],
      [card("Q", "Diamonds"), card("J", "Clubs"), card("10", "Diamonds")],
      [card("6", "Spades"), card("5", "Hearts"), card("4", "Clubs")],
      [card("9", "Clubs")],
      [card("8", "Diamonds")],
      [card("7", "Spades")],
      [card("K", "Diamonds")],
    ],
  };
}

function createAlmostCompleteFoundations(): Record<Suit, Card[]> {
  return {
    Hearts: ranksThroughQueen().map((rank) => card(rank, "Hearts")),
    Diamonds: ranksThroughQueen().map((rank) => card(rank, "Diamonds")),
    Clubs: ranksThroughQueen().map((rank) => card(rank, "Clubs")),
    Spades: ranksThroughQueen().map((rank) => card(rank, "Spades")),
  };
}

function ranksThroughQueen(): Rank[] {
  return rankOrder.slice(0, rankOrder.indexOf("K"));
}

function card(rank: Rank, suit: Suit, faceUp = true): Card {
  return {
    rank,
    suit,
    faceUp,
  };
}
