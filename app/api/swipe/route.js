import { mutateDb } from "@/lib/db.mjs";
import { recordSwipe, SwipeError } from "@/lib/matching.mjs";
import { validateSwipeInput } from "@/lib/validation.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const badRequest = (code, message) =>
  Response.json({ error: { code, message } }, { status: 400 });

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return badRequest("INVALID_JSON", "Request body must be valid JSON.");
  }

  const validation = validateSwipeInput(payload);
  if (!validation.ok) {
    return badRequest(validation.code, validation.message);
  }

  try {
    const result = await mutateDb((db) => {
      const outcome = recordSwipe(db, validation.value);
      return { db: outcome.db, value: outcome };
    });

    return Response.json(
      {
        matched: result.matched,
        match: result.match,
        // The response deliberately contains no information about who has
        // liked the user unless this swipe created a mutual match.
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof SwipeError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }
    console.error("POST /api/swipe failed", error);
    return Response.json(
      { error: { code: "INTERNAL", message: "Could not record that swipe." } },
      { status: 500 },
    );
  }
}
