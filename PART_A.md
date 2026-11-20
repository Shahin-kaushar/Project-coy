# Part A — Two features Coy should build

## What I looked at

I reviewed the live flows reachable without a phone: the app entry screen at `app.getcoy.com`, the
public heads-up landing page (`getcoy.com/n`), the stop-messages page (`getcoy.com/stop`), the
pricing and invite flow, the Terms, and the "How Coy works" write-up. I could not complete phone OTP
end to end because it needs a real number, so the proposals below are grounded in the product's
mechanics — 3 free slots, one anonymous heads-up per week up to 3 total, WhatsApp-first delivery
with SMS fallback, no messages 10pm–8am, 180-day deletion of unmatched entries, and a permanent
global "stop messages" link — rather than in guesses about the codebase.

Both proposals protect the thing that makes Coy different: **no profiles, no photos, no swiping,
no chat, and no way to work out who added you.** Neither one turns Coy into a dating app.

---

## 1. "Don't contact me about this person" — a silent, per-sender block

**What it is**

Today the only lever a recipient has is the link at the bottom of a heads-up: stop **all** Coy
messages, permanently. That is a nuclear option. If one person — an ex, a colleague, someone with
power over you at work or college — keeps adding you, your choices are to tolerate it or to give up
the product entirely.

Add a quiet block on the heads-up page itself, no account needed:

- "Don't contact me about this person again" silently drops every future heads-up from that sender,
  including from any new account they create with the same verified contact.
- It excludes that sender from the "several people added you" count, so the count itself cannot
  become a side channel.
- The sender sees **exactly what they see today**: nothing. No "blocked" state, no error, no change
  in timing, no change in the slot rules. Their slot stays used, exactly as if you had not joined.
- A separate "Report" action reaches trust & safety with the hashed contact; it is not required to
  block.

**Why it is required**

- **The current control punishes the wrong person.** "Stop all messages" ends Coy for the recipient
  but does nothing to stop the sender, who can keep adding them. The person being harassed loses the
  product; the person causing it loses nothing.
- **The rules already acknowledge the risk.** The Terms forbid adding someone "to harass, prank,
  embarrass or pressure them" and mention removing accounts — but that is reactive, after the
  damage, and the recipient has no in-product way to make it stop.
- **It is a trust feature, not a growth feature.** Coy's promise is that nothing is revealed without
  consent. A receiver who cannot stop an unwanted anonymous message learns the opposite lesson:
  anonymity protects the sender, not them.
- **It matters most in the launch market.** Campus and young-professional users are the stated
  audience, and they are the most likely to be on the receiving end of persistent attention from
  someone they already know.

**Privacy edge cases to get right**

- The block must be **unobservable**: no copy change, no error, no timing difference, and no
  "this person cannot be added" message. A silent drop fits Coy's existing model because delivery is
  never confirmed to the sender anyway.
- **Counts must exclude blocked senders.** The heads-up already varies with how many people added
  the same person; if blocked adds still contribute to the number, the count leaks the block.
- **Never confirm account existence.** The block page must return the same response for "not a Coy
  user", "already blocked", and "invalid link".
- **Blocks live on the pair, not the account.** Key them by verified contact hashes, apply them to
  both directions (a blocked person cannot later match with you through a new add), and rate-limit
  new accounts by contact so the block cannot be bypassed.
- **No retaliation surface.** The sender must never see a report or block, and the block must not
  alter the sender's slot balance, because a slot change is observable.
- Keep an internal audit trail for safety reviews, but never expose it in-product.

**Rough shape**

A `blocks(blocker_contact_hash, sender_contact_hash, created_at)` table checked in the heads-up
fan-out path and in the match computation, plus a report queue. The UI is one tap from the public
heads-up link, which is also the highest-intent safety surface Coy has.

---

## 2. One structured opener at the match moment

**What it is**

When two people match, Coy reveals the contact the other person used and hands the conversation to
WhatsApp or email. That is respectful of privacy, but it is also where the product's value ends: the
user who was too nervous to say something has now been asked to say something, to a person they
like, in an open-ended chat.

Give both sides **one** small, time-boxed opener on the match screen:

- Pick one of three short prompts ("What made you add me?", "One song you'd send a stranger",
  "Coffee or a walk?") or write up to ~120 characters.
- The other person can reply once, also with a prompt or a short note.
- The opener expires after 7 days; the WhatsApp/email handoff stays exactly as it is.
- No free-form chat, no read receipts, no typing indicators, no online status.

**Why it is required**

- **The match is the payoff, and it currently dead-ends.** The entire product exists to remove the
  risk of making the first move. At the moment that risk is removed, the user is pushed into the
  most exposed channel they own — a WhatsApp message to their crush. Many matches will simply go
  quiet there, and Coy will never know it lost them.
- **Structured beats open.** A prompt is lower-pressure than a blank text box, especially for the
  shy users Coy is designed for. It also produces a safer first message than a cold DM.
- **It preserves "no chat."** One opener is not a conversation surface; it is the digital equivalent
  of "say hi" that the current match screen already asks for, with the awkwardness removed. The
  product's positioning stays intact.
- **It compounds the paid value.** More matches turning into conversations makes each slot worth
  more, which is the only thing Coy sells.

**Privacy edge cases to get right**

- **Only after a mutual match.** Never sendable before, never visible to a non-match, and never
  summarized in a way that reveals who added whom.
- **No presence signals.** No read state, no typing indicator, no "last seen" — each one turns
  anonymity into surveillance and changes the product's feel.
- **Expiry is enforced server-side** and openers are deleted on block, report, account deletion, or
  expiry — everywhere, including backups and support tooling.
- **Moderate the custom note** for links, phone numbers, sexual content, and abuse, or the feature
  becomes a spam and off-platform contact vector.
- **Do not add engagement mechanics.** No streaks, no daily limits beyond one, no notifications
  designed to pull people back. The opener should end, not become a habit.
- **Localize the prompts** (Hinglish, campus context) — Coy launched on Indian campuses, and
  generic English prompts will feel like a different product.

**Rough shape**

`openers(match_id, sender_contact_hash, prompt_id, body, expires_at)`, one row per side, with a
7-day TTL checked at read time. Moderation runs asynchronously at send; unread openers expire
silently.

---

## What I deliberately did **not** propose

- **Profiles, photos, or open chat.** They would erase the only real moat Coy has.
- **"See who liked you", hints, or read receipts.** Each one converts the double-blind into a
  surveillance product; Coy's own pricing page explicitly refuses to sell them.
- **Campus leaderboards or smaller counts.** Coy already shows an aggregate count when several
  people add the same person; making that more granular would let people work out identity.
- **A swipe feed as the core experience.** The assignment's Part B asks for one, and it is a useful
  exploration, but it belongs in a clearly separate, opt-in tab — not in the product's main promise.

If I could ship only one of the two, it would be the **block**. It is small, it protects users who
are already exposed to risk, and it makes everything else Coy wants to build safer.
