import { Card as CardType, getCardId, isRedSuit } from "../game/cards";
import Image from "next/image";

type CardProps = {
  card: CardType;
  onClick?: (card: CardType) => void;
  selected: boolean;
};

export function Card({ card, selected, onClick }: CardProps) {
  let content;

  if (card.faceUp) {
    content = (
      <div className="w-full h-full bg-white p-5 rounded-md border border-black/80">
        <div className="w-full h-full border border-black">
          <span
            className={
              isRedSuit(card)
                ? "text-red-600 font-bold"
                : "text-black font-bold"
            }
          >
            {card.rank}
          </span>
          <Image
            src={getCardImagePath(card)}
            alt={getCardId(card)}
            width={16}
            height={16}
          />
        </div>
      </div>
    );
  } else {
    content = (
      <div className="h-full w-full bg-blue-800 p-3 rounded-md border border-white/40">
        <div className="h-full w-full rounded-sm border border-white/40 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.18)_0_2px,transparent_2px_8px)]" />
      </div>
    );
  }

  return (
    <div
      className={`h-40 w-28 rounded-md overflow-hidden ${selected ? "ring-4 ring-yellow-200" : ""}`}
      onClick={() => onClick?.(card)}
    >
      {content}
    </div>
  );
}

function getCardImagePath(card: CardType): string {
  return `/cards/${card.suit.toLowerCase()}.png`;
}
