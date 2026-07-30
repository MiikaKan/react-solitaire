import { Card as CardType, getCardId } from "../game/cards";
import { Card } from "./Card";

type WasteProps = {
  cards: CardType[];
  wasteSize: number;
  selectedCardIndex: number | null;
  onWasteCardClicked?: () => void;
};

export function Waste({
  cards,
  wasteSize,
  selectedCardIndex,
  onWasteCardClicked,
}: WasteProps) {
  const visibleWaste = cards.slice(-wasteSize);

  const cardComponents = cards.slice(-wasteSize).map((card, index) => (
    <div
      key={getCardId(card)}
      className={
        index === 0 ? "relative" : "relative ml-[calc(var(--card-w)*-0.6)]"
      }
    >
      <Card
        card={card}
        selected={selectedCardIndex !== null && selectedCardIndex === index}
        onClick={
          index === visibleWaste.length - 1 ? onWasteCardClicked : undefined
        }
      />
    </div>
  ));

  return <div className="flex flex-row">{cardComponents}</div>;
}
