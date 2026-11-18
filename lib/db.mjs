import fs from "node:fs";
import path from "node:path";
import { seedDatabase } from "./seed.mjs";

/**
 * Tiny JSON-file store. Chosen over SQLite for the assignment because it has
 * zero native build steps, is easy to inspect, and persists across reloads.
 * Writes are serialised in-process and use an atomic rename so a crash cannot
 * leave a half-written file behind.
 */

let writeChain = Promise.resolve();

export function getDbPath() {
  return process.env.COY_DB_PATH || path.join(process.cwd(), "data", "db.json");
}

function writeAtomic(db) {
  const file = getDbPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

export function readDb() {
  let raw;
  try {
    raw = fs.readFileSync(/*turbopackIgnore: true*/ getDbPath(), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const db = seedDatabase();
    writeAtomic(db);
    return db;
  }

  try {
    return JSON.parse(raw);
  } catch {
    // A corrupt demo file should not break the app; start from a clean seed.
    const db = seedDatabase();
    writeAtomic(db);
    return db;
  }
}

/**
 * Applies a mutation while holding a single-writer lock. The mutator receives
 * a deep clone and must return `{ db, value }`; `value` is passed to the caller.
 */
export function mutateDb(mutator) {
  const run = writeChain.then(() => {
    const db = readDb();
    const result = mutator(structuredClone(db));
    if (!result || typeof result !== "object" || !result.db) {
      throw new Error("mutateDb mutator must return { db, value }.");
    }
    writeAtomic(result.db);
    return result.value;
  });

  // Keep the chain alive after a failed write so later requests still work.
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export function resetDb() {
  const db = seedDatabase();
  writeAtomic(db);
  return db;
}
