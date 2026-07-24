import { Card as CardType } from "../game/cards";
import { Card } from "./Card";

type StockProps = {
  cards: CardType[];
  onStockClicked?: () => void;
};

export function Stock({ cards, onStockClicked }: StockProps) {
  return (
    <div
      className="h-[var(--card-h)] w-[var(--card-w)] rounded-md overflow-hidden"
      onClick={() => onStockClicked?.()}
    >
      {cards.length > 0 ? <Card card={cards[cards.length - 1]}></Card> : ""}
    </div>
  );
}
