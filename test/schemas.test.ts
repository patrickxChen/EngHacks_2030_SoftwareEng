import { describe, expect, test } from "vitest";
import { testimonialRequestSchema, voteRequestSchema } from "../api/_lib/schemas";

describe("schema validation", () => {
  test("accepts valid vote", () => {
    const parsed = voteRequestSchema.safeParse({ value: 1 });
    expect(parsed.success).toBe(true);
  });

  test("rejects invalid vote", () => {
    const parsed = voteRequestSchema.safeParse({ value: 2 });
    expect(parsed.success).toBe(false);
  });

  test("accepts valid testimonial", () => {
    const parsed = testimonialRequestSchema.safeParse({
      buildingCode: "E7",
      text: "Spent 4 hours debugging in one lab session."
    });
    expect(parsed.success).toBe(true);
  });
});
