"use client";

import Image from "next/image";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { PinIcon } from "./icons";

export const CardFace = forwardRef(function CardFace({ profile, priority = false }, ref) {
  return (
    <div
      ref={ref}
      className="relative flex h-full w-full select-none flex-col overflow-hidden rounded-[26px] border-2 border-ink bg-white shadow-hard"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-peach">
        <Image
          src={profile.photo}
          alt={`${profile.name}'s photo`}
          fill
          priority={priority}
          sizes="(max-width: 460px) 100vw, 430px"
          className="object-cover"
          draggable={false}
          unoptimized
        />
        <span className="absolute bottom-3 left-3 rounded-full border-2 border-ink bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] shadow-hard-sm">
          {profile.interests[0]}
        </span>
      </div>

      <div className="shrink-0 border-t-2 border-ink bg-white px-4 pb-4 pt-3">
        <div className="flex items-end justify-between gap-2">
          <h2 className="truncate font-display text-[27px] font-extrabold leading-none tracking-tight">
            {profile.name.split(" ")[0]}{" "}
            <span className="font-bold text-ink/45">{profile.age}</span>
          </h2>
          <span className="mb-0.5 shrink-0 rounded-full border-2 border-ink bg-yellow px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide">
            New
          </span>
        </div>

        <p className="mt-1.5 flex items-center gap-1 truncate text-[12px] font-medium text-ink/55">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {profile.city} · {profile.college}
          </span>
        </p>

        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink/75">
          {profile.bio}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {profile.interests.slice(1, 4).map((interest) => (
            <span
              key={interest}
              className="rounded-full border-2 border-ink/20 bg-cream px-2 py-0.5 text-[10.5px] font-semibold text-ink/70"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export function CardPreview({ profile, depth }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[26px] border-2 border-ink bg-white"
      style={{
        transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.04})`,
        opacity: depth === 1 ? 1 : 0.6,
        zIndex: 20 - depth,
      }}
      aria-hidden="true"
    >
      <Image
        src={profile.photo}
        alt=""
        fill
        sizes="(max-width: 460px) 100vw, 430px"
        className="object-cover"
        draggable={false}
        unoptimized
      />
      <div className="absolute inset-0 bg-cream/50" />
    </div>
  );
}

const SwipeCard = forwardRef(function SwipeCard({ profile, priority, onSwiped }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-280, 0, 280], [-13, 0, 13]);
  const likeOpacity = useTransform(x, [24, 130], [0, 1]);
  const passOpacity = useTransform(x, [-130, -24], [1, 0]);
  const committed = useRef(false);

  const commit = useCallback(
    (direction) => {
      if (committed.current) return;
      committed.current = true;
      animate(x, direction === "right" ? 680 : -680, {
        duration: 0.32,
        ease: [0.2, 0.7, 0.3, 1],
      }).then(() => onSwiped(direction));
    },
    [onSwiped, x],
  );

  useImperativeHandle(ref, () => ({ swipe: commit }), [commit]);

  const handleDragEnd = (_, info) => {
    const far = Math.abs(info.offset.x) > 110;
    const fast = Math.abs(info.velocity.x) > 700;

    if (far || fast) {
      const direction = (far ? info.offset.x : info.velocity.x) > 0 ? "right" : "left";
      commit(direction);
      return;
    }

    animate(x, 0, { type: "spring", stiffness: 380, damping: 30 });
  };

  return (
    <motion.div
      className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, touchAction: "none" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.995 }}
    >
      <CardFace profile={profile} priority={priority} />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-4 top-4 -rotate-12 rounded-xl border-[3px] border-ink bg-green px-3.5 py-1 font-display text-xl font-extrabold uppercase tracking-[0.16em] shadow-hard-sm"
      >
        Like
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-4 top-4 rotate-12 rounded-xl border-[3px] border-ink bg-pink px-3.5 py-1 font-display text-xl font-extrabold uppercase tracking-[0.16em] shadow-hard-sm"
      >
        Nope
      </motion.div>
    </motion.div>
  );
});

export default SwipeCard;
