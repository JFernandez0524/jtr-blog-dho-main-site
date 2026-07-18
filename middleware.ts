import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/utils/amplify-utils";
import { isAllowedAdminEmail } from "@/lib/adminAllowlist";

export async function middleware(request: NextRequest) {
  // Campaign pages (mailer landings + booking confirmation) — strip chrome
  // via header flag, skip auth. /booking-confirmed renders inside the GHL
  // booking iframe after the calendar's post-booking redirect.
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/mailer") || pathname === "/booking-confirmed") {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-campaign-page", "1");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Admin pages — flag via header so the layout skips GTM/analytics
  // (keeps lead addresses out of GA4/Meta and self-traffic out of reports)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-page", "1");
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec, {});
        if (session.tokens === undefined) return false;
        // Single-operator site: a valid session isn't enough — the signed-in
        // email must be allowlisted (belt-and-suspenders over the preSignUp
        // trigger that blocks foreign sign-ups at the pool)
        return isAllowedAdminEmail(session.tokens.idToken?.payload?.email);
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });

  if (authenticated) {
    return response;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/mailer/:path*", "/booking-confirmed"],
};
