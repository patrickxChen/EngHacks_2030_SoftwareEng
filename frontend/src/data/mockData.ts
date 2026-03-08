import type { BuildingStat, Myth, NotificationItem, Report } from "../types";

export const buildings = ["E7", "E2", "DC", "RCH", "CPH", "DWE"];

export const templateMyths: Myth[] = [
  {
    id: "tmpl-math135-goat",
    scopeType: "course",
    scopeKey: "MATH 135",
    text: "Stephen Obinna is the goat",
    buildingCode: "RCH",
    programTag: "Math",
    courseTag: "MATH 135",
    tone: "funny",
    verdictLabel: "LIKELY_TRUE",
    verdictReason: "Class chat consensus says this one is almost undisputed.",
    confidenceScore: 0.96,
    votesUp: 96,
    votesDown: 4,
    testimonialCount: 1,
    createdAt: "2026-03-07T14:40:00Z",
    testimonials: [
      {
        id: "t-math135-goat-1",
        userName: "CalcCrew",
        buildingCode: "RCH",
        text: "Legend status confirmed by every tutorial section.",
        voteValue: 1,
        createdAt: "2026-03-07T14:42:00Z"
      }
    ]
  },
  {
    id: "tmpl-course-1",
    scopeType: "course",
    scopeKey: "ECE 198",
    text: "ECE 198 labs usually run longer than scheduled in E7.",
    buildingCode: "E7",
    programTag: "ECE",
    courseTag: "ECE 198",
    tone: "serious",
    verdictLabel: "LIKELY_TRUE",
    verdictReason:
      "Anyone who has wrestled with a microcontroller in E7 after midnight has lived this timeline.",
    confidenceScore: 0.83,
    votesUp: 142,
    votesDown: 27,
    testimonialCount: 2,
    createdAt: "2026-03-01T12:00:00Z",
    testimonials: [
      {
        id: "t1",
        userName: "MechMaya",
        buildingCode: "E7",
        text: "Came in for one bug, left with a whole new personality.",
        voteValue: 1,
        createdAt: "2026-03-01T17:12:00Z"
      },
      {
        id: "t2",
        userName: "NanoNoah",
        buildingCode: "E7",
        text: "If your code works first try, check if you're in the wrong room.",
        voteValue: 1,
        createdAt: "2026-03-01T18:40:00Z"
      }
    ]
  },
  {
    id: "tmpl-prof-1",
    scopeType: "prof",
    scopeKey: "Prof. Martin",
    text: "Prof. Martin curves every midterm by at least 15%.",
    buildingCode: "RCH",
    programTag: "SE",
    profTag: "Prof. Martin",
    tone: "funny",
    verdictLabel: "LIKELY_FALSE",
    verdictReason:
      "Historical grade snapshots suggest occasional small adjustments, not a guaranteed mega-curve.",
    confidenceScore: 0.88,
    votesUp: 31,
    votesDown: 121,
    testimonialCount: 1,
    createdAt: "2026-03-02T09:00:00Z",
    testimonials: [
      {
        id: "t3",
        userName: "CSCass",
        buildingCode: "RCH",
        text: "Great lectures, but the 15% myth is pure coping energy.",
        voteValue: -1,
        createdAt: "2026-03-02T10:22:00Z"
      }
    ]
  },
  {
    id: "tmpl-building-1",
    scopeType: "building",
    scopeKey: "DC",
    text: "You can always find a quiet seat in DC during midterm season.",
    buildingCode: "DC",
    programTag: "SE",
    courseTag: "CS 246",
    tone: "funny",
    verdictLabel: "LIKELY_FALSE",
    verdictReason:
      "DC silence is a scarce resource in October. Odds improve only before sunrise.",
    confidenceScore: 0.9,
    votesUp: 9,
    votesDown: 171,
    testimonialCount: 1,
    createdAt: "2026-03-03T09:00:00Z",
    testimonials: [
      {
        id: "t3",
        userName: "CSCass",
        buildingCode: "DC",
        text: "Found one seat once. It was in a dream.",
        voteValue: -1,
        createdAt: "2026-03-03T10:22:00Z"
      }
    ]
  },
  {
    id: "tmpl-e7-overnight",
    scopeType: "building",
    scopeKey: "E7",
    text: "If your capstone team works in E7 after 10pm, someone will order bubble tea.",
    buildingCode: "E7",
    programTag: "SE",
    tone: "funny",
    verdictLabel: "LIKELY_TRUE",
    verdictReason: "Late-night team rituals in E7 heavily support this trend.",
    confidenceScore: 0.92,
    votesUp: 188,
    votesDown: 12,
    testimonialCount: 2,
    createdAt: "2026-03-03T20:10:00Z",
    testimonials: [
      {
        id: "t-e7-overnight-1",
        userName: "LateLabLeo",
        buildingCode: "E7",
        text: "We do standup, then tea run, then debug till 2am.",
        voteValue: 1,
        createdAt: "2026-03-03T20:30:00Z"
      },
      {
        id: "t-e7-overnight-2",
        userName: "DebugDana",
        buildingCode: "E7",
        text: "Bubble tea is basically a required dependency.",
        voteValue: 1,
        createdAt: "2026-03-03T21:04:00Z"
      }
    ]
  },
  {
    id: "tmpl-dc-quiet",
    scopeType: "building",
    scopeKey: "DC",
    text: "DC always has empty silent-floor seats during finals week.",
    buildingCode: "DC",
    programTag: "CS",
    tone: "serious",
    verdictLabel: "LIKELY_FALSE",
    verdictReason: "Peak season crowding patterns strongly contradict this claim.",
    confidenceScore: 0.95,
    votesUp: 14,
    votesDown: 226,
    testimonialCount: 1,
    createdAt: "2026-03-04T08:05:00Z",
    testimonials: [
      {
        id: "t-dc-quiet-1",
        userName: "QueueQuinn",
        buildingCode: "DC",
        text: "You can find a seat if you arrive at sunrise.",
        voteValue: -1,
        createdAt: "2026-03-04T08:42:00Z"
      }
    ]
  },
  {
    id: "tmpl-cph-microwave",
    scopeType: "building",
    scopeKey: "CPH",
    text: "The CPH lounge microwave always has a line between 12:00 and 1:00.",
    buildingCode: "CPH",
    programTag: "ME",
    tone: "funny",
    verdictLabel: "LIKELY_TRUE",
    verdictReason: "Lunch-hour crowd patterns repeatedly confirm a consistent queue.",
    confidenceScore: 0.89,
    votesUp: 161,
    votesDown: 19,
    testimonialCount: 1,
    createdAt: "2026-03-05T12:00:00Z",
    testimonials: [
      {
        id: "t-cph-microwave-1",
        userName: "LunchLiam",
        buildingCode: "CPH",
        text: "I time my lunch around that line now.",
        voteValue: 1,
        createdAt: "2026-03-05T12:17:00Z"
      }
    ]
  },
  {
    id: "tmpl-prof-popquiz",
    scopeType: "prof",
    scopeKey: "Prof. Kwan",
    text: "Prof. Kwan gives surprise quizzes every single lecture.",
    buildingCode: "E2",
    programTag: "SYDE",
    profTag: "Prof. Kwan",
    tone: "serious",
    verdictLabel: "LIKELY_FALSE",
    verdictReason: "Course outlines and class reports indicate occasional, not daily, quizzes.",
    confidenceScore: 0.91,
    votesUp: 22,
    votesDown: 205,
    testimonialCount: 1,
    createdAt: "2026-03-05T16:20:00Z",
    testimonials: [
      {
        id: "t-prof-popquiz-1",
        userName: "SydSana",
        buildingCode: "E2",
        text: "It feels constant, but it is definitely not every lecture.",
        voteValue: -1,
        createdAt: "2026-03-05T16:44:00Z"
      }
    ]
  },
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