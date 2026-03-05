"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";

function Login({ user }: { user?: AuthUser }) {
  useEffect(() => {
    if (user) {
      redirect("/admin/leads");
    }
  }, [user]);
  return null;
}

export default function LoginWithGoogle() {
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
      {({ user }) => <Login user={user} />}
    </Authenticator>
  );
}
