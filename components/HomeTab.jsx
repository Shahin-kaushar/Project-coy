"use client";

import { FlameIcon, HeartOutlineIcon } from "./icons";

export default function HomeTab({ onOpenDiscover, onOpenMatches }) {
  return (
    <section className="flex h-full flex-col items-center justify-center px-8 pb-10 text-center">
      <div className="relative mb-7">
        <div className="grid h-20 w-20 place-items-center rounded-[26px] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] text-coy">
          <HeartOutlineIcon className="h-9 w-9" />
        </div>
        <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-surface-strong text-[11px] font-semibold text-white/40 ring-1 ring-white/10">
          H
        </span>
      </div>

      <h1 className="text-2xl font-semibold">Home stays blank</h1>
      <p className="mt-2.5 max-w-[280px] text-[13px] leading-relaxed text-white/50">
        This tab is intentionally a placeholder, as the assignment asked. The build focuses on a
        new Discover experience alongside Coy&apos;s existing app.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <button type="button" className="btn-primary" onClick={onOpenDiscover}>
          <FlameIcon className="h-4 w-4" />
          Open Discover
        </button>
        <button type="button" className="btn-ghost" onClick={onOpenMatches}>
          View matches
        </button>
      </div>

      <p className="mt-8 max-w-[300px] text-[10.5px] leading-relaxed text-white/25">
        Single signed-in user · no external auth · built for the Coy SDE intern assignment.
      </p>
    </section>
  );
}
