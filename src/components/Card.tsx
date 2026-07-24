import { Card as CardType, getCardId, isRedSuit } from "../game/cards";
import Image from "next/image";

type CardProps = {
  card: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
};

export function Card({ card, selected = false, onClick }: CardProps) {
  let content;

  if (card.faceUp) {
    content = (
      <div className="w-full h-full bg-white p-[8%] rounded-md border border-black/80">
        <div className="w-full h-full border border-black p-[4%] text-[calc(var(--card-w)*0.2)] leading-none">
          <div className="flex flex-row gap-1">
            <span
              className={
                isRedSuit(card)
                  ? "text-red-600 font-bold"
                  : "text-black font-bold "
              }
            >
              {card.rank}
            </span>
            <div className="relative w-[1em] h-[1em]">
              <Image
                src={getCardImagePath(card)}
                alt={getCardId(card)}
                loading="eager"
                className="object-contain"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="h-full w-full bg-blue-800 p-[6%] rounded-md border border-white/40">
        <div className="h-full w-full rounded-sm border border-white/40 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.18)_0_2px,transparent_2px_8px)]" />
      </div>
    );
  }

  return (
    <div
      className={`h-[var(--card-h)] w-[var(--card-w)] rounded-md overflow-hidden ${selected ? "ring-4 ring-yellow-200" : ""}`}
      onClick={() => onClick?.(card)}
    >
      {content}
    </div>
  );
}

function getCardImagePath(card: CardType): string {
  return `/cards/${card.suit.toLowerCase()}.png`;
}
