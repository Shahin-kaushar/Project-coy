"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SwipeCard, { CardPreview } from "./SwipeCard";
import MatchModal from "./MatchModal";
import { actionForDirection } from "@/lib/matching.mjs";
import { HeartIcon, SparkIcon, XIcon } from "./icons";

function DeckSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/10 bg-surface">
      <div className="skeleton h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16">
        <div className="skeleton h-6 w-40 rounded-full" />
        <div className="skeleton h-3 w-52 rounded-full" />
        <div className="skeleton h-3 w-44 rounded-full" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function DiscoverTab({ onViewMatches }) {
  const [profiles, setProfiles] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [match, setMatch] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const topCardRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeed() {
      try {
        const response = await fetch("/api/feed", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error?.message ?? "Could not load profiles.");
        if (cancelled) return;
        setProfiles(data.profiles);
        setStats(data.stats);
        setError("");
      } catch (loadError) {
        if (cancelled) return;
        setProfiles([]);
        setError(loadError.message);
      }
    }

    fetchFeed();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleSwiped = useCallback(async (direction, profile) => {
    setProfiles((previous) => (previous ?? []).filter((item) => item.id !== profile.id));
    setStats((previous) =>
      previous
        ? {
            ...previous,
            remaining: Math.max(previous.remaining - 1, 0),
            likesGiven: previous.likesGiven + (direction === "right" ? 1 : 0),
          }
        : previous,
    );

    try {
      const response = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          action: actionForDirection(direction),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message ?? "Could not save that swipe.");

      if (data.matched && data.match) {
        setMatch(data.match);
        setStats((previous) =>
          previous ? { ...previous, matches: previous.matches + 1 } : previous,
        );
      }

      // Refresh the server-side counters once the write has landed.
      setStats((previous) =>
        previous ? { ...previous, remaining: Math.max(previous.remaining, 0) } : previous,
      );
    } catch (swipeError) {
      setError(swipeError.message);
      setProfiles((previous) => [
        profile,
        ...(previous ?? []).filter((item) => item.id !== profile.id),
      ]);
      setStats((previous) =>
        previous
          ? {
              ...previous,
              remaining: previous.remaining + 1,
              likesGiven: Math.max(previous.likesGiven - (direction === "right" ? 1 : 0), 0),
            }
          : previous,
      );
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (match) return;
      if (event.key === "ArrowLeft") topCardRef.current?.swipe("left");
      if (event.key === "ArrowRight") topCardRef.current?.swipe("right");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [match]);

  const resetDemo = async () => {
    if (!window.confirm("Reset the demo? All swipes and matches will be cleared.")) return;
    setResetting(true);
    try {
      const response = await fetch("/api/reset", { method: "POST" });
      if (!response.ok) throw new Error("Could not reset the demo.");
      setMatch(null);
      setProfiles(null);
      setStats(null);
      setReloadKey((key) => key + 1);
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setResetting(false);
    }
  };

  const remaining = stats?.remaining ?? 0;
  const isEmpty = profiles !== null && profiles.length === 0;

  return (
    <section className="flex h-full flex-col px-4">
      <div className="flex items-center justify-between px-1 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
        <span>
          {stats
            ? `${remaining} ${remaining === 1 ? "person" : "people"} left`
            : "Loading deck"}
        </span>
        <span>{stats ? `${stats.matches} matches` : "—"}</span>
      </div>

      {error ? (
        <div className="mb-2 flex items-start justify-between gap-3 rounded-2xl border border-coy/30 bg-coy/10 px-3.5 py-2.5 text-[12px] text-coy-soft animate-rise">
          <span>{error}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            className="text-base leading-none text-coy-soft/70 hover:text-coy-soft"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        {profiles === null ? <DeckSkeleton /> : null}

        {isEmpty ? (
          <div className="flex h-full animate-fade-in flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-[22px] border border-white/10 bg-white/5 text-coy">
              <SparkIcon className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold">That&apos;s everyone for now</h2>
            <p className="mt-2 max-w-[270px] text-[13px] leading-relaxed text-white/50">
              You have seen every profile in this demo. Check your matches, or reset the deck to
              run the walkthrough again.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <button type="button" className="btn-primary" onClick={onViewMatches}>
                View matches
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={resetDemo}
                disabled={resetting}
              >
                {resetting ? "Resetting…" : "Reset demo"}
              </button>
            </div>
          </div>
        ) : null}

        {profiles && profiles.length > 0 ? (
          <>
            {profiles
              .slice(1, 3)
              .map((profile, index) => (
                <CardPreview key={profile.id} profile={profile} depth={index + 1} />
              ))}

            <SwipeCard
              key={profiles[0].id}
              ref={topCardRef}
              profile={profiles[0]}
              priority
              onSwiped={(direction) => handleSwiped(direction, profiles[0])}
            />
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-5 py-4">
        <button
          type="button"
          aria-label="Pass"
          disabled={isEmpty || profiles === null}
          onClick={() => topCardRef.current?.swipe("left")}
          className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 shadow-lg transition hover:border-white/20 hover:bg-white/10 active:scale-95 disabled:opacity-30"
        >
          <XIcon className="h-6 w-6" />
        </button>

        <button
          type="button"
          aria-label="Like"
          disabled={isEmpty || profiles === null}
          onClick={() => topCardRef.current?.swipe("right")}
          className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-coy to-coy-soft text-black shadow-[0_18px_36px_-14px_rgba(255,77,109,0.7)] transition hover:brightness-105 active:scale-95 disabled:opacity-30"
        >
          <HeartIcon className="h-6 w-6" />
        </button>
      </div>

      <p className="pb-1 text-center text-[10px] uppercase tracking-[0.16em] text-white/25">
        Swipe or use ← → keys
      </p>

      <MatchModal
        match={match}
        onClose={() => setMatch(null)}
        onViewMatches={() => {
          setMatch(null);
          onViewMatches();
        }}
      />
    </section>
  );
}
