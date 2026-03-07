import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, verifyAuthToken } from "../_lib/firebaseAdmin";
import { jsonError, jsonOk } from "../_lib/http";
import { createMythRequestSchema } from "../_lib/schemas";
import { generateVerdict } from "../_lib/verdict";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method === "GET") {
    await handleGetMyths(req, res);
    return;
  }

  if (req.method === "POST") {
    await handleCreateMyth(req, res);
    return;
  }

  jsonError(res, 405, "METHOD_NOT_ALLOWED", "Use GET or POST for this endpoint.");
}

function queryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function toIso(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return new Date().toISOString();
}

async function handleGetMyths(req: VercelRequest, res: VercelResponse): Promise<void> {
  const uid = await verifyAuthToken(req.headers.authorization);
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  const db = getDb();
  const q = queryValue(req.query.q).toLowerCase().trim();
  const buildingCode = queryValue(req.query.buildingCode).toUpperCase().trim();
  const programTag = queryValue(req.query.programTag).toLowerCase().trim();
  const courseTag = queryValue(req.query.courseTag).toLowerCase().trim();
  const verdict = queryValue(req.query.verdict).toUpperCase().trim();
  const includeTestimonials = queryValue(req.query.includeTestimonials) !== "false";

  const rawLimit = Number.parseInt(queryValue(req.query.limit) || "50", 10);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : 50;

  try {
    const snap = await db.collection("myths").orderBy("createdAt", "desc").limit(limit).get();
    const filteredDocs = snap.docs.filter((doc) => {
      const data = doc.data();

      if ((data.status ?? "active") !== "active") {
        return false;
      }
      if (buildingCode && String(data.buildingCode ?? "").toUpperCase() !== buildingCode) {
        return false;
      }
      if (programTag && !String(data.programTag ?? "").toLowerCase().includes(programTag)) {
        return false;
      }
      if (courseTag && !String(data.courseTag ?? "").toLowerCase().includes(courseTag)) {
        return false;
      }
      if (verdict && String(data.verdictLabel ?? "").toUpperCase() !== verdict) {
        return false;
      }

      if (q) {
        const source = [data.text ?? "", data.buildingCode ?? "", data.programTag ?? "", data.courseTag ?? ""]
          .join(" ")
          .toLowerCase();
        if (!source.includes(q)) {
          return false;
        }
      }

      return true;
    });

    const myths = await Promise.all(
      filteredDocs.map(async (doc) => {
        const data = doc.data();

        const testimonials = includeTestimonials
          ? await doc.ref
              .collection("testimonials")
              .orderBy("createdAt", "desc")
              .limit(20)
              .get()
              .then((items) =>
                items.docs.map((entry) => {
                  const value = entry.data();
                  return {
                    id: entry.id,
                    userName: String(value.userName ?? value.userId ?? "Anonymous"),
                    buildingCode: String(value.buildingCode ?? data.buildingCode ?? ""),
                    text: String(value.text ?? ""),
                    createdAt: toIso(value.createdAt)
                  };
                })
              )
          : [];

        return {
          id: doc.id,
          text: String(data.text ?? ""),
          buildingCode: String(data.buildingCode ?? ""),
          programTag: String(data.programTag ?? ""),
          courseTag: String(data.courseTag ?? ""),
          tone: String(data.tone ?? "funny"),
          verdictLabel: String(data.verdictLabel ?? "MIXED"),
          verdictReason: String(data.verdictReason ?? ""),
          confidenceScore: Number(data.confidenceScore ?? 0),
          votesUp: Number(data.votesUp ?? 0),
          votesDown: Number(data.votesDown ?? 0),
          testimonialCount: Number(data.testimonialCount ?? testimonials.length),
          createdAt: toIso(data.createdAt),
          testimonials
        };
      })
    );

    jsonOk(res, { myths });
  } catch (error) {
    jsonError(res, 500, "INTERNAL_ERROR", `Failed to fetch myths: ${String(error)}`);
  }
}

async function handleCreateMyth(req: VercelRequest, res: VercelResponse): Promise<void> {
  const uid = await verifyAuthToken(req.headers.authorization);
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  const parsed = createMythRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid myth payload.");
    return;
  }

  const db = getDb();
  const mythRef = db.collection("myths").doc();
  const input = parsed.data;
  const resolvedBuildingCode =
    input.scopeType === "building" ? input.buildingCode ?? input.scopeKey : input.buildingCode ?? "COURSE";

  try {
    await mythRef.set({
      text: input.text,
      scopeType: input.scopeType,
      scopeKey: input.scopeKey,
      buildingCode: resolvedBuildingCode,
      programTag: input.programTag,
      courseTag: input.courseTag,
      tone: input.tone,
      authorId: uid,
      status: "active",
      verdictLabel: "MIXED",
      verdictReason: "Verdict is being generated.",
      confidenceScore: 0,
      votesUp: 0,
      votesDown: 0,
      testimonialCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    const verdict = await generateVerdict({
      text: input.text,
      buildingCode: resolvedBuildingCode,
      programTag: input.programTag,
      courseTag: input.courseTag
    });

    await mythRef.set(
      {
        verdictLabel: verdict.verdictLabel,
        verdictReason: verdict.verdictReason,
        confidenceScore: verdict.confidenceScore,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    jsonOk(res, {
      mythId: mythRef.id,
      verdict
    });
  } catch (error) {
    jsonError(res, 500, "INTERNAL_ERROR", `Failed to create myth: ${String(error)}`);
  }
}
