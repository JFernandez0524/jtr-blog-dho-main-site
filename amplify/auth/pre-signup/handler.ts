import type { PreSignUpTriggerHandler } from "aws-lambda";
import { isAllowedAdminEmail } from "../../../lib/adminAllowlist";

/**
 * Cognito preSignUp trigger — this site is single-operator. The public
 * Google OAuth login would otherwise let ANY Google account self-register
 * as an authenticated user (with read access to leads). Reject everyone
 * except the allowlisted owner. Fires for federated sign-ins too
 * (triggerSource "PreSignUp_ExternalProvider").
 */
export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes?.email;
  if (!isAllowedAdminEmail(email)) {
    throw new Error("Sign-up is not permitted for this application.");
  }
  return event;
};
