import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb, verifyAuthToken } from "../_lib/firebaseAdmin.js";
import { jsonError, jsonOk } from "../_lib/http.js";
import { verdictRequestSchema } from "../_lib/schemas.js";
import { generateVerdict } from "../_lib/verdict.js";

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

  const parsed = verdictRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid request body for verdict generation.");
    return;
  }

  try {
    const verdict = await generateVerdict(parsed.data);
    jsonOk(res, verdict);
  } catch (error) {
    jsonError(res, 500, "INTERNAL_ERROR", `Verdict generation failed: ${String(error)}`);
  }

  void getDb();
}
