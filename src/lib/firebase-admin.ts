/* ═══════════════════════════════════════════════════════════════════
 * Firebase Admin SDK — Server-side initialization
 * ─────────────────────────────────────────────────────────────────
 * Used exclusively in API routes (server components / route handlers).
 * The service account credential is read from the FIREBASE_ADMIN_CREDENTIAL
 * env var, which should contain the base64-encoded JSON of the
 * Firebase service account key file.
 * ═══════════════════════════════════════════════════════════════════ */

import {
  initializeApp,
  getApps,
  cert,
  type ServiceAccount,
  type App,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  const credentialBase64 = process.env.FIREBASE_ADMIN_CREDENTIAL;
  const credentialPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
  const defaultLocalPath = path.join(process.cwd(), 'service-account.json');

  let serviceAccount: ServiceAccount | undefined;

  // 1. Try loading from base64 env var
  if (credentialBase64) {
    try {
      const decoded = Buffer.from(credentialBase64, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(decoded) as ServiceAccount;
    } catch {
      throw new Error(
        '[firebase-admin] Failed to parse FIREBASE_ADMIN_CREDENTIAL. ' +
        'Ensure it is valid base64-encoded JSON.'
      );
    }
  } 
  // 2. Try loading from custom path env var
  else if (credentialPath) {
    try {
      const resolvedPath = path.isAbsolute(credentialPath)
        ? credentialPath
        : path.join(process.cwd(), credentialPath);
      const fileContent = fs.readFileSync(resolvedPath, 'utf8');
      serviceAccount = JSON.parse(fileContent) as ServiceAccount;
    } catch (err) {
      throw new Error(
        `[firebase-admin] Failed to read service account key from path "${credentialPath}": ` +
        (err instanceof Error ? err.message : String(err))
      );
    }
  }
  // 3. Try loading from default local file service-account.json
  else if (fs.existsSync(defaultLocalPath)) {
    try {
      const fileContent = fs.readFileSync(defaultLocalPath, 'utf8');
      serviceAccount = JSON.parse(fileContent) as ServiceAccount;
    } catch (err) {
      throw new Error(
        `[firebase-admin] Found service-account.json but failed to parse: ` +
        (err instanceof Error ? err.message : String(err))
      );
    }
  }

  if (!serviceAccount) {
    throw new Error(
      '[firebase-admin] Missing Firebase Admin credentials.\n' +
      'Please configure one of the following for server-side operations:\n' +
      '1. Set the FIREBASE_ADMIN_CREDENTIAL env variable to the base64-encoded JSON of your service account key.\n' +
      '2. Set the FIREBASE_SERVICE_ACCOUNT_KEY_PATH env variable to the path of your service account JSON file.\n' +
      '3. Place your service account JSON file in the project root named "service-account.json".'
    );
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });

  return adminApp;
}

/**
 * Returns a cached Firestore Admin instance.
 * Safe to call from any server-side context.
 */
export function getAdminFirestore(): Firestore {
  if (adminDb) return adminDb;
  const app = getAdminApp();
  adminDb = getFirestore(app);
  return adminDb;
}
