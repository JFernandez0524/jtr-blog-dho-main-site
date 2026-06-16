"use client";

import { signInWithRedirect, getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn") {
        router.push("/admin/leads");
      }
      if (payload.event === "signInWithRedirect_failure") {
        setMessage("Sign-in failed. Please try again.");
      }
    });

    getCurrentUser()
      .then(() => router.push("/admin/leads"))
      .catch(() => {
        // If returning from Google OAuth, wait for Hub 'signedIn' event.
        // Otherwise kick off the OAuth flow.
        const isOAuthCallback = window.location.search.includes("code=");
        if (!isOAuthCallback) {
          signInWithRedirect({ provider: "Google" });
        }
      });

    return unsubscribe;
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="animate-spin h-8 w-8 border-4 border-remax-blue border-t-transparent rounded-full mx-auto" />
        <p className="text-remax-slate text-sm">{message}</p>
      </div>
    </div>
  );
}
