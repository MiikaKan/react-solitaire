"use client";

import { useState } from "react";
import { Menu } from "@/src/components/Menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative bg-blue-800 h-16 text-2xl flex items-center">
      <button
        aria-label="Toggle menu"
        onClick={() => setIsMenuOpen((open) => !open)}
        className="absolute left-4 flex flex-col justify-center gap-1.5 w-8 h-8"
      >
        <span className="block h-0.5 w-full bg-white" />
        <span className="block h-0.5 w-full bg-white" />
        <span className="block h-0.5 w-full bg-white" />
      </button>
      <p className="text-center m-auto">
        <b>Solitario</b>
      </p>
      <Menu isOpen={isMenuOpen} closeMenu={closeMenu} />
    </div>
  );

  function closeMenu() {
    setIsMenuOpen(false);
  }
}
