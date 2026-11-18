"use client";

import { FlameIcon, HeartOutlineIcon, HomeIcon } from "./icons";

const TABS = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "discover", label: "Discover", Icon: FlameIcon },
  { id: "matches", label: "Matches", Icon: HeartOutlineIcon },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="shrink-0 border-t-2 border-ink bg-cream px-3 pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-2">
      <div className="mx-auto flex max-w-[420px] items-center justify-around">
        {TABS.map(({ id, label, Icon }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={selected ? "page" : undefined}
              className="group flex w-24 flex-col items-center gap-1 py-0.5"
            >
              <span
                className={`grid h-9 w-14 place-items-center rounded-full border-2 transition-all ${
                  selected
                    ? "border-ink bg-pink text-ink shadow-hard-sm"
                    : "border-transparent text-ink/45 group-hover:bg-ink/5"
                }`}
              >
                <Icon className="h-[20px] w-[20px]" />
              </span>
              <span
                className={`text-[10px] font-bold tracking-wide ${
                  selected ? "text-ink" : "text-ink/40"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
