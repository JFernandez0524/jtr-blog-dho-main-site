"use client";

import { createContext, useContext } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

type ExecuteRecaptcha = ((action?: string) => Promise<string>) | null;

const SafeRecaptchaContext = createContext<{ executeRecaptcha: ExecuteRecaptcha }>({
  executeRecaptcha: null,
});

export function useSafeReCaptcha() {
  return useContext(SafeRecaptchaContext);
}

function Bridge({ children }: { children: React.ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  return (
    <SafeRecaptchaContext.Provider value={{ executeRecaptcha: executeRecaptcha ?? null }}>
      {children}
    </SafeRecaptchaContext.Provider>
  );
}

export default function SafeRecaptchaProvider({
  children,
  siteKey,
}: {
  children: React.ReactNode;
  siteKey?: string;
}) {
  if (!siteKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <Bridge>{children}</Bridge>
    </GoogleReCaptchaProvider>
  );
}
