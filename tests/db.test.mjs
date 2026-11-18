import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "coy-db-"));
process.env.COY_DB_PATH = path.join(tempDir, "db.json");

const { getDbPath, mutateDb, readDb, resetDb } = await import("../lib/db.mjs");
const { recordSwipe } = await import("../lib/matching.mjs");

test.after(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test("first read seeds the database file", () => {
  const db = readDb();

  assert.equal(fs.existsSync(getDbPath()), true);
  assert.equal(db.profiles.length, 34);
  assert.equal(db.swipes.length, 0);
  assert.equal(db.matches.length, 0);
});

test("swipes persist across reads", async () => {
  await mutateDb((db) => {
    const outcome = recordSwipe(db, { profileId: "p02", action: "like" });
    return { db: outcome.db, value: outcome };
  });

  // A fresh parse from disk simulates a page reload / new request.
  const reloaded = readDb();
  assert.equal(reloaded.swipes.length, 1);
  assert.equal(reloaded.swipes[0].profileId, "p02");
  assert.equal(reloaded.matches.length, 1);
});

test("concurrent mutations do not lose writes", async () => {
  resetDb();

  await Promise.all([
    mutateDb((db) => {
      const outcome = recordSwipe(db, { profileId: "p01", action: "pass" });
      return { db: outcome.db, value: outcome };
    }),
    mutateDb((db) => {
      const outcome = recordSwipe(db, { profileId: "p03", action: "pass" });
      return { db: outcome.db, value: outcome };
    }),
  ]);

  const reloaded = readDb();
  const ids = reloaded.swipes.map((swipe) => swipe.profileId).sort();
  assert.deepEqual(ids, ["p01", "p03"]);
});

test("reset restores the original seed", () => {
  const db = resetDb();

  assert.equal(db.swipes.length, 0);
  assert.equal(db.matches.length, 0);
  assert.equal(readDb().profiles.length, 34);
});
