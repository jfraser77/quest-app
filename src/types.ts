export type QuestType =
  | "work"
  | "growth"
  | "relationship"
  | "body"
  | "home"
  | "self"
  | "ops"
  | "learn"
  | "personal"
  | "close";

export type QuestSection =
  | "morning"
  | "work"
  | "learning"
  | "personal"
  | "closing";

export interface Quest {
  id: string;
  title: string;
  desc: string;
  time?: string;
  xp: number;
  type: QuestType;
  section: QuestSection;
  boss?: boolean;
  custom?: boolean;
  day?: number;
}

export type Player = "Joe" | "Liz";

export interface FeedPost {
  id: string;
  player: string;
  prompt: string;
  answer: string;
  ts: string;
}

export type TicketStatus = "open" | "in-progress" | "resolved" | "escalated";

export interface ITTicket {
  id: string;
  number: string;
  title: string;
  user: string;
  status: TicketStatus;
  notes: string;
}
