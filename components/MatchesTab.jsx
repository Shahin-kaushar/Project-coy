"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format.mjs";
import { HeartIcon, PinIcon } from "./icons";

function MatchesSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-white p-3 shadow-hard-sm"
        >
          <div className="skeleton h-16 w-16 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-32 rounded-full" />
            <div className="skeleton h-3 w-44 rounded-full" />
            <div className="skeleton h-3 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MatchesTab({ onOpenDiscover }) {
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchMatches() {
      try {
        const response = await fetch("/api/matches", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error?.message ?? "Could not load matches.");
        if (cancelled) return;
        setMatches(data.matches);
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setMatches([]);
        setError(loadError.message);
      }
    }

    fetchMatches();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex h-full flex-col px-4">
      <div className="px-0.5 pb-4 pt-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Matches</h1>
        <p className="mt-1 text-[12.5px] font-medium text-ink/55">
          Only people you both liked show up here.
        </p>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-3">
        {error ? (
          <div className="mb-3 rounded-2xl border-2 border-ink bg-yellow px-3.5 py-2.5 text-[12px] font-semibold shadow-hard-sm">
            {error}
          </div>
        ) : null}

        {matches === null ? <MatchesSkeleton /> : null}

        {matches && matches.length === 0 ? (
          <div className="flex h-full animate-fade-in flex-col items-center justify-center rounded-[26px] border-2 border-ink bg-white px-6 pb-10 text-center shadow-hard">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border-2 border-ink bg-pink-soft text-pink shadow-hard-sm">
              <HeartIcon className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">No matches yet</h2>
            <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-ink/55">
              Like someone in Discover. If they already liked you, you&apos;ll match instantly —
              otherwise nobody ever knows.
            </p>
            <button type="button" className="btn-primary mt-6" onClick={onOpenDiscover}>
              Start swiping
            </button>
          </div>
        ) : null}

        {matches && matches.length > 0 ? (
          <ul className="space-y-3">
            {matches.map((match) => (
              <li
                key={match.id}
                className="flex animate-rise items-center gap-3 rounded-2xl border-2 border-ink bg-white p-3 shadow-hard-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-sky">
                  <Image
                    src={match.profile.photo}
                    alt={match.profile.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="truncate font-display text-[17px] font-extrabold tracking-tight">
                      {match.profile.name.split(" ")[0]}{" "}
                      <span className="font-bold text-ink/45">{match.profile.age}</span>
                    </h3>
                    <span className="ml-auto shrink-0 rounded-full border-2 border-ink bg-yellow px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
                      Matched
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 truncate text-[11.5px] font-medium text-ink/50">
                    <PinIcon className="h-3 w-3 shrink-0" />
                    {match.profile.city} · {match.profile.college}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">
                      {timeAgo(match.matchedAt)}
                    </span>
                    <span className="text-ink/20">·</span>
                    <span className="truncate text-[10.5px] font-semibold text-ink/50">
                      {match.profile.interests.slice(0, 2).join(" · ")}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
