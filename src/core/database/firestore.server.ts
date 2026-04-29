import * as admin from "firebase-admin";
import { env } from "@/core/config/env";

const projectId =
  env.FIRESTORE_PROJECT_ID || env.GOOGLE_CLOUD_PROJECT || env.GOOGLE_CLOUD_PROJECT_ID;

if (!admin.apps.length && projectId) {
  try {
    const appOptions: admin.AppOptions = { projectId };
    if (env.GOOGLE_APPLICATION_CREDENTIALS) {
      appOptions.credential = admin.credential.applicationDefault();
    }
    admin.initializeApp(appOptions);
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization error", error);
  }
}

let dbInstance: admin.firestore.Firestore | null = null;
if (admin.apps.length) {
  try {
    const firestore = admin.firestore();
    if (env.FIRESTORE_DATABASE_ID) {
      firestore.settings({ databaseId: env.FIRESTORE_DATABASE_ID });
    }
    dbInstance = firestore;
  } catch {
    console.error("Firestore init skipped");
  }
}

const db = dbInstance;
const isFirestoreAvailable = db !== null;

export { db, admin, isFirestoreAvailable };
