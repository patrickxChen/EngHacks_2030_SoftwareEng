import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, verifyAuthToken } from "../_lib/firebaseAdmin";
import { jsonError, jsonOk } from "../_lib/http";
import { reportRequestSchema } from "../_lib/schemas";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    jsonError(res, 405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.");
    return;
  }

  const uid = await verifyAuthToken(req.headers.authorization);
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  const body = reportRequestSchema.safeParse(req.body);
  if (!body.success) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid report payload.");
    return;
  }

  try {
    const db = getDb();
    const ref = db.collection("reports").doc();
    await ref.set({
      ...body.data,
      reportedBy: uid,
      status: "open",
      createdAt: FieldValue.serverTimestamp()
    });

    jsonOk(res, { reportId: ref.id });
  } catch (error) {
    jsonError(res, 500, "INTERNAL_ERROR", `Failed to create report: ${String(error)}`);
  }
}
