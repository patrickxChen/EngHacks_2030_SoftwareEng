import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, verifyAuthToken } from "../_lib/firebaseAdmin";
import { jsonError, jsonOk } from "../_lib/http";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "GET") {
    jsonError(res, 405, "METHOD_NOT_ALLOWED", "Use GET for this endpoint.");
    return;
  }

  const uid = await verifyAuthToken(req.headers.authorization);
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  try {
    const db = getDb();
    const snap = await db.collection("buildingStats").orderBy("submissionCount", "desc").get();
    const rows = snap.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({
      buildingCode: doc.id,
      ...doc.data()
    }));
    jsonOk(res, { buildings: rows });
  } catch (error) {
    jsonError(res, 500, "INTERNAL_ERROR", `Failed to fetch building stats: ${String(error)}`);
  }
}
