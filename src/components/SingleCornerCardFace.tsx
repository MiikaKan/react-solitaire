import { Card as CardType } from "../game/cards";
import { CardCorner } from "./CardCorner";

type SingleCornerCardFaceProps = {
  card: CardType;
};

export function SingleCornerCardFace({ card }: SingleCornerCardFaceProps) {
  return (
    <div className="w-full h-full bg-white p-[8%] rounded-md border border-black/80">
      <div className="w-full h-full border border-black p-[4%] text-[calc(var(--card-w)*0.15)] leading-none">
        <CardCorner card={card} />
      </div>
    </div>
  );
}
