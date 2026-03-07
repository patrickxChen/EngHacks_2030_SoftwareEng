import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, resolveUserId } from "../../_lib/firebaseAdmin";
import { jsonError, jsonOk } from "../../_lib/http";
import { testimonialRequestSchema } from "../../_lib/schemas";

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

  const body = testimonialRequestSchema.safeParse(req.body);
  if (!body.success) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid testimonial payload.");
    return;
  }

  const db = getDb();
  const mythRef = db.collection("myths").doc(mythId);

  try {
    const mythSnap = await mythRef.get();
    if (!mythSnap.exists) {
      jsonError(res, 404, "NOT_FOUND", "Myth not found.");
      return;
    }

    const testimonialRef = mythRef.collection("testimonials").doc();
    await db.runTransaction(async (tx: FirebaseFirestore.Transaction) => {
      tx.set(testimonialRef, {
        userId: uid,
        buildingCode: body.data.buildingCode,
        text: body.data.text,
        createdAt: FieldValue.serverTimestamp()
      });

      tx.set(
        mythRef,
        {
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
