import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type VerdictLabel = "LIKELY_TRUE" | "LIKELY_FALSE" | "MIXED";

export type VerdictResult = {
  verdictLabel: VerdictLabel;
  verdictReason: string;
  confidenceScore: number;
};

export async function generateVerdict(input: {
  text: string;
  buildingCode: string;
  programTag?: string;
  courseTag?: string;
}): Promise<VerdictResult> {
  if (!process.env.OPENAI_API_KEY) {
    // Safe fallback for local/emulator workflow when no API key is configured.
    return {
      verdictLabel: "MIXED",
      verdictReason: "Needs more real-world evidence from students in this building.",
      confidenceScore: 0.4
    };
  }

  const prompt = [
    "You are an assistant for Waterloo Engineering culture myths.",
    "Return strict JSON only with keys: verdictLabel, verdictReason, confidenceScore.",
    "verdictLabel must be one of LIKELY_TRUE, LIKELY_FALSE, MIXED.",
    "confidenceScore must be a number from 0 to 1.",
    `Myth: ${input.text}`,
    `Building: ${input.buildingCode}`,
    `Program: ${input.programTag ?? ""}`,
    `Course: ${input.courseTag ?? ""}`
  ].join("\n");

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  const text = response.output_text;
  const parsed = JSON.parse(text) as VerdictResult;

  return {
    verdictLabel: parsed.verdictLabel,
    verdictReason: parsed.verdictReason,
    confidenceScore: Math.max(0, Math.min(1, Number(parsed.confidenceScore)))
  };
}
