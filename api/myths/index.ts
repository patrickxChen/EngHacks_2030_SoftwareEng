import type { VercelRequest, VercelResponse } from "@vercel/node";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, isFirebaseConfigured, resolveUserId } from "../_lib/firebaseAdmin.js";
import { jsonError, jsonOk } from "../_lib/http.js";
import { createMythRequestSchema } from "../_lib/schemas.js";
import { generateVerdict } from "../_lib/verdict.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-demo-user-id, x-user-name");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

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

function normalizeUsername(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) {
    return "";
  }

  const [localPart] = raw.split("@");
  return String(localPart ?? "").replace(/[^a-z0-9._-]/g, "").slice(0, 32);
}

function buildDisplayName(userName: unknown, userId: unknown): string {
  const normalizedName = normalizeUsername(userName);
  if (normalizedName) {
    return normalizedName;
  }

  const rawId = String(userId ?? "").trim().toLowerCase();
  if (!rawId || rawId.startsWith("demo-")) {
    return "Anonymous";
  }

  const normalizedId = normalizeUsername(rawId);
  return normalizedId || "Anonymous";
}

async function handleGetMyths(req: VercelRequest, res: VercelResponse): Promise<void> {
  const uid = await resolveUserId({
    authHeader: req.headers.authorization,
    demoUserIdHeader: req.headers["x-demo-user-id"]
  });
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  const q = queryValue(req.query.q).toLowerCase().trim();
  const buildingCode = queryValue(req.query.buildingCode).toUpperCase().trim();
  const programTag = queryValue(req.query.programTag).toLowerCase().trim();
  const courseTag = queryValue(req.query.courseTag).toLowerCase().trim();
  const verdict = queryValue(req.query.verdict).toUpperCase().trim();
  const includeTestimonials = queryValue(req.query.includeTestimonials) !== "false";

  const rawLimit = Number.parseInt(queryValue(req.query.limit) || "50", 10);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : 50;

  if (!isFirebaseConfigured()) {
    jsonOk(res, { myths: [], mode: "demo", limit });
    return;
  }

  try {
    const db = getDb();
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
                    userName: buildDisplayName(value.userName, value.userId),
                    buildingCode: String(value.buildingCode ?? data.buildingCode ?? ""),
                    text: String(value.text ?? ""),
                    voteValue: Number(value.voteValue ?? 1) === -1 ? -1 : 1,
                    createdAt: toIso(value.createdAt)
                  };
                })
              )
          : [];

        return {
          id: doc.id,
          text: String(data.text ?? ""),
          authorId: String(data.authorId ?? ""),
          scopeType: String(data.scopeType ?? "building"),
          scopeKey: String(data.scopeKey ?? ""),
          status: String(data.status ?? "active"),
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
  const uid = await resolveUserId({
    authHeader: req.headers.authorization,
    demoUserIdHeader: req.headers["x-demo-user-id"]
  });
  if (!uid) {
    jsonError(res, 401, "UNAUTHORIZED", "Missing or invalid auth token.");
    return;
  }

  const parsed = createMythRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    jsonError(res, 400, "BAD_REQUEST", "Invalid myth payload.");
    return;
  }

  const input = parsed.data;
  const resolvedBuildingCode =
    input.scopeType === "building" ? input.buildingCode ?? input.scopeKey : input.buildingCode ?? "COURSE";

  if (!isFirebaseConfigured()) {
    jsonOk(res, {
      mythId: `demo-${Date.now()}`,
      verdict: {
        verdictLabel: "MIXED",
        verdictReason: "Demo mode: Firebase is not configured, so this submission is not persisted.",
        confidenceScore: 0
      },
      mode: "demo"
    });
    return;
  }

  try {
    const db = getDb();
    const mythRef = db.collection("myths").doc();
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
