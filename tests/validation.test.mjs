import test from "node:test";
import assert from "node:assert/strict";
import { validateSwipeInput } from "../lib/validation.mjs";

test("accepts a valid like and trims the profile id", () => {
  assert.deepEqual(validateSwipeInput({ profileId: " p02 ", action: "like" }), {
    ok: true,
    value: { profileId: "p02", action: "like" },
  });
});

test("rejects bodies that are not objects", () => {
  for (const body of [null, undefined, "p02", 42, ["p02", "like"]]) {
    const result = validateSwipeInput(body);
    assert.equal(result.ok, false);
    assert.equal(result.code, "INVALID_BODY");
  }
});

test("rejects missing or empty profile ids", () => {
  for (const profileId of [undefined, "", "   ", 12]) {
    const result = validateSwipeInput({ profileId, action: "like" });
    assert.equal(result.ok, false);
    assert.equal(result.code, "INVALID_PROFILE_ID");
  }
});

test("rejects actions other than like or pass", () => {
  for (const action of ["superlike", "LIKE", "", undefined]) {
    const result = validateSwipeInput({ profileId: "p01", action });
    assert.equal(result.ok, false);
    assert.equal(result.code, "INVALID_ACTION");
  }
});
