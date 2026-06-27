import type { ChatMessage } from "./types";

// The canned assistant greeting shown as the first message in every new chat.
export const INTRO_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Tell me what you'd like to build, and I'll generate a starter app for you.",
};
