"use client";

import { FlameIcon, HeartOutlineIcon, HomeIcon } from "./icons";

const TABS = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "discover", label: "Discover", Icon: FlameIcon },
  { id: "matches", label: "Matches", Icon: HeartOutlineIcon },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="shrink-0 border-t border-white/10 bg-ink/70 px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[420px] items-center justify-around">
        {TABS.map(({ id, label, Icon }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={selected ? "page" : undefined}
              className={`group flex w-20 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[10px] font-medium tracking-wide transition ${
                selected ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              <span
                className={`grid h-9 w-14 place-items-center rounded-full transition ${
                  selected ? "bg-coy/15 text-coy" : "text-white/50 group-hover:bg-white/5"
                }`}
              >
                <Icon className="h-[21px] w-[21px]" />
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
