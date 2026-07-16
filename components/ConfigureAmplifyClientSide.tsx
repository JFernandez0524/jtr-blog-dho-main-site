"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { captureAttribution } from "@/lib/attribution";

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  // Capture utm_*/gclid from the landing URL once per session (first touch)
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
