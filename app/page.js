"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HomeTab from "@/components/HomeTab";
import DiscoverTab from "@/components/DiscoverTab";
import MatchesTab from "@/components/MatchesTab";
import TabBar from "@/components/TabBar";

export default function Page() {
  const [tab, setTab] = useState("discover");

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[460px] flex-col overflow-hidden sm:border-x sm:border-white/5">
      <Header />

      <main className="relative min-h-0 flex-1">
        {tab === "home" ? (
          <HomeTab onOpenDiscover={() => setTab("discover")} onOpenMatches={() => setTab("matches")} />
        ) : null}
        {tab === "discover" ? (
          <DiscoverTab onViewMatches={() => setTab("matches")} />
        ) : null}
        {tab === "matches" ? <MatchesTab onOpenDiscover={() => setTab("discover")} /> : null}
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
