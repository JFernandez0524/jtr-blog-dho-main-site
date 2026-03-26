import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { ghlContact } from './functions/ghl-contact/resource.js';

export const backend = defineBackend({
  auth,
  data,
  ghlContact,
});

// Pass GHL credentials to Lambda function
backend.ghlContact.addEnvironment("GHL_API_TOKEN", process.env.GHL_API_TOKEN || '');
backend.ghlContact.addEnvironment("GHL_LOCATION_ID", process.env.GHL_LOCATION_ID || '');

// Grant invoke to both authenticated and unauthenticated roles
// (Next.js server-side routes use the unauthenticated identity pool role)
backend.ghlContact.resources.lambda.grantInvoke(
  backend.auth.resources.authenticatedUserIamRole
);
backend.ghlContact.resources.lambda.grantInvoke(
  backend.auth.resources.unauthenticatedUserIamRole
);

// Expose the Lambda function name so it can be set as GHL_LAMBDA_FUNCTION_NAME in .env.local
backend.addOutput({
  custom: {
    ghlLambdaFunctionName: backend.ghlContact.resources.lambda.functionName,
  },
});
