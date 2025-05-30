export enum ChallengeCategory {
  WAREHOUSE = 'warehouse',
  SURGERY = 'surgery',
  SEARCH_RESCUE = 'search_rescue',
  MANUFACTURING = 'manufacturing',
  INTRO = 'intro',
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum ProgrammingMode {
  NATURAL_LANGUAGE = 'natural_language',
  BLOCK = 'block',
  CODE = 'code',
}

export type ChallengeObjective = {
  id: string;
  description: string;
  completionCriteria: string;
  completed: boolean;
};

export type ChallengeHint = {
  id: string;
  text: string;
  unlockCost: number; // cost in points or tokens to unlock this hint
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: DifficultyLevel;
  estimatedTime: number; // in minutes
  objectives: ChallengeObjective[];
  hints: ChallengeHint[];
  startingCode: Record<ProgrammingMode, string>;
  robotType: string;
  environmentId: string;
  unlocked: boolean;
  completed: boolean;
  nextChallengeIds: string[];
};

export type UserProgress = {
  userId: string;
  completedChallenges: string[];
  unlockedChallenges: string[];
  currentChallenge?: string;
  points: number;
  badges: string[];
  lastActive: Date;
};

export type UserSolution = {
  challengeId: string;
  userId: string;
  programmingMode: ProgrammingMode;
  code: string;
  completed: boolean;
  timeSpent: number; // in seconds
  attemptCount: number;
  createdAt: Date;
  updatedAt: Date;
};