import test from "node:test";
import assert from "node:assert/strict";
import {
  actionForDirection,
  feedFor,
  matchesFor,
  publicProfile,
  recordSwipe,
  SwipeError,
  unswipedProfiles,
} from "../lib/matching.mjs";
import { seedDatabase } from "../lib/seed.mjs";

const LIKER = "p02"; // seeded as someone who already liked the user
const NON_LIKER = "p01";

const freshDb = () => seedDatabase();

const swipe = (db, profileId, action, now) =>
  recordSwipe(db, now ? { profileId, action, now } : { profileId, action });

test("feed never leaks who liked you", () => {
  const profiles = feedFor(freshDb());
  assert.ok(profiles.length > 0);
  for (const profile of profiles) {
    assert.equal("likesYou" in profile, false);
    assert.equal("order" in profile, false);
  }
});

test("feed excludes profiles that have already been swiped on", () => {
  const first = feedFor(freshDb())[0];
  const { db } = swipe(freshDb(), first.id, "pass");

  const ids = feedFor(db).map((profile) => profile.id);
  assert.equal(ids.includes(first.id), false);
  assert.equal(unswipedProfiles(db).length, 33);
});

test("liking someone who has not liked you does not create a match", () => {
  const { db, matched, match } = swipe(freshDb(), NON_LIKER, "like");

  assert.equal(matched, false);
  assert.equal(match, null);
  assert.equal(db.matches.length, 0);
  assert.equal(db.swipes.at(-1).action, "like");
});

test("liking someone who liked you creates a mutual match", () => {
  const { db, matched, match } = swipe(freshDb(), LIKER, "like");

  assert.equal(matched, true);
  assert.equal(db.matches.length, 1);
  assert.equal(match.profile.id, LIKER);
  assert.equal("likesYou" in match.profile, false);
  assert.ok(match.matchedAt);
});

test("passing on someone who liked you never creates a match", () => {
  const { db, matched } = swipe(freshDb(), LIKER, "pass");

  assert.equal(matched, false);
  assert.equal(db.matches.length, 0);
});

test("a profile cannot be swiped twice", () => {
  const { db } = swipe(freshDb(), NON_LIKER, "like");

  assert.throws(
    () => swipe(db, NON_LIKER, "like"),
    (error) => error instanceof SwipeError && error.code === "ALREADY_SWIPED" && error.status === 409,
  );
});

test("unknown profiles and invalid actions are rejected", () => {
  assert.throws(
    () => swipe(freshDb(), "does-not-exist", "like"),
    (error) => error.code === "PROFILE_NOT_FOUND" && error.status === 404,
  );
  assert.throws(
    () => swipe(freshDb(), NON_LIKER, "superlike"),
    (error) => error.code === "INVALID_ACTION" && error.status === 400,
  );
});

test("swiping through the whole deck empties the feed", () => {
  let db = freshDb();
  for (const profile of db.profiles) {
    db = swipe(db, profile.id, profile.id === LIKER ? "like" : "pass").db;
  }

  assert.equal(feedFor(db).length, 0);
  assert.equal(db.swipes.length, 34);
  assert.equal(db.matches.length, 1);
});

test("matches are newest first and never expose the like flag", () => {
  const first = swipe(freshDb(), LIKER, "like", "2026-01-01T10:00:00.000Z");
  const second = recordSwipe(first.db, { profileId: "p05", action: "like", now: "2026-01-02T10:00:00.000Z" });

  const matches = matchesFor(second.db);
  assert.equal(matches.length, 2);
  assert.equal(matches[0].profile.id, "p05");
  assert.equal(matches[1].profile.id, LIKER);
  for (const match of matches) {
    assert.equal("likesYou" in match.profile, false);
  }
});

test("swipe direction maps to the right action", () => {
  assert.equal(actionForDirection("right"), "like");
  assert.equal(actionForDirection("left"), "pass");
  assert.throws(() => actionForDirection("up"));
});

test("publicProfile strips only server-side fields", () => {
  const profile = freshDb().profiles[0];
  const safe = publicProfile(profile);

  assert.equal(safe.id, profile.id);
  assert.equal(safe.name, profile.name);
  assert.equal("likesYou" in safe, false);
  assert.equal("order" in safe, false);
});
