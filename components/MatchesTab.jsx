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
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
        >
          <div className="skeleton h-14 w-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-32 rounded-full" />
            <div className="skeleton h-3 w-44 rounded-full" />
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
      <div className="px-1 pb-4 pt-2">
        <h1 className="text-2xl font-semibold tracking-tight">Matches</h1>
        <p className="mt-1 text-[12.5px] text-white/45">
          Only people you both liked show up here.
        </p>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-3">
        {error ? (
          <div className="mb-3 rounded-2xl border border-coy/30 bg-coy/10 px-3.5 py-2.5 text-[12px] text-coy-soft">
            {error}
          </div>
        ) : null}

        {matches === null ? <MatchesSkeleton /> : null}

        {matches && matches.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 pb-16 text-center animate-fade-in">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-[22px] border border-white/10 bg-white/5 text-coy">
              <HeartIcon className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold">No matches yet</h2>
            <p className="mt-2 max-w-[260px] text-[13px] leading-relaxed text-white/50">
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
                className="flex animate-rise items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/15 hover:bg-white/[0.05]"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={match.profile.photo}
                    alt={match.profile.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 pb-0.5 text-center text-[8px] uppercase tracking-wider text-mint">
                    matched
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="truncate text-[15px] font-semibold">
                      {match.profile.name.split(" ")[0]}{" "}
                      <span className="font-normal text-white/50">{match.profile.age}</span>
                    </h3>
                    <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wider text-white/30">
                      {timeAgo(match.matchedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-white/45">
                    <PinIcon className="h-3 w-3 shrink-0" />
                    {match.profile.city} · {match.profile.college}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {match.profile.interests.slice(0, 2).map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/55"
                      >
                        {interest}
                      </span>
                    ))}
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
