export type Friend = {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  level: number;
  fampoints: number;
  xps: number;
  stars: number;
  email: string;
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface PollQuestion {
  question: string;
  options: string[];
}

export interface Completion {
  user: string;
  completedAt: string;
  submission: string;
}

export interface CardData {
  _id: string;
  image: string;
  name: string;
  description: string;
  taskName: string;
  guild?: string;
  discord?: string;
  discordLink?: string;
  taskDescription: string;
  type: string;
  category: string;
  visitLink?: string;
  quizzes?: QuizQuestion[];
  polls?: PollQuestion[];
  inviteLink?: string;
  uploadLink?: string;
  completions: Completion[];
  uploadFileType?: string;
  walletsToConnect?: number;
  connectedWallets?: [string];
  opinionQuestion?: string;
  tweetLikeUrl?: string;
  tweetRetweetUrl?: string;
  tweetUsername?: string;
  tweetWords?: string[];
  defaultTweet?: string;
  telegramGroupLink?: string;
}

export interface Reward {
  type: string;
  value: number;
}

export interface Quest {
  title: string;
  description: string;
  type: string;
  status: string;
  rewards: Reward[];
  creator: any;
  community?: any;
  logo?: string;
  categories?: string[];
}

export interface QuestState {
  allQuests: Quest[];
  addedQuest: Quest[];
  quest: Quest | null;
  currentQuests: [];
  loading: boolean;
  error: string | null;
}

export interface CreateQuestPayload {
  communityId?: string;
  questData?: Omit<Quest, "community">;
}

export interface HeaderProps {
  quest: Quest;
}

export interface CommunityCardType
{
  _id: string,
  title: string,
  logo: string,
  description: string,
  members: [],
  quests: [];
}

export interface CelebrateType {
  run : boolean;
  recycle : boolean;
}