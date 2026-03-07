import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, resolveUserId } from "../../_lib/firebaseAdmin";
import { jsonError, jsonOk } from "../../_lib/http";
import { voteRequestSchema } from "../../_lib/schemas";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    jsonError(res, 405, "METHOD_NOT_ALLOWED", "Use POST for this endpoint.");
    return;
  }

  const uid = await resolveUserId({
    authHeader: req.headers.authorization,
    demoUserIdHeader: req.headers["x-demo-user-id"]
  });
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  const mythId = req.query.mythId;
  if (typeof mythId !== "string" || !mythId.trim()) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid myth id.");
    return;
  }

  const body = voteRequestSchema.safeParse(req.body);
  if (!body.success) {
    jsonError(res, 400, "BAD_REQUEST", "Vote payload must include value: 1 or -1.");
    return;
  }

  const db = getDb();
  const mythRef = db.collection("myths").doc(mythId);
  const voteRef = mythRef.collection("votes").doc(uid);

  try {
    await db.runTransaction(async (tx: FirebaseFirestore.Transaction) => {
      const mythSnap = await tx.get(mythRef);
      if (!mythSnap.exists) {
        throw new Error("NOT_FOUND");
      }

      const voteSnap = await tx.get(voteRef);
      const next = body.data.value;
      const previous = voteSnap.exists ? (voteSnap.data()?.value as number) : 0;

      const upDelta = (next === 1 ? 1 : 0) - (previous === 1 ? 1 : 0);
      const downDelta = (next === -1 ? 1 : 0) - (previous === -1 ? 1 : 0);

      tx.set(
        voteRef,
        {
          value: next,
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      tx.set(
        mythRef,
        {
          votesUp: FieldValue.increment(upDelta),
          votesDown: FieldValue.increment(downDelta),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    });

    jsonOk(res, { mythId, vote: body.data.value });
  } catch (error) {
    if (String(error).includes("NOT_FOUND")) {
      jsonError(res, 404, "NOT_FOUND", "Myth not found.");
      return;
    }

    jsonError(res, 500, "INTERNAL_ERROR", `Vote failed: ${String(error)}`);
  }
}
