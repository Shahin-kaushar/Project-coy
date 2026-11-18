"use client";

import Image from "next/image";
import { useEffect } from "react";
import { HeartIcon } from "./icons";

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
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/70 px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-pop-in rounded-[30px] border border-white/10 bg-surface/95 p-7 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative mx-auto mb-6 h-28 w-40">
          <div className="absolute left-0 top-0 h-28 w-24 -rotate-6 overflow-hidden rounded-2xl border border-white/15 shadow-lg">
            <Image
              src={match.profile.photo}
              alt={match.profile.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 top-0 h-28 w-24 rotate-6 overflow-hidden rounded-2xl border border-white/15 shadow-lg">
            <Image src="/avatars/me.svg" alt="You" fill sizes="96px" className="object-cover" />
          </div>
          <span className="absolute -bottom-3 left-1/2 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-gradient-to-br from-coy to-coy-soft text-[15px] text-black shadow-lg">
            <HeartIcon className="h-4 w-4" />
          </span>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-coy-soft">
          It&apos;s a match
        </p>
        <h2 id="match-title" className="mt-2 text-2xl font-semibold leading-snug">
          You and {firstName} liked each other
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-white/50">
          Nothing was revealed until the like went both ways. That&apos;s the Coy promise.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button type="button" className="btn-primary w-full" onClick={onViewMatches}>
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
