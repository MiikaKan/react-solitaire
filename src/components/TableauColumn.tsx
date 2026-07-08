import { Card as CardType, getCardId } from "../game/cards";
import { Card } from "./Card";

type TableauColumnProps = {
  cards: CardType[];
  columnIndex: number;
  onCardClick?: (card: CardType, index: number) => void;
};

export function TableauColumn({
  cards,
  columnIndex,
  onCardClick,
}: TableauColumnProps) {
  const cardComponents = cards.map((card, index) => (
    <div
      key={getCardId(card)}
      className={index === 0 ? "relative" : "relative -mt-30"}
    >
      <Card
        card={card}
        onClick={
          card.faceUp ? () => onCardClick?.(card, columnIndex) : undefined
        }
      />
    </div>
  ));

  return <div>{cardComponents}</div>;
}
