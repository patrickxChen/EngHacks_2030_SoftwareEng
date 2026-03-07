import type { BuildingStat, Myth, NotificationItem, Report } from "../types";

export const buildings = ["E7", "E2", "DC", "RCH", "CPH", "DWE"];

export const myths: Myth[] = [
  {
    id: "m1",
    text: "ECE labs in E7 always take 6 hours.",
    buildingCode: "E7",
    programTag: "ECE",
    courseTag: "ECE 198",
    tone: "serious",
    verdictLabel: "LIKELY_TRUE",
    verdictReason:
      "Anyone who has wrestled with a microcontroller in E7 after midnight has lived this timeline.",
    confidenceScore: 0.83,
    votesUp: 128,
    votesDown: 24,
    testimonialCount: 2,
    createdAt: "2026-03-01T12:00:00Z",
    testimonials: [
      {
        id: "t1",
        userName: "MechMaya",
        buildingCode: "E7",
        text: "Came in for one bug, left with a whole new personality.",
        createdAt: "2026-03-01T17:12:00Z"
      },
      {
        id: "t2",
        userName: "NanoNoah",
        buildingCode: "E7",
        text: "If your code works first try, check if you're in the wrong room.",
        createdAt: "2026-03-01T18:40:00Z"
      }
    ]
  },
  {
    id: "m2",
    text: "You can always find a quiet seat in DC during midterm season.",
    buildingCode: "DC",
    programTag: "SE",
    courseTag: "CS 246",
    tone: "funny",
    verdictLabel: "LIKELY_FALSE",
    verdictReason:
      "DC silence is a scarce resource in October. Odds improve only before sunrise.",
    confidenceScore: 0.9,
    votesUp: 91,
    votesDown: 11,
    testimonialCount: 1,
    createdAt: "2026-03-03T09:00:00Z",
    testimonials: [
      {
        id: "t3",
        userName: "CSCass",
        buildingCode: "DC",
        text: "Found one seat once. It was in a dream.",
        createdAt: "2026-03-03T10:22:00Z"
      }
    ]
  },
  {
    id: "m3",
    text: "RCH has the best whiteboards for solving impossible assignments.",
    buildingCode: "RCH",
    programTag: "SYDE",
    courseTag: "MATH 239",
    tone: "serious",
    verdictLabel: "MIXED",
    verdictReason:
      "The whiteboards are elite, but finding one that is free is a questline.",
    confidenceScore: 0.64,
    votesUp: 66,
    votesDown: 19,
    testimonialCount: 0,
    createdAt: "2026-03-04T11:15:00Z",
    testimonials: []
  }
];

export const buildingStats: BuildingStat[] = [
  {
    buildingCode: "E7",
    submissionCount: 54,
    likelyTrueCount: 29,
    likelyFalseCount: 15,
    mixedCount: 10,
    testimonialCount: 41,
    avgHumorScore: 7.8
  },
  {
    buildingCode: "E2",
    submissionCount: 31,
    likelyTrueCount: 12,
    likelyFalseCount: 12,
    mixedCount: 7,
    testimonialCount: 18,
    avgHumorScore: 6.5
  },
  {
    buildingCode: "DC",
    submissionCount: 48,
    likelyTrueCount: 20,
    likelyFalseCount: 18,
    mixedCount: 10,
    testimonialCount: 37,
    avgHumorScore: 8.4
  },
  {
    buildingCode: "RCH",
    submissionCount: 27,
    likelyTrueCount: 11,
    likelyFalseCount: 7,
    mixedCount: 9,
    testimonialCount: 14,
    avgHumorScore: 6.9
  }
];

export const openReports: Report[] = [
  {
    id: "r1",
    targetType: "myth",
    targetId: "m2",
    reason: "Spam copy-paste",
    reportedBy: "user-1102",
    status: "open",
    createdAt: "2026-03-05T13:10:00Z"
  },
  {
    id: "r2",
    targetType: "testimonial",
    targetId: "t3",
    reason: "Off-topic",
    reportedBy: "user-1418",
    status: "open",
    createdAt: "2026-03-06T08:45:00Z"
  }
];

export const notificationItems: NotificationItem[] = [
  {
    id: "n1",
    fromUser: "John Waterloo",
    postId: "m1",
    message: "replied: You can survive E7 midterms if you bring snacks.",
    createdAt: "2026-03-06T20:12:00Z"
  },
  {
    id: "n2",
    fromUser: "CSCass",
    postId: "m2",
    message: "replied: DC is only quiet before sunrise.",
    createdAt: "2026-03-06T18:34:00Z"
  }
];

export const userPostIds = ["m1", "m2"];