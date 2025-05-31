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
  theory?: string;
  hints?: string[];
};

export type ChallengeHint = {
  id: string;
  text: string;
  unlockCost: number;
};

export type TheoryExample = {
  title: string;
  code: string;
  explanation: string;
};

export type TheorySection = {
  title: string;
  content: string;
  video?: string;
  examples?: TheoryExample[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type Theory = {
  sections: TheorySection[];
  quiz?: QuizQuestion[];
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  objectives: ChallengeObjective[];
  hints: ChallengeHint[];
  startingCode: Record<ProgrammingMode, string>;
  theory?: Theory;
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
  timeSpent: number;
  attemptCount: number;
  createdAt: Date;
  updatedAt: Date;
};
