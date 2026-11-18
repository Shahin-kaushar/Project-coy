import { readDb } from "@/lib/db.mjs";
import { feedFor, feedStats } from "@/lib/matching.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = readDb();
    return Response.json(
      { profiles: feedFor(db), stats: feedStats(db) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/feed failed", error);
    return Response.json(
      { error: { code: "INTERNAL", message: "Could not load profiles." } },
      { status: 500 },
    );
  }
}
