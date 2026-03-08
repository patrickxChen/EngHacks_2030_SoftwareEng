import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured, resolveUserId } from "../../_lib/firebaseAdmin.js";
import { jsonError, jsonOk } from "../../_lib/http.js";
import { testimonialRequestSchema } from "../../_lib/schemas.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-demo-user-id, x-user-name");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

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

  const body = testimonialRequestSchema.safeParse(req.body);
  if (!body.success) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid testimonial payload.");
    return;
  }

  const rawUserName = Array.isArray(req.headers["x-user-name"])
    ? req.headers["x-user-name"][0]
    : req.headers["x-user-name"];
  const userName = String(rawUserName ?? "")
    .trim()
    .toLowerCase()
    .split("@")[0]
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32);

  if (!isFirebaseConfigured()) {
    jsonOk(res, { mythId, testimonialId: `demo-${Date.now()}`, mode: "demo" });
    return;
  }

  const db = getDb();
  const mythRef = db.collection("myths").doc(mythId);
  const voteRef = mythRef.collection("votes").doc(uid);

  try {
    const mythSnap = await mythRef.get();
    if (!mythSnap.exists) {
      jsonError(res, 404, "NOT_FOUND", "Myth not found.");
      return;
    }

    const testimonialRef = mythRef.collection("testimonials").doc();
    await db.runTransaction(async (tx: FirebaseFirestore.Transaction) => {
      const voteSnap = await tx.get(voteRef);
      const nextVote = body.data.voteValue;
      const previousVote = voteSnap.exists ? Number(voteSnap.data()?.value ?? 0) : 0;
      const upDelta = (nextVote === 1 ? 1 : 0) - (previousVote === 1 ? 1 : 0);
      const downDelta = (nextVote === -1 ? 1 : 0) - (previousVote === -1 ? 1 : 0);

      tx.set(testimonialRef, {
        userId: uid,
        userName: userName || "Anonymous",
        buildingCode: body.data.buildingCode,
        text: body.data.text,
        voteValue: nextVote,
        createdAt: FieldValue.serverTimestamp()
      });

      tx.set(
        voteRef,
        {
          value: nextVote,
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      tx.set(
        mythRef,
        {
          votesUp: FieldValue.increment(upDelta),
          votesDown: FieldValue.increment(downDelta),
          testimonialCount: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    });

    jsonOk(res, { mythId, testimonialId: testimonialRef.id });
  } catch (error) {
    jsonError(res, 500, "INTERNAL_ERROR", `Adding testimonial failed: ${String(error)}`);
  }
}
