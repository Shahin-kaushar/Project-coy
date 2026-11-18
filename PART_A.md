# Part A — Two features Coy should build

Context used: the public product (getcoy.com) and the flows listed in the brief — phone OTP, adding
a crush, email verification, the invite link, and the extra-slots paywall. The OTP step needs a real
phone number, so I could not complete sign-up end to end; the proposals below are grounded in the
product's stated model rather than in guesses about its internals.

Coy's differentiator is unusual: **no profiles, no photos, no chat, no swiping.**
That constraint is the product. Both proposals are designed to strengthen it, not dilute it.

---

## 1. A private "not interested" control for the person receiving a heads-up

**What it is**

Today the receiver of an anonymous heads-up has two options: add the person back, or ignore the
message. Ignoring is passive, and the sender can keep adding them (up to their slot limit, across
numbers/emails). That is uncomfortable if the sender is an ex, a colleague, or someone who has
been told no before.

Give the receiver a quiet, non-identifying control on the heads-up screen:

- "Don't show me this again" — silently stops that sender from ever adding or nudging this person.
- Optionally: "Report this" — routes to trust & safety with the hashed contact, still without
  revealing the sender's identity to the receiver.
- The sender sees **nothing different**. No "blocked" message, no change in count. Their heads-up
  simply never lands, exactly as if the recipient were not on Coy.

**Why it is required**

- **Safety.** Anonymity is Coy's feature and also its abuse vector: anyone who knows your number
  can send you a heads-up. Without a receiver-side control, the only remedy is "stop all messages",
  which punishes the user for someone else's behaviour.
- **Trust and retention.** A single unsettling heads-up is enough to make someone delete the app.
  A silent block keeps them in the product without a confrontation.
- **It protects the core promise.** Coy promises "nobody ever finds out" — including, crucially,
  that a block is invisible. A block that leaks would violate the whole model.

**Privacy edge cases to get right**

- The block must be unobservable: no error, no changed copy, no timing difference, no "this person
  can't be added" message.
- Blocking must not be inferable from counts ("3 people added you" must exclude blocked senders,
  or the count itself becomes a side channel).
- Never confirm whether a given phone/email is on Coy — the same response for "not a user",
  "blocked", and "invalid".
- Store blocks as keyed hashes, not raw contact details; keep an audit trail for safety reviews but
  never expose it in-product.
- A block should apply to the pair, not the account, so creating a new account does not bypass it
  (rate-limit sign-ups by verified contact).

**Rough shape**

A `blocks(sender_hash, recipient_hash, created_at)` table checked in the heads-up fan-out path,
plus a report queue. The receiver-facing UI is a single tap on the heads-up link — no account setup
required, which is also the highest-converting safety surface.

---

## 2. A time-boxed "safe opener" after a mutual match

**What it is**

When two people match, Coy currently reveals how to reach each other and hands the conversation to
WhatsApp. That is respectful of privacy, but it creates a cliff: most matches die in the first
message, especially for people who are shy or who do not want to open with a cold text.

After a mutual match, offer a small, structured opener:

- A choice of 3 short prompts ("What made you add me?", "One song you'd send a stranger",
  "Coffee or a walk?") or a 100-character custom note.
- Each side can send **one** opener, only after the match is mutual.
- The opener expires in 7 days. No read receipts, no typing indicators, no free-form chat.
- The match still reveals contact details; the opener is a bridge, not a replacement.

**Why it is required**

- **The match moment is the product's highest-value moment**, and it currently ends at "here is a
  phone number". Reducing the cost of the first move directly increases the number of matches that
  become conversations — the metric that makes Coy worth paying for.
- **It is safer than an open chat.** A single, prompt-guided message avoids the harassment and
  pressure patterns that free-form DMs create, and expiry limits lingering contact.
- **It helps the "who adds whom" imbalance.** Women are disproportionately on the receiving end of
  anonymous attention; a low-pressure opener lets either side move first without a cold open.
- **It keeps the brand promise.** No profiles, no photos, no infinite chat — just one human sentence
  after a mutual signal.

**Privacy edge cases to get right**

- Openers must be impossible to send before a mutual match, and must never be shown to a
  non-match, even in aggregate.
- Content moderation on the 100-character note (links, phone numbers, abuse) so the feature does
  not become a vector for off-platform spam or harassment.
- No "seen" state and no typing indicator: presence signals are the beginning of a chat app, and
  the wrong kind of pressure.
- Expiry and deletion must be honoured everywhere (logs, backups, support tooling).
- If the match is later blocked/reported, the opener history disappears for both sides.

**Rough shape**

An `openers(match_id, sender_hash, prompt_id, body, expires_at)` table, one row per side, with a
7-day TTL enforced at read time. Moderation runs asynchronously on send; unread openers expire
silently.

---

## What I deliberately did **not** propose

- **Public profiles, photos, or open chat.** That is a different product and would erase Coy's only
  real moat.
- **A swipe feed as part of the core experience.** The assignment's Part B asks for one, and it is a
  useful exploration, but it works best as an explicitly opt-in, separate tab — not something that
  changes what Coy fundamentally promises. Mixing the two without a clear boundary would confuse
  the "double-blind" mental model.
- **Read receipts, online status, or "who viewed you".** Each one turns anonymity into a
  surveillance surface and contradicts the pitch.

If I had to ship exactly one thing first, it would be the **private block**: it is small, it
protects users who are already exposed to risk, and it makes the rest of the product safer to grow.
