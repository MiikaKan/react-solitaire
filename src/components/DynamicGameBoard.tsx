"use client";

import dynamic from "next/dynamic";

export const DynamicGameBoard = dynamic(
  () => import("@/src/components/GameBoard").then((mod) => mod.GameBoard),
  { ssr: false },
);
