import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext, cookiesClient } from "@/utils/amplify-utils";
import { deleteGHLContact } from "@/lib/ghl";
import { isAllowedAdminEmail } from "@/lib/adminAllowlist";

/**
 * Admin lead cleanup: deletes a ContactSubmission from DynamoDB and,
 * optionally, the linked GHL contact. Used from /admin/leads for removing
 * test submissions and dead records without touching the CLI.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        if (session.tokens === undefined) return false;
        return isAllowedAdminEmail(session.tokens.idToken?.payload?.email);
      } catch {
        return false;
      }
    },
  });

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId, deleteGhlContact } = await request.json();
  if (!submissionId) {
    return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
  }

  const client = cookiesClient;
  const { data: submission } = await client.models.ContactSubmission.get({ id: submissionId });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  let ghlDeleted = false;
  if (deleteGhlContact && submission.ghlContactId) {
    ghlDeleted = await deleteGHLContact(submission.ghlContactId);
  }

  const { errors } = await client.models.ContactSubmission.delete({ id: submissionId });
  if (errors?.length) {
    console.error("Lead delete failed:", errors);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }

  return NextResponse.json({ success: true, ghlDeleted });
}
