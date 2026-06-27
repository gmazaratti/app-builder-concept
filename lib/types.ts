// Shared types for the generation flow.

export type ModelSize = "Low" | "Medium" | "High";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  /** Set on assistant messages when the turn produced a generated app. */
  generated?: GeneratedApp;
  /** Set when the turn failed to parse/generate, for graceful in-chat errors. */
  error?: boolean;
}

export interface GeneratedFile {
  path: string;
  contents: string;
}

export interface GeneratedApp {
  summary: string;
  files: GeneratedFile[];
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  messages: ChatMessage[];
  app?: GeneratedApp;
}
