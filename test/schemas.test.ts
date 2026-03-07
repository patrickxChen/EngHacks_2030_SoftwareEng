import { describe, expect, test } from "vitest";
import {
  createMythRequestSchema,
  testimonialRequestSchema,
  voteRequestSchema
} from "../api/_lib/schemas";

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

  test("accepts valid course myth", () => {
    const parsed = createMythRequestSchema.safeParse({
      text: "ECE labs always run longer than expected.",
      scopeType: "course",
      scopeKey: "ECE202",
      courseTag: "ECE202"
    });
    expect(parsed.success).toBe(true);
  });

  test("rejects building myth without buildingCode", () => {
    const parsed = createMythRequestSchema.safeParse({
      text: "The E7 lab queue is endless after 7 PM.",
      scopeType: "building",
      scopeKey: "E7"
    });
    expect(parsed.success).toBe(false);
  });
});
