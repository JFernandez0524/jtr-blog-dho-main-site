import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/utils/amplify-utils";

export async function middleware(request: NextRequest) {
  // Campaign mailer pages — strip chrome via header flag, skip auth
  if (request.nextUrl.pathname.startsWith("/mailer")) {
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
        return session.tokens !== undefined;
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
  matcher: ["/admin/:path*", "/mailer/:path*"],
};
