/* eslint-disable no-console */
import { GuardrailsClient } from '@guardrailz/sdk';

const client = new GuardrailsClient({
  baseUrl: 'https://guardrailz.vercel.app',
  apiKey: 'grd_....',
});

client
  .validate({
    text: 'Hello SDK test',
    profileName: 'default',
    validationType: 'input',
  })
  .then(console.log)
  .catch(console.error);
