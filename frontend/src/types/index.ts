export type VerdictLabel = "LIKELY_TRUE" | "LIKELY_FALSE" | "MIXED";
export type Tone = "funny" | "serious";

export interface Testimonial {
  id: string;
  userName: string;
  buildingCode: string;
  text: string;
  createdAt: string;
}

export interface Myth {
  id: string;
  text: string;
  buildingCode: string;
  programTag?: string;
  courseTag?: string;
  tone: Tone;
  verdictLabel: VerdictLabel;
  verdictReason: string;
  confidenceScore: number;
  votesUp: number;
  votesDown: number;
  testimonialCount: number;
  createdAt: string;
  testimonials: Testimonial[];
}

export interface BuildingStat {
  buildingCode: string;
  submissionCount: number;
  likelyTrueCount: number;
  likelyFalseCount: number;
  mixedCount: number;
  testimonialCount: number;
  avgHumorScore: number;
}

export interface Report {
  id: string;
  targetType: "myth" | "testimonial";
  targetId: string;
  reason: string;
  reportedBy: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  fromUser: string;
  postId: string;
  message: string;
  createdAt: string;
}
