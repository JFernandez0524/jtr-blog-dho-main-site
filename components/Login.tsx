"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";

function Login({ user }: { user?: AuthUser }) {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Use router.push for client-side navigation instead of redirect()
      router.push("/admin/leads");
    }
  }, [user, router]);

  return null;
}

export default withAuthenticator(Login, {
  socialProviders: ["google"],
  hideSignUp: true,
});