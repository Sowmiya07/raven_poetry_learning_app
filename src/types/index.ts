export interface Poem {
  id: string;
  title: string;
  content: string;
  theme: string;
  createdAt: Date;
  feedback?: PoemFeedback;
}

export interface PoemFeedback {
  score: number;
  strengths: string[];
  suggestions: string[];
  overall: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  prompt: string;
  color: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastWriteDate: string | null;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  earnedDate?: Date;
  icon: string;
}