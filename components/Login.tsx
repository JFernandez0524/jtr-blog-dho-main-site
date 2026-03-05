"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginWithGoogle() {
  const router = useRouter();

  return (
    <Authenticator
      socialProviders={["google"]}
      hideSignUp={true}
      components={{
        SignIn: {
          Header() {
            return (
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-remax-blue">Admin Login</h1>
                <p className="text-sm text-gray-600 mt-2">Sign in with Google to continue</p>
              </div>
            );
          },
        },
      }}
    >
      {({ user }) => {
        useEffect(() => {
          if (user) {
            router.push("/admin/leads");
          }
        }, [user]);
        return null;
      }}
    </Authenticator>
  );
}
