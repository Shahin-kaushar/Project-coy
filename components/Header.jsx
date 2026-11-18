"use client";

import Image from "next/image";

const LABELS = {
  home: "Home",
  discover: "Discover",
  matches: "Matches",
};

export default function Header({ tab = "discover" }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4">
      <div className="flex items-center gap-2.5">
        <span className="font-display text-[26px] font-extrabold leading-none tracking-tight">
          coy<span className="text-pink">.</span>
        </span>
        <span className="rounded-full border-2 border-ink bg-yellow px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em]">
          {LABELS[tab] ?? LABELS.discover}
        </span>
      </div>

      <div className="relative">
        <Image
          src="/avatars/me.svg"
          alt="Your profile"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border-2 border-ink bg-pink-soft object-cover"
          priority
          unoptimized
        />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink bg-green" />
      </div>
    </header>
  );
}
