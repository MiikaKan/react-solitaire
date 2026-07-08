import {
  Card,
  isOneRankHigher,
  isOneRankLower,
  isRedSuit,
  isSameSuit,
  Suit,
} from "./cards";
import { drawCard } from "./deck";
import { Tableau } from "./tableau";

export type GameState = {
  stock: Card[];
  tableau: Tableau;
  waste: Card[];
  foundations: Record<Suit, Card[]>;
};

function copyState(state: GameState): GameState {
  return {
    stock: [...state.stock],
    tableau: state.tableau.map((column) => [...column]),
    waste: [...state.waste],

    foundations: {
      Hearts: [...state.foundations["Hearts"]],
      Diamonds: [...state.foundations["Diamonds"]],
      Clubs: [...state.foundations["Clubs"]],
      Spades: [...state.foundations["Spades"]],
    },
  };
}

export function drawFromStock(gameState: GameState): GameState {
  const newState = copyState(gameState);

  const card = drawCard(newState.stock);

  if (card) {
    return {
      ...newState,
      waste: [...newState.waste, { ...card, faceUp: true }],
    };
  }

  // If stock is empty, recycle waste back into stock
  return {
    ...newState,
    stock: [...newState.waste].reverse().map((wasteCard) => ({
      ...wasteCard,
      faceUp: false,
    })),
    waste: [],
  };
}

export function autoMoveTableauCard(
  gameState: GameState,
  card: Card,
  sourceColumnIndex: number,
): GameState {
  const foundationMove = moveCardFromTableauToFoundation(
    gameState,
    card,
    sourceColumnIndex,
  );

  if (foundationMove !== gameState) {
    return foundationMove;
  }

  return moveCardFromTableauToTableau(gameState, card, sourceColumnIndex);
}

export function autoMoveWasteCard(gameState: GameState): GameState {
  const foundationMove = moveCardFromWasteToFoundation(gameState);

  if (foundationMove !== gameState) return foundationMove;

  return moveCardFromWasteToTableau(gameState);
}

export function moveCardFromWasteToFoundation(gameState: GameState): GameState {
  if (gameState.waste.length === 0) return gameState;

  const newState = copyState(gameState);

  const lastWastedCard = newState.waste[newState.waste.length - 1];

  if (!lastWastedCard) return gameState;

  const foundation = newState.foundations[lastWastedCard.suit];

  if (!foundation) return gameState;

  if (!canMoveToFoundation(lastWastedCard, foundation)) return gameState;

  foundation.push(newState.waste.pop()!);

  return { ...newState };
}

export function moveCardFromWasteToTableau(gameState: GameState): GameState {
  if (gameState.waste.length === 0) return gameState;

  const newState = copyState(gameState);

  const topCard = newState.waste[newState.waste.length - 1];

  let targetColumn: Card[] | undefined = undefined;

  for (let i = 0; i < newState.tableau.length; i++) {
    const column = newState.tableau[i];

    if (canMoveToTableauColumn(topCard, column)) {
      targetColumn = column;
      break;
    }
  }

  if (!targetColumn) return gameState;

  targetColumn.push(newState.waste.pop()!);

  return {
    ...newState,
  };
}

export function moveCardFromTableauToFoundation(
  gameState: GameState,
  card: Card,
  tableauColumnIndex: number,
): GameState {
  const newState = copyState(gameState);

  const tableauColumn = newState.tableau[tableauColumnIndex];

  if (!tableauColumn) return gameState;

  const topCard = tableauColumn[tableauColumn.length - 1];

  if (card !== topCard) return gameState;

  const foundation = newState.foundations[card.suit];

  if (!foundation || !canMoveToFoundation(card, foundation)) return gameState;

  foundation.push(tableauColumn.pop()!);

  // flip the exposed card.
  const exposedCard = tableauColumn[tableauColumn.length - 1];

  if (exposedCard) {
    tableauColumn[tableauColumn.length - 1] = {
      ...exposedCard,
      faceUp: true,
    };
  }

  return {
    ...newState,
  };
}

export function moveCardFromTableauToTableau(
  gameState: GameState,
  card: Card,
  fromColumnIndex: number,
): GameState {
  const newState = copyState(gameState);

  const sourceColumn = newState.tableau[fromColumnIndex];

  if (!sourceColumn) return gameState;

  let targetColumn: Card[] | undefined = undefined;

  for (let i = 0; i < newState.tableau.length; i++) {
    if (i == fromColumnIndex) continue;

    const column = newState.tableau[i];

    if (canMoveToTableauColumn(card, column)) {
      targetColumn = column;
      break;
    }
  }

  if (!targetColumn) return gameState;

  const cardIndex = sourceColumn.indexOf(card);

  const cardsToMove: Card[] = sourceColumn.slice(cardIndex);

  for (const c of cardsToMove) {
    targetColumn.push(c);
    sourceColumn.splice(sourceColumn.indexOf(c), 1);
  }

  // flip the exposed card.
  const exposedCard = sourceColumn[sourceColumn.length - 1];

  if (exposedCard) {
    sourceColumn[sourceColumn.length - 1] = {
      ...exposedCard,
      faceUp: true,
    };
  }

  return { ...newState };
}

export function canMoveToFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) {
    return card.rank === "A"; // Only Ace can be placed on an empty foundation
  }

  const topCard = foundation[foundation.length - 1];

  return isSameSuit(card, topCard) && isOneRankHigher(card, topCard);
}

export function canMoveToTableauColumn(
  card: Card,
  tableauColumn: Card[],
): boolean {
  if (tableauColumn.length === 0) {
    return card.rank === "K"; // Only King can be placed on an empty tableau
  }

  const topCard = tableauColumn[tableauColumn.length - 1];

  return (
    isRedSuit(card) !== isRedSuit(topCard) && isOneRankLower(card, topCard)
  );
}
