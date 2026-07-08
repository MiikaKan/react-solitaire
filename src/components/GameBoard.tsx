"use client";

import { useState } from "react";
import { Card as CardType } from "../game/cards";
import { createFoundationDebugGameState } from "../game/debugGameState";
import { dealGame } from "../game/deal";
import {
  autoMoveTableauCard,
  autoMoveWasteCard,
  drawFromStock,
  isGameWon,
} from "../game/gameState";
import { Foundations } from "./Foundations";
import { Stock } from "./Stock";
import { TableauColumn } from "./TableauColumn";
import { Waste } from "./Waste";

export function GameBoard() {
  const [gameState, setGameState] = useState(() =>
    createFoundationDebugGameState(),
  );

  const tableau = (
    <div className="flex flex-row space-x-2">
      {gameState.tableau.map((column, index) => (
        <TableauColumn
          key={`tableau-${index}`}
          cards={column}
          columnIndex={index}
          onCardClick={onTableauCardClicked}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full space-y-5 p-6 max-w-220">
      <div className="flex flex-row items-start gap-5">
        <Stock cards={gameState.stock} onStockClicked={onStockClicked} />
        <Waste
          cards={gameState.waste}
          wasteSize={3}
          onWasteCardClicked={onWasteCardClicked}
        />
        <div className="ml-auto">
          <Foundations foundations={gameState.foundations} />
        </div>
      </div>
      {tableau}
    </div>
  );

  function onStockClicked(): void {
    setGameState((state) => {
      const nextState = drawFromStock(state);

      if (isGameWon(nextState)) console.log("WIN!");

      return nextState;
    });
  }

  function onTableauCardClicked(card: CardType, columnIndex: number): void {
    if (gameState.tableau.length <= columnIndex || columnIndex < 0) return;

    setGameState((state) => {
      const nextState = autoMoveTableauCard(state, card, columnIndex);

      if (isGameWon(nextState)) console.log("WIN!");

      return nextState;
    });
  }

  function onWasteCardClicked(): void {
    setGameState((state) => {
      const nextState = autoMoveWasteCard(state);

      if (isGameWon(nextState)) console.log("WIN!");

      return nextState;
    });
  }
}
