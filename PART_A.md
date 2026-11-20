# Part A — Two features Coy should build

Based on the live flows (app entry, heads-up page, stop page, Terms, pricing) rather than a full
OTP session, which needs a real phone number.

## 1. Silent per-sender block

On the heads-up page, let the recipient block that sender. Future heads-ups from them are silently
dropped (including new accounts with the same verified contact), they are excluded from the
"several people added you" count, and the sender sees nothing.

**Why:** the only current control is stopping all Coy messages forever, which ends the product for
the recipient but does nothing to the sender. Coy forbids harassment but relies on after-the-fact
account removal. Without this, anonymity protects the sender, not the person being targeted.

**Privacy edges:** the block must be unobservable (no error, copy, or timing change); counts must
exclude blocked senders; responses must be identical for "blocked", "not a user", and "invalid
link"; key blocks by verified contact so a new account cannot bypass them.

## 2. One opener at the match moment

Before the WhatsApp/email handoff, both sides get one prompt or ≤120 characters, and one reply.
Expires in 7 days. No chat, no read receipts, no presence.

**Why:** the match is the payoff, then the shy user is pushed into an open-ended WhatsApp message —
where matches quietly die. A structured prompt is lower-pressure, produces a safer first message,
and keeps the "no chat" promise while making each paid slot pay off.

**Privacy edges:** only after a mutual match; server-enforced expiry; moderation for links, numbers,
and abuse; delete on block, report, or account deletion.

## Not proposing

Profiles/photos, open chat, or "see who liked you" — each one breaks the double-blind.

If I could ship only one, it would be the block: small, protective, and it makes everything else
safer to build.
