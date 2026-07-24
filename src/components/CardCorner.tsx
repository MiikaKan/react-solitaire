import { Card as CardType, getCardId, isRedSuit } from "../game/cards";
import Image from "next/image";

type CardCornerProps = {
  card: CardType;
};

export function CardCorner({ card }: CardCornerProps) {
  return (
    <div className="flex flex-row gap-1">
      <span
        className={
          isRedSuit(card) ? "text-red-600 font-bold" : "text-black font-bold "
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
  );
}

function getCardImagePath(card: CardType): string {
  return `/cards/${card.suit.toLowerCase()}.png`;
}
