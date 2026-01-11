import type { Timestamp } from "firebase/firestore";

export type ArgumentNode = {
  id: string;
  parentId: string | null;
  type: 'thesis' | 'claim' | 'counterclaim' | 'evidence';
  side: 'for' | 'against';
  content: string;
  sourceText: string;
  source: string;
  fallacies: string[];
  logicalRole: string;
};

export type ArgumentTree = ArgumentNode & {
  children: ArgumentTree[];
};

export type Tweet = {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    impression_count: number;
  };
  created_at: string;
}

export interface DetectedFallacy {
  id: string;
  name: string;
  severity: 'Critical' | 'Major' | 'Minor';
  category: string;
  confidence: number;
  problematicText: string;
  explanation: string;
  definition: string;
  avoidance: string;
  example: string;
  suggestion: string;
  location?: string;
}

export type AnalysisResult = {
  blueprint: ArgumentNode[];
  summary: string;
  analysis: string;
  socialPulse: string;
  tweets: Tweet[];
  credibilityScore?: number;
  brutalHonestTake?: string;
  keyPoints?: string[];
  fallacies?: DetectedFallacy[];
};

export type ArgumentMapDocument = {
  id: string;
  userId: string;
  name: string;
  creationDate: Timestamp;
  jsonData: string; // This will be a JSON string of AnalysisResult
};
