import { tagGHLContact } from "@/lib/ghl";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.event_type !== "scans.scan_update") {
    return Response.json({ ok: true });
  }

  const secret = process.env.POSTCARD_WEBHOOK_SECRET;
  if (secret) {
    const incoming = request.headers.get("x-webhook-secret") ?? "";
    if (incoming !== secret) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const data = body.data as Record<string, string> | undefined;
  const ghlContactId = data?.["recipient.custom_1"];

  if (!ghlContactId) {
    return Response.json({ ok: true, skipped: "no contact id" });
  }

  console.log(`[postcard-scan] Tagging GHL contact ${ghlContactId} with mail:scanned`);
  await tagGHLContact(ghlContactId, ["mail:scanned"]);
  console.log(`[postcard-scan] Done`);
  return Response.json({ ok: true });
}
