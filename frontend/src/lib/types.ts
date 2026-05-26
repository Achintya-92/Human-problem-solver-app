export type Category = { id: string; name: string; slug: string };

export type TrustScore = { score: number; helpfulVotes: number; workedForMeVotes: number; misleadingReports: number };

export type UserMini = {
  id: string;
  name: string;
  username?: string | null;
  avatarUrl?: string | null;
  trustScore?: TrustScore | null;
};

export type ProblemListItem = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  emotionTag?: string | null;
  anonymous: boolean;
  createdAt: string;
  category: Category;
  user: UserMini;
  _count: { solutions: number; comments: number; votes: number };
};

export type Solution = {
  id: string;
  content: string;
  practicalSteps: string;
  mistakes?: string | null;
  timeline?: string | null;
  results?: string | null;
  proofLinks: string[];
  videoUrl?: string | null;
  experienceType: "PERSONALLY_EXPERIENCED" | "MENTOR" | "EXPERT";
  createdAt: string;
  user: UserMini;
  votes: { targetType: string }[];
};

export type ProblemDetail = ProblemListItem & {
  solutions: Solution[];
  comments: { id: string; content: string; createdAt: string; user: UserMini }[];
};

