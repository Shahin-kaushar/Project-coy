"use client";

import { FlameIcon, HeartOutlineIcon } from "./icons";

export default function HomeTab({ onOpenDiscover, onOpenMatches }) {
  return (
    <section className="flex h-full flex-col items-center justify-center px-6 pb-10 text-center">
      <div className="relative mb-8">
        <div className="grid h-20 w-20 -rotate-3 place-items-center rounded-[22px] border-2 border-ink bg-white text-pink shadow-hard">
          <HeartOutlineIcon className="h-9 w-9" />
        </div>
        <span className="absolute -bottom-2 -right-3 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-yellow font-display text-[11px] font-extrabold">
          H
        </span>
      </div>

      <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
        Home stays blank.
      </h1>
      <p className="mt-3 max-w-[290px] text-[13px] leading-relaxed text-ink/55">
        This tab is intentionally a placeholder, as the assignment asked. The build focuses on a
        new Discover experience alongside Coy&apos;s existing app.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button type="button" className="btn-primary" onClick={onOpenDiscover}>
          <FlameIcon className="h-4 w-4" />
          Open Discover
        </button>
        <button type="button" className="btn-ghost" onClick={onOpenMatches}>
          View matches
        </button>
      </div>

      <p className="mt-9 max-w-[300px] text-[10.5px] font-semibold leading-relaxed text-ink/30">
        Single signed-in user · no external auth · built for the Coy SDE intern assignment.
      </p>
    </section>
  );
}
