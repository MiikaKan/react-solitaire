import { Card as CardType, getCardId } from "../game/cards";
import { Card } from "./Card";

type WasteProps = {
  cards: CardType[];
  wasteSize: number;
  onWasteCardClicked?: (card: CardType) => void;
};

export function Waste({ cards, wasteSize, onWasteCardClicked }: WasteProps) {
  const visibleWaste = cards.slice(-wasteSize);

  const cardComponents = cards.slice(-wasteSize).map((card, index) => (
    <div key={getCardId(card)} className={index === 0 ? "" : "-ml-20"}>
      <Card
        card={card}
        onClick={
          index === visibleWaste.length - 1 ? onWasteCardClicked : undefined
        }
      />
    </div>
  ));

  return <div className="flex flex-row">{cardComponents}</div>;
}
