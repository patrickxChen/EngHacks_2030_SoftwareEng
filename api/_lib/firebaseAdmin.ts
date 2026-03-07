import admin from "firebase-admin";

let initialized = false;

function initializeAdmin(): void {
  if (initialized) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!projectId || !serviceAccountJson) {
    throw new Error("Missing FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT_JSON env vars.");
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId
  });

  initialized = true;
}

export function getDb(): FirebaseFirestore.Firestore {
  initializeAdmin();
  return admin.firestore();
}

export async function verifyAuthToken(authHeader?: string): Promise<string | null> {
  if (process.env.ALLOW_UNAUTHENTICATED_LOCAL === "true") {
    return "local-dev-user";
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  initializeAdmin();
  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}
