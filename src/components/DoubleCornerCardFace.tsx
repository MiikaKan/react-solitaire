import { Card as CardType } from "../game/cards";
import { CardCorner } from "./CardCorner";

type DoubleCornerCardFaceProps = {
  card: CardType;
};

export function DoubleCornerCardFace({ card }: DoubleCornerCardFaceProps) {
  return (
    <div className="w-full h-full bg-white p-[8%] rounded-md border border-black/80">
      <div className="relative w-full h-full border border-black text-[calc(var(--card-w)*0.15)] leading-none">
        <div className="absolute top-[4%] left-[4%]">
          <CardCorner card={card} />
        </div>
        <div className="absolute bottom-[4%] right-[4%] rotate-180">
          <CardCorner card={card} />
        </div>
      </div>
    </div>
  );
}
