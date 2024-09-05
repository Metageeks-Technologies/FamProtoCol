import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID as string,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID as string,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string, // Replace escaped newlines
  client_email: process.env.GOOGLE_CLIENT_EMAIL as string,
  client_id: process.env.GOOGLE_AUTH_CLIENT_ID as string,
  auth_uri: process.env.GOOGLE_AUTH_URI as string,
  token_uri: process.env.GOOGLE_TOKEN_URI as string,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL as string,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL as string,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN as string,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Export the Auth instance
export const auth = admin.auth();
