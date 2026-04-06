import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  RateLimit: a
    .model({
      key: a.string().required(),
      count: a.integer().required(),
      expiresAt: a.integer().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Lead: a
    .model({
      name: a.string().required(),
      email: a.email().required(),
      phone: a.phone(),
      serviceType: a.enum(["REAL_ESTATE", "INHERITED_PROPERTY", "FORECLOSURE", "SELL_AS_IS"]),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Project: a
    .model({
      title: a.string().required(),
      description: a.string(),
      imageUrl: a.url(),
      projectUrl: a.url(),
      tags: a.string().array(),
      startDate: a.date(),
      endDate: a.date(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ContactSubmission: a
    .model({
      name: a.string().required(),
      email: a.email().required(),
      phone: a.string().required(),
      message: a.string(),
      serviceType: a.string(),
      formType: a.enum(["CONTACT", "VALUATION"]),
      source: a.string(),
      pageUrl: a.string(),
      referrer: a.string(),
      street: a.string(),
      city: a.string(),
      state: a.string(),
      zip: a.string(),
      zestimate: a.string(),
      submittedAt: a.datetime().required(),
      ghlSyncStatus: a.string(),
      ghlContactId: a.string(),
      ghlErrorMessage: a.string(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["create"]),
      allow.authenticated().to(["read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
