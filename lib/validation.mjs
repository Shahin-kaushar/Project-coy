import { SWIPE_ACTIONS } from "./matching.mjs";

const fail = (code, message) => ({ ok: false, code, message });

export function validateSwipeInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return fail("INVALID_BODY", "Request body must be a JSON object.");
  }

  const { profileId, action } = input;

  if (typeof profileId !== "string" || profileId.trim() === "") {
    return fail("INVALID_PROFILE_ID", "`profileId` must be a non-empty string.");
  }
  if (!SWIPE_ACTIONS.includes(action)) {
    return fail("INVALID_ACTION", "`action` must be 'like' or 'pass'.");
  }

  return { ok: true, value: { profileId: profileId.trim(), action } };
}
