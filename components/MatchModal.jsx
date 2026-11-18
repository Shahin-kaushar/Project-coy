"use client";

import Image from "next/image";
import { useEffect } from "react";
import { HeartIcon } from "./icons";

function Sparkle({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 5l10 33 33 12-33 12-10 33-10-33L7 50l33-12z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function MatchModal({ match, onClose, onViewMatches }) {
  useEffect(() => {
    if (!match) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [match, onClose]);

  if (!match) return null;

  const firstName = match.profile.name.split(" ")[0];

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-ink/50 px-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm -rotate-1 animate-pop-in overflow-hidden rounded-[28px] border-2 border-ink bg-pink p-6 text-center shadow-hard"
        onClick={(event) => event.stopPropagation()}
      >
        <Sparkle className="absolute right-4 top-4 h-8 w-8 rotate-12 text-ink/25" />
        <Sparkle className="absolute -left-2 bottom-24 h-10 w-10 -rotate-12 text-white/50" />

        <div className="relative mx-auto mb-5 h-24 w-44">
          <div className="absolute left-0 top-0 h-24 w-24 -rotate-6 overflow-hidden rounded-full border-2 border-ink bg-white shadow-hard-sm">
            <Image
              src={match.profile.photo}
              alt={match.profile.name}
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute right-0 top-0 h-24 w-24 rotate-6 overflow-hidden rounded-full border-2 border-ink bg-white shadow-hard-sm">
            <Image src="/avatars/me.svg" alt="You" fill sizes="96px" className="object-cover" unoptimized />
          </div>
          <span className="absolute -bottom-2 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-ink bg-white text-pink">
            <HeartIcon className="h-4 w-4" />
          </span>
        </div>

        <p className="inline-block rounded-full border-2 border-ink bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em]">
          It&apos;s a match
        </p>
        <h2
          id="match-title"
          className="mt-3 font-display text-[28px] font-extrabold leading-[1.05] tracking-tight"
        >
          You and {firstName} liked each other
        </h2>
        <p className="mt-2 text-[13px] font-medium leading-relaxed text-ink/70">
          Nothing was revealed until the like went both ways. That&apos;s the Coy promise.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button type="button" className="btn-green w-full" onClick={onViewMatches}>
            View matches
          </button>
          <button type="button" className="btn-ghost w-full" onClick={onClose}>
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  );
}
