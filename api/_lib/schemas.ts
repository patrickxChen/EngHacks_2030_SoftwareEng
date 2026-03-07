import { z } from "zod";

const scopeTypeSchema = z.enum(["course", "building"]);

export const createMythRequestSchema = z
  .object({
    text: z.string().min(8).max(300),
    scopeType: scopeTypeSchema,
    scopeKey: z.string().min(2).max(20),
    programTag: z.string().max(40).optional().default(""),
    courseTag: z.string().max(20).optional().default(""),
    buildingCode: z.string().min(2).max(10).optional(),
    tone: z.enum(["funny", "serious"]).optional().default("funny")
  })
  .superRefine((value, ctx) => {
    if (value.scopeType === "building" && !value.buildingCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["buildingCode"],
        message: "buildingCode is required when scopeType is building."
      });
    }
  });

export const verdictRequestSchema = z.object({
  text: z.string().min(8).max(300),
  buildingCode: z.string().min(2).max(10),
  programTag: z.string().max(40).optional().default(""),
  courseTag: z.string().max(20).optional().default(""),
  tone: z.enum(["funny", "serious"]).optional().default("funny")
});

export const voteRequestSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)])
});

export const testimonialRequestSchema = z.object({
  buildingCode: z.string().min(2).max(10),
  text: z.string().min(4).max(400)
});

export const reportRequestSchema = z.object({
  targetType: z.enum(["myth", "testimonial"]),
  targetId: z.string().min(4),
  reason: z.string().min(4).max(240)
});
