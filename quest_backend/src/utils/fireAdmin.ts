import * as admin from 'firebase-admin';
import serviceAccount from '../google-credentials.json';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Export the Auth instance
export const auth = admin.auth();
