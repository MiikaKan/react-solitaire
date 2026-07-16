import { Card as CardType, getCardId } from "../game/cards";
import { Card } from "./Card";
import { EmptySlot } from "./EmptySlot";

type TableauColumnProps = {
  cards: CardType[];
  columnIndex: number;
  selectedCardIndex: number | null;
  onCardClick?: (card: CardType, index: number) => void;
  onEmptyTableauClick?: (index: number) => void;
};

export function TableauColumn({
  cards,
  columnIndex,
  selectedCardIndex,
  onCardClick,
  onEmptyTableauClick,
}: TableauColumnProps) {
  let content;

  if (cards.length > 0) {
    content = cards.map((card, index) => (
      <div
        key={getCardId(card)}
        className={index === 0 ? "relative" : "relative -mt-30"}
      >
        <Card
          card={card}
          selected={selectedCardIndex === index}
          onClick={
            card.faceUp ? () => onCardClick?.(card, columnIndex) : undefined
          }
        />
      </div>
    ));
  } else {
    content = <EmptySlot />;
  }

  return (
    <div
      onClick={
        cards.length === 0
          ? () => onEmptyTableauClick?.(columnIndex)
          : undefined
      }
    >
      {content}
    </div>
  );
}
