import { defineFunction } from "@aws-amplify/backend";

export const ghlContact = defineFunction({
  name: "ghl-contact",
  entry: "./handler.ts",
});
