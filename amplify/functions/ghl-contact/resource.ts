import { defineFunction } from "@aws-amplify/backend";

export const ghlContact = defineFunction({
  name: "ghl-contact",
  entry: "./handler.ts",
  environment: {
    GHL_API_TOKEN: process.env.GHL_API_TOKEN || "",
    GHL_LOCATION_ID: process.env.GHL_LOCATION_ID || "",
  },
});
