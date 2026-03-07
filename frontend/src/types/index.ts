export type VerdictLabel = "LIKELY_TRUE" | "LIKELY_FALSE" | "MIXED";
export type Tone = "funny" | "serious";

export interface Testimonial {
  id: string;
  userName: string;
  buildingCode: string;
  text: string;
  voteValue: 1 | -1;
  createdAt: string;
}

export interface Myth {
  id: string;
  authorId?: string;
  scopeType?: "course" | "prof" | "building";
  scopeKey?: string;
  status?: string;
  text: string;
  buildingCode: string;
  programTag?: string;
  courseTag?: string;
  profTag?: string;
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
