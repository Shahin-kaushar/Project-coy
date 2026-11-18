import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { feedFor } from "../lib/matching.mjs";
import { seedDatabase, seedProfiles } from "../lib/seed.mjs";

test("seed contains at least 30 complete profiles", () => {
  const db = seedDatabase();

  assert.ok(db.profiles.length >= 30, "expected at least 30 seeded profiles");
  for (const profile of db.profiles) {
    assert.ok(profile.id, "id missing");
    assert.ok(profile.name, `name missing for ${profile.id}`);
    assert.ok(Number.isInteger(profile.age) && profile.age >= 18, `bad age for ${profile.id}`);
    assert.ok(profile.bio, `bio missing for ${profile.id}`);
    assert.ok(profile.city, `city missing for ${profile.id}`);
    assert.ok(profile.college, `college missing for ${profile.id}`);
    assert.ok(profile.photo, `photo missing for ${profile.id}`);
    assert.ok(Array.isArray(profile.interests) && profile.interests.length > 0);
  }
});

test("seed ids and ordering are unique", () => {
  const profiles = seedProfiles();
  assert.equal(new Set(profiles.map((profile) => profile.id)).size, profiles.length);
  assert.equal(new Set(profiles.map((profile) => profile.order)).size, profiles.length);
});

test("enough seeded profiles have already liked the user for a demo", () => {
  const likers = seedProfiles().filter((profile) => profile.likesYou);
  assert.ok(likers.length >= 5, "need several pre-liked profiles so matches can happen");
});

test("the first feed page stays small while the whole deck remains", () => {
  const db = seedDatabase();
  assert.equal(feedFor(db).length, 20);
  assert.equal(feedFor(db, { limit: 100 }).length, 34);
});

test("every seeded avatar exists on disk", () => {
  for (const profile of seedProfiles()) {
    const file = path.join(process.cwd(), "public", profile.photo);
    assert.equal(fs.existsSync(file), true, `missing avatar: ${profile.photo}`);
  }
  assert.equal(fs.existsSync(path.join(process.cwd(), "public", "avatars", "me.svg")), true);
});
