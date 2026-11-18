import { resetDb } from "@/lib/db.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Demo-only helper so the deck can be replayed during a walkthrough.
 * A real product would never expose a global reset endpoint.
 */
export async function POST() {
  try {
    resetDb();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("POST /api/reset failed", error);
    return Response.json(
      { error: { code: "INTERNAL", message: "Could not reset the demo data." } },
      { status: 500 },
    );
  }
}
