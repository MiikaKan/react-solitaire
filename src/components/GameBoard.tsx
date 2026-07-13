"use client";

import { useState } from "react";
import { Card as CardType } from "../game/cards";
import { dealGame } from "../game/deal";
import {
  autoMoveTableauCard,
  autoMoveWasteCard,
  drawFromStock,
  GameState,
  isGameWon,
} from "../game/gameState";
import { Foundations } from "./Foundations";
import { Stock } from "./Stock";
import { TableauColumn } from "./TableauColumn";
import { Waste } from "./Waste";

type CardSelection = {
  tableauColumnIndex: number | null;
  cardIndex: number;
};

export function GameBoard() {
  const [gameState, setGameState] = useState(() => dealGame("test-seed-123"));
  const [stateHistory, setStateHistory] = useState(() => [gameState]);
  const [selectedCard, setSelectedCard] = useState<CardSelection | null>(
    () => null,
  );

  const tableau = (
    <div className="flex flex-row space-x-2">
      {gameState.tableau.map((column, index) => (
        <TableauColumn
          key={`tableau-${index}`}
          cards={column}
          columnIndex={index}
          selectedCardIndex={
            selectedCard && selectedCard.tableauColumnIndex === index
              ? selectedCard.cardIndex
              : null
          }
          onCardClick={onTableauCardClicked}
        />
      ))}
    </div>
  );

  const gameWon = isGameWon(gameState);

  return (
    <div className="min-h-screen w-full space-y-5 p-6 max-w-220">
      <div className="flex flex-row items-start gap-5">
        <Stock cards={gameState.stock} onStockClicked={onStockClicked} />
        <Waste
          cards={gameState.waste}
          wasteSize={3}
          selectedCardIndex={
            selectedCard && selectedCard.tableauColumnIndex === null
              ? selectedCard.cardIndex
              : null
          }
          onWasteCardClicked={onWasteCardClicked}
        />
        <div className="ml-auto">
          <Foundations foundations={gameState.foundations} />
        </div>
      </div>
      {tableau}

      {stateHistory.length > 1 && (
        <div
          className="bg-blue-800 w-fit pt-1 pb-1 pl-3 pr-3 text-white rounded-md hover:bg-blue-500"
          onClick={onUndoClicked}
        >
          Undo
        </div>
      )}

      {gameWon && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-black/60">
          <div className="text-6xl font-bold text-white">You win!</div>
        </div>
      )}
    </div>
  );

  function onUndoClicked(): void {
    const history = [...stateHistory];
    const previousState = history.pop();

    if (previousState) {
      setGameState(previousState);
      setStateHistory(history);
    }
  }

  function onStockClicked(): void {
    const nextState = drawFromStock(gameState);

    if (nextState !== gameState) {
      addStateToHistory(gameState);
      setGameState(nextState);
    }
  }

  function onTableauCardClicked(card: CardType, columnIndex: number): void {
    if (gameState.tableau.length <= columnIndex || columnIndex < 0) return;

    const nextState = autoMoveTableauCard(gameState, card, columnIndex);

    const cardSelection: CardSelection = {
      tableauColumnIndex: columnIndex,
      cardIndex: gameState.tableau[columnIndex].indexOf(card),
    };

    if (cardSelection == selectedCard) {
      setSelectedCard(null);
    } else {
      setSelectedCard(cardSelection);
    }

    if (nextState !== gameState) {
      addStateToHistory(gameState);
      setGameState(nextState);
    }
  }

  function onWasteCardClicked(): void {
    const nextState = autoMoveWasteCard(gameState);

    const cardSelection: CardSelection = {
      tableauColumnIndex: null,
      cardIndex: gameState.waste.length - 1,
    };

    setSelectedCard(cardSelection);

    if (nextState !== gameState) {
      addStateToHistory(gameState);
      setGameState(nextState);
    }
  }

  function addStateToHistory(state: GameState) {
    setStateHistory((previousHistory) => [...previousHistory, state]);
  }
}
