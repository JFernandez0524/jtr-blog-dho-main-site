import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { ghlContact } from './functions/ghl-contact/resource.js';

defineBackend({
  auth,
  data,
  ghlContact,
});

