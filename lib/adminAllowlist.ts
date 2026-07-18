/**
 * The only Google account(s) allowed to sign in / access /admin.
 * Enforced in two layers:
 *  1. Cognito preSignUp trigger (amplify/auth/pre-signup) — blocks account
 *     creation for anyone else, so the user pool can only ever contain
 *     these identities.
 *  2. middleware.ts — checks the signed-in email on every /admin request.
 */
export const ALLOWED_ADMIN_EMAILS = ["njphonefix@gmail.com"];

export function isAllowedAdminEmail(email: unknown): boolean {
  return (
    typeof email === "string" &&
    ALLOWED_ADMIN_EMAILS.includes(email.trim().toLowerCase())
  );
}
