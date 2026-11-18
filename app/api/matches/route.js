import { readDb } from "@/lib/db.mjs";
import { matchesFor } from "@/lib/matching.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = readDb();
    const matches = matchesFor(db);
    return Response.json(
      { matches, count: matches.length },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/matches failed", error);
    return Response.json(
      { error: { code: "INTERNAL", message: "Could not load matches." } },
      { status: 500 },
    );
  }
}
