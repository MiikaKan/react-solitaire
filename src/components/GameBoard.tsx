"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Card as CardType } from "../game/cards";
import { dealGame } from "../game/deal";
import {
  drawFromStock,
  GameState,
  isGameWon,
  moveCardFromTableauToFoundation,
  moveCardFromWasteToFoundation,
  moveSelectedCardToTableauColumn,
  WASTE_SIZE,
} from "../game/gameState";
import { Foundations } from "./Foundations";
import { Stock } from "./Stock";
import { TableauColumn } from "./TableauColumn";
import { Waste } from "./Waste";
import { loadGame, saveGame } from "../game/persistence";

type CardHighlight = {
  tableauColumnIndex: number | null;
  cardIndex: number;
};

export function GameBoard() {
  const seed = useRef("test-seed-1234");
  const checkedLocalStorage = useRef(false);

  const [gameState, setGameState] = useState(() => dealGame(seed.current));
  const [actionCount, setActionCount] = useState(() => 0);
  const [stateHistory, setStateHistory] = useState(() => [gameState]);
  const [selectedCard, setSelectedCard] = useState<CardHighlight | null>(
    () => null,
  );

  useEffect(() => {
    if (checkedLocalStorage.current)
      saveGame(seed.current, gameState, stateHistory, actionCount);
  }, [seed, gameState, stateHistory, actionCount]);

  useLayoutEffect(() => {
    if (checkedLocalStorage.current) return;

    const load = loadGame();

    if (load !== null) {
      seed.current = load.seed;
      setGameState(load.currentState);
      setStateHistory(load.stateHistory);
      setActionCount(load.actionCount);
      setSelectedCard(null);
    }

    checkedLocalStorage.current = true;
  });

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
          onEmptyTableauClick={onEmptyTableauClicked}
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
          wasteSize={WASTE_SIZE}
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

      <div className="flex flex-row gap-2">
        {stateHistory.length > 1 && (
          <div
            className="bg-blue-800 w-fit pt-1 pb-1 pl-3 pr-3 text-white rounded-md hover:bg-blue-500"
            onClick={onUndoClicked}
          >
            Undo
          </div>
        )}
        <div>{actionCount} action(s) performed.</div>
      </div>

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

      setActionCount(actionCount + 1);
    }
  }

  function onTableauCardClicked(card: CardType, columnIndex: number): void {
    if (gameState.tableau.length <= columnIndex || columnIndex < 0) return;

    const cardSelection: CardHighlight = {
      tableauColumnIndex: columnIndex,
      cardIndex: gameState.tableau[columnIndex].indexOf(card),
    };

    if (selectedCard && isSameCardHighlight(cardSelection, selectedCard)) {
      setSelectedCard(null);
      return;
    }

    if (selectedCard) {
      const selectedCardInstance = getSelectedCard();

      if (selectedCardInstance) {
        const nextState = moveSelectedCardToTableauColumn(
          gameState,
          selectedCardInstance,
          selectedCard.tableauColumnIndex,
          columnIndex,
        );

        setSelectedCard(null);

        if (nextState !== null && nextState !== gameState) {
          addStateToHistory(gameState);
          setGameState(nextState);

          setActionCount(actionCount + 1);
        }
      }
    } else {
      const foundationMoveState = moveCardFromTableauToFoundation(
        gameState,
        card,
        columnIndex,
      );

      if (foundationMoveState !== gameState) {
        setSelectedCard(null);
        addStateToHistory(gameState);
        setGameState(foundationMoveState);
        setActionCount(actionCount + 1);

        return;
      }

      const cardSelection: CardHighlight = {
        tableauColumnIndex: columnIndex,
        cardIndex: gameState.tableau[columnIndex].indexOf(card),
      };

      setSelectedCard(cardSelection);
    }
  }

  function onEmptyTableauClicked(columnIndex: number): void {
    if (selectedCard) {
      const selectedCardInstance = getSelectedCard();

      if (selectedCardInstance) {
        const nextState = moveSelectedCardToTableauColumn(
          gameState,
          selectedCardInstance,
          selectedCard.tableauColumnIndex,
          columnIndex,
        );

        setSelectedCard(null);

        if (nextState !== null && nextState !== gameState) {
          addStateToHistory(gameState);
          setGameState(nextState);
          setActionCount(actionCount + 1);
        }
      }
    }
  }

  function getSelectedCard(): CardType | null {
    if (!selectedCard) return null;

    if (selectedCard.tableauColumnIndex !== null) {
      return gameState.tableau[selectedCard.tableauColumnIndex][
        selectedCard.cardIndex
      ];
    }

    return gameState.waste[gameState.waste.length - 1];
  }

  function onWasteCardClicked(): void {
    const cardIndex =
      gameState.waste.length - 1 > WASTE_SIZE - 1
        ? WASTE_SIZE - 1
        : gameState.waste.length - 1;

    const cardSelection: CardHighlight = {
      tableauColumnIndex: null,
      cardIndex: cardIndex,
    };

    const foundationMoveState = moveCardFromWasteToFoundation(gameState);

    if (foundationMoveState !== gameState) {
      setSelectedCard(null);
      addStateToHistory(gameState);
      setGameState(foundationMoveState);
      setActionCount(actionCount + 1);

      return;
    }

    if (selectedCard && isSameCardHighlight(cardSelection, selectedCard)) {
      setSelectedCard(null);
    } else {
      setSelectedCard(cardSelection);
    }
  }

  function isSameCardHighlight(
    cardHighlightA: CardHighlight,
    cardHighlightB: CardHighlight,
  ): boolean {
    return (
      cardHighlightA.cardIndex === cardHighlightB.cardIndex &&
      cardHighlightA.tableauColumnIndex === cardHighlightB.tableauColumnIndex
    );
  }

  function addStateToHistory(state: GameState) {
    setStateHistory((previousHistory) => [...previousHistory, state]);
  }
}
