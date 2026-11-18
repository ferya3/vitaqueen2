import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Called by Laravel (App\Jobs\RevalidateFrontend) whenever public content changes.
 * Marks every "content"-tagged cache entry stale; the next visitor triggers a
 * background refresh (stale-while-revalidate).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET ?? "";
  const given = request.headers.get("x-revalidate-secret") ?? "";

  const ok = secret.length > 0 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === "string" && /^[a-z0-9:-]{1,64}$/.test(t)) : ["content"];

  for (const tag of tags.length ? tags : ["content"]) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: tags, at: Date.now() });
}
