import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { ghlContact } from './functions/ghl-contact/resource.js';

export const backend = defineBackend({
  auth,
  data,
  ghlContact,
});

// Pass environment variables to Lambda function
backend.ghlContact.addEnvironment("GHL_API_TOKEN", process.env.GHL_API_TOKEN || '');
backend.ghlContact.addEnvironment("GHL_LOCATION_ID", process.env.GHL_LOCATION_ID || '');

// Grant authenticated users permission to invoke the Lambda
backend.ghlContact.resources.lambda.grantInvoke(
  backend.auth.resources.authenticatedUserIamRole
);

