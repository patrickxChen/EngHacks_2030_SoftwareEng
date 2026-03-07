import type { BuildingStat, Myth, Tone } from "../types";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};

export type MythFilters = {
  q?: string;
  buildingCode?: string;
  programTag?: string;
  courseTag?: string;
  verdict?: string;
  limit?: number;
};

export type CreateMythPayload = {
  text: string;
  scopeType: "course" | "building";
  scopeKey: string;
  buildingCode?: string;
  programTag?: string;
  courseTag?: string;
  tone: Tone;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const TOKEN_KEY = "uw.idToken";

function buildHeaders(): HeadersInit {
  const idToken = localStorage.getItem(TOKEN_KEY) ?? "";
  return idToken
    ? {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json"
      }
    : {
        "Content-Type": "application/json"
      };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...buildHeaders(),
      ...(init?.headers ?? {})
    }
  });

  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !json.ok || !json.data) {
    const message = json.error?.message ?? "Request failed.";
    throw new Error(message);
  }

  return json.data;
}

export async function fetchMyths(filters: MythFilters = {}): Promise<Myth[]> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.buildingCode) params.set("buildingCode", filters.buildingCode);
  if (filters.programTag) params.set("programTag", filters.programTag);
  if (filters.courseTag) params.set("courseTag", filters.courseTag);
  if (filters.verdict) params.set("verdict", filters.verdict);
  if (typeof filters.limit === "number") params.set("limit", String(filters.limit));

  const query = params.toString();
  const data = await request<{ myths: Myth[] }>(`/api/myths${query ? `?${query}` : ""}`, {
    method: "GET"
  });

  return data.myths;
}

export async function createMyth(payload: CreateMythPayload): Promise<{ mythId: string }> {
  const data = await request<{ mythId: string }>("/api/myths", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return data;
}

export async function castVote(mythId: string, value: 1 | -1): Promise<void> {
  await request<{ mythId: string; vote: 1 | -1 }>(`/api/myths/${mythId}/vote`, {
    method: "POST",
    body: JSON.stringify({ value })
  });
}

export async function fetchBuildingStats(): Promise<BuildingStat[]> {
  const data = await request<{ buildings: BuildingStat[] }>("/api/stats/buildings", {
    method: "GET"
  });

  return data.buildings;
}
