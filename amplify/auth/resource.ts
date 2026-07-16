import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        // Without the email scope Google never returns the user's email,
        // Cognito can't populate its required email attribute, and every
        // sign-in fails at /oauth2/idpresponse (bounces back to /login)
        scopes: ['openid', 'email', 'profile'],
      },
      callbackUrls: [
        'http://localhost:3000/login',
        'https://www.josetherealtor.com/login',
        'https://josetherealtor.com/login',
      ],
      logoutUrls: [
        'http://localhost:3000/',
        'https://josetherealtor.com/',
        'https://www.josetherealtor.com/', 
      ],
    },
  },
});
