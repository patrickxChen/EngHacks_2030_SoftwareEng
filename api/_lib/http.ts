import type { VercelResponse } from "@vercel/node";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "INTERNAL_ERROR";

export function jsonError(
  res: VercelResponse,
  status: number,
  code: ErrorCode,
  message: string
): VercelResponse {
  return res.status(status).json({
    ok: false,
    error: {
      code,
      message
    }
  });
}

export function jsonOk<T>(res: VercelResponse, data: T): VercelResponse {
  return res.status(200).json({
    ok: true,
    data
  });
}
