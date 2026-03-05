"use client";

import { Authenticator, ThemeProvider, Theme } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const theme: Theme = {
  name: "remax-theme",
  tokens: {
    colors: {
      brand: {
        primary: {
          10: "#E6EDF7",
          20: "#CCDAEF",
          40: "#99B5DF",
          60: "#6690CF",
          80: "#336BBF",
          90: "#0046AF",
          100: "#003DA5",
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: "#003DA5" },
          _hover: {
            backgroundColor: { value: "#002D7A" },
          },
        },
      },
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Authenticator>
        {({ signOut, user }) => (
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-remax-blue">Admin Panel</h1>
                  <p className="text-sm text-gray-600">Logged in as: {user?.signInDetails?.loginId}</p>
                </div>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-8">
              {children}
            </main>
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}
