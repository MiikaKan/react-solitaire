import { Card as CardType } from "../game/cards";
import { SingleCornerCardFace } from "./SingleCornerCardFace";
import { DoubleCornerCardFace } from "./DoubleCornerCardFace";

type CardProps = {
  card: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
  faceLayout?: "single" | "double";
};

export function Card({
  card,
  selected = false,
  onClick,
  faceLayout = "double",
}: CardProps) {
  let content;

  if (card.faceUp) {
    content =
      faceLayout === "double" ? (
        <DoubleCornerCardFace card={card} />
      ) : (
        <SingleCornerCardFace card={card} />
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
      className={`h-(--card-h) w-(--card-w) rounded-md overflow-hidden ${selected ? "ring-4 ring-yellow-200" : ""}`}
      onClick={() => onClick?.(card)}
    >
      {content}
    </div>
  );
}
