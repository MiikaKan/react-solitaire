import { Card as CardType, Suit } from "../game/cards";
import { Card } from "./Card";

type FoundationsProps = {
  foundations: Record<Suit, CardType[]>;
};

export function Foundations({ foundations }: FoundationsProps) {
  const cardArrays: CardType[][] = Object.values(foundations);

  return (
    <div className="flex flex-row space-x-1">
      {cardArrays.map((f, index) => (
        <Foundation key={index} foundation={f} />
      ))}
    </div>
  );
}

type FoundationProps = {
  foundation: CardType[];
};

function Foundation({ foundation }: FoundationProps) {
  let content;

  if (foundation.length > 0) {
    content = <Card card={foundation[foundation.length - 1]} />;
  }

  return (
    <div className="h-40 w-28 rounded-md border border-white"> {content}</div>
  );
}
