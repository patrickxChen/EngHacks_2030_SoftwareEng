import type { VercelRequest, VercelResponse } from "@vercel/node";
import { jsonError, jsonOk } from "./_lib/http.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "GET") {
    jsonError(res, 405, "METHOD_NOT_ALLOWED", "Use GET for this endpoint.");
    return;
  }

  jsonOk(res, {
    service: "uw-engineering-myth-buster-backend",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
}
