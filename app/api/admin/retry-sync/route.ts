import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext, cookiesClient } from "@/utils/amplify-utils";
import { syncToGHL } from "@/lib/ghl";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId } = await request.json();
  if (!submissionId) {
    return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
  }

  const client = cookiesClient;
  const { data: submission } = await client.models.ContactSubmission.get({ id: submissionId });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const ghlResult = await syncToGHL({
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    formType: (submission.formType as "CONTACT" | "VALUATION") ?? "CONTACT",
    message: submission.message ?? undefined,
    serviceType: submission.serviceType ?? undefined,
    source: submission.source ?? undefined,
    referrer: submission.referrer ?? undefined,
    street: submission.street ?? undefined,
    city: submission.city ?? undefined,
    state: submission.state ?? undefined,
    zip: submission.zip ?? undefined,
    zestimate: submission.zestimate ?? undefined,
    submissionId,
  });

  await client.models.ContactSubmission.update({
    id: submissionId,
    ghlSyncStatus: ghlResult.success ? "SYNCED" : "FAILED",
    ghlContactId: ghlResult.contactId,
    ghlErrorMessage: ghlResult.error,
  });

  return NextResponse.json({ success: true, ghlSynced: ghlResult.success });
}
