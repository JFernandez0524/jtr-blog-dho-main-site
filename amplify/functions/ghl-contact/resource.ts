import { defineFunction, secret } from "@aws-amplify/backend";

export const ghlContact = defineFunction({
  name: "ghl-contact",
  entry: "./handler.ts",
  environment: {
    GHL_API_TOKEN: secret('GHL_API_TOKEN'),
    GHL_LOCATION_ID: secret('GHL_LOCATION_ID'),
  },
});
