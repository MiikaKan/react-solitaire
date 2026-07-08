"use client";

import { useState } from "react";
import { Card as CardType, getCardId } from "../game/cards";
import { dealGame } from "../game/deal";
import {
  autoMoveTableauCard,
  autoMoveWasteCard,
  canMoveToFoundation,
  drawFromStock,
  moveCardFromTableauToFoundation,
} from "../game/gameState";
import { Foundations } from "./Foundations";
import { Stock } from "./Stock";
import { TableauColumn } from "./TableauColumn";
import { Waste } from "./Waste";

export function GameBoard() {
  const [gameState, setGameState] = useState(() => dealGame("test-seed-6"));

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
    setGameState((state) => drawFromStock(state));
  }

  function onTableauCardClicked(card: CardType, columnIndex: number): void {
    if (gameState.tableau.length <= columnIndex || columnIndex < 0) return;

    setGameState((state) => autoMoveTableauCard(state, card, columnIndex));
  }

  function onWasteCardClicked(card: CardType): void {
    setGameState((state) => autoMoveWasteCard(state));
  }
}
