"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-5">
      <div className="flex items-baseline gap-2">
        <span className="text-[22px] font-semibold tracking-tight">
          coy<span className="text-coy">.</span>
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/45">
          discover
        </span>
      </div>

      <div className="relative">
        <Image
          src="/avatars/me.svg"
          alt="Your profile"
          width={34}
          height={34}
          className="h-[34px] w-[34px] rounded-full border border-white/15 object-cover"
          priority
        />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-mint ring-2 ring-ink" />
      </div>
    </header>
  );
}
