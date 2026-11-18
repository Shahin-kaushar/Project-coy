/**
 * Pure matching rules for the Discover tab.
 *
 * Everything here is side-effect free so it can be unit tested without a
 * server or a database. Persistence lives in lib/db.mjs.
 */

export const LIKE = "like";
export const PASS = "pass";
export const SWIPE_ACTIONS = [LIKE, PASS];

/**
 * Maps a card gesture to a swipe action. Kept here (and tested) so the UI and
 * the API can never disagree about which direction means "like".
 */
export function actionForDirection(direction) {
  if (direction === "right") return LIKE;
  if (direction === "left") return PASS;
  throw new Error(`Unknown swipe direction: ${direction}`);
}

export class SwipeError extends Error {
  constructor(code, status, message) {
    super(message);
    this.name = "SwipeError";
    this.code = code;
    this.status = status;
  }
}

/**
 * The only shape a profile may leave the server in. `likesYou` and internal
 * ordering metadata are deliberately dropped.
 */
export function publicProfile(profile) {
  if (!profile) return null;
  const { likesYou, order, ...safe } = profile;
  return safe;
}

export function unswipedProfiles(db) {
  const swiped = new Set(db.swipes.map((swipe) => swipe.profileId));
  return db.profiles
    .filter((profile) => profile.id !== db.me.id && !swiped.has(profile.id))
    .sort((a, b) => a.order - b.order);
}

export function feedFor(db, { limit = 20 } = {}) {
  return unswipedProfiles(db).slice(0, limit).map(publicProfile);
}

/**
 * Records a swipe and returns the next database state plus the outcome.
 * A match is created only when the user likes someone who had already liked
 * them. Passing never creates a match, and a profile can only be swiped once.
 */
export function recordSwipe(db, { profileId, action, now = new Date().toISOString() }) {
  if (!SWIPE_ACTIONS.includes(action)) {
    throw new SwipeError("INVALID_ACTION", 400, "Action must be either 'like' or 'pass'.");
  }

  const profile = db.profiles.find((candidate) => candidate.id === profileId);
  if (!profile) {
    throw new SwipeError("PROFILE_NOT_FOUND", 404, "That profile does not exist.");
  }
  if (profile.id === db.me.id) {
    throw new SwipeError("INVALID_PROFILE", 400, "You cannot swipe on yourself.");
  }
  if (db.swipes.some((swipe) => swipe.profileId === profileId)) {
    throw new SwipeError("ALREADY_SWIPED", 409, "You have already swiped on this profile.");
  }

  const swipe = { profileId, action, at: now };
  const matched = action === LIKE && Boolean(profile.likesYou);

  const match = matched
    ? {
        id: `match_${profileId}`,
        profileId,
        matchedAt: now,
      }
    : null;

  return {
    db: {
      ...db,
      swipes: [...db.swipes, swipe],
      matches: match ? [...db.matches, match] : db.matches,
    },
    matched,
    match: match
      ? {
          id: match.id,
          matchedAt: match.matchedAt,
          profile: publicProfile(profile),
        }
      : null,
  };
}

export function matchesFor(db) {
  const byId = new Map(db.profiles.map((profile) => [profile.id, profile]));

  return db.matches
    .map((match) => {
      const profile = byId.get(match.profileId);
      if (!profile) return null;
      return {
        id: match.id,
        matchedAt: match.matchedAt,
        profile: publicProfile(profile),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.matchedAt) - new Date(a.matchedAt));
}

export function feedStats(db) {
  return {
    remaining: unswipedProfiles(db).length,
    likesGiven: db.swipes.filter((swipe) => swipe.action === LIKE).length,
    matches: db.matches.length,
  };
}
