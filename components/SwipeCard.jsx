"use client";

import Image from "next/image";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { PinIcon } from "./icons";

export const CardFace = forwardRef(function CardFace({ profile, priority = false }, ref) {
  return (
    <div
      ref={ref}
      className="relative h-full w-full select-none overflow-hidden rounded-[30px] border border-white/10 bg-surface card-shadow"
    >
      <Image
        src={profile.photo}
        alt={`${profile.name}'s photo`}
        fill
        priority={priority}
        sizes="(max-width: 460px) 100vw, 430px"
        className="object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[27px] font-semibold leading-tight">
              {profile.name.split(" ")[0]}{" "}
              <span className="text-xl font-normal text-white/60">{profile.age}</span>
            </h2>
            <p className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] text-white/60">
              <PinIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {profile.city} · {profile.college}
              </span>
            </p>
          </div>
          <span className="mb-1 shrink-0 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-white/70 backdrop-blur">
            New
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/75">
          {profile.bio}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white/75 backdrop-blur"
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
      className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/10 bg-surface"
      style={{
        transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.045})`,
        opacity: depth === 1 ? 0.95 : 0.5,
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
      />
      <div className="absolute inset-0 bg-black/35" />
    </div>
  );
}

const SwipeCard = forwardRef(function SwipeCard({ profile, priority, onSwiped }, ref) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-280, 0, 280], [-14, 0, 14]);
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
        className="pointer-events-none absolute left-5 top-6 -rotate-12 rounded-xl border-[3px] border-mint px-3.5 py-1 text-xl font-extrabold uppercase tracking-[0.2em] text-mint"
      >
        Like
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-5 top-6 rotate-12 rounded-xl border-[3px] border-coy px-3.5 py-1 text-xl font-extrabold uppercase tracking-[0.2em] text-coy"
      >
        Nope
      </motion.div>
    </motion.div>
  );
});

export default SwipeCard;
