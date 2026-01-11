import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const appName = 'firebase-admin-app';

// Use a global variable to store the app instance (prevents re-initialization in dev mode)
const globalForFirebase = globalThis as unknown as {
  firebaseAdminApp: App | undefined;
};

// Explicitly build the service account from environment variables
function getServiceAccount() {
  const projectId = process.env.SERVICE_ACCOUNT_PROJECT_ID;
  const clientEmail = process.env.SERVICE_ACCOUNT_CLIENT_EMAIL;
  // The private key needs to have its newlines properly escaped in the .env file
  const privateKey = process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase Admin env vars:', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    });
    throw new Error(
      'Firebase Admin service account environment variables are not set. Please check your .env file. Required: SERVICE_ACCOUNT_PROJECT_ID, SERVICE_ACCOUNT_CLIENT_EMAIL, SERVICE_ACCOUNT_PRIVATE_KEY'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

/**
 * Get or initialize the Firebase Admin app.
 * Uses a singleton pattern to prevent multiple initializations.
 */
function getOrInitializeApp(): App {
  // Return cached app if exists
  if (globalForFirebase.firebaseAdminApp) {
    return globalForFirebase.firebaseAdminApp;
  }

  // Check if already initialized via firebase-admin's internal registry
  const existingApps = getApps();
  const existingApp = existingApps.find((app) => app.name === appName);
  if (existingApp) {
    globalForFirebase.firebaseAdminApp = existingApp;
    return existingApp;
  }

  // Initialize new app
  const serviceAccount = getServiceAccount();
  const app = initializeApp(
    {
      credential: cert(serviceAccount),
    },
    appName
  );

  globalForFirebase.firebaseAdminApp = app;
  return app;
}

/**
 * Get the Firebase Admin app.
 * This is the main export that should be used by other modules.
 */
export async function getFirebaseAdminApp() {
  return getOrInitializeApp();
}

/**
 * Get Firebase Auth instance
 */
export function getAdminAuth() {
  const app = getOrInitializeApp();
  return getAuth(app);
}

/**
 * Get Firestore instance
 */
export function getAdminFirestore() {
  const app = getOrInitializeApp();
  return getFirestore(app);
}
