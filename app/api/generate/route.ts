import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { genSystemPrompt } from "@/lib/genSystemPrompt";
import type { GeneratedFile, ModelSize } from "@/lib/types";

// Server-only route — the API key never reaches the client.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

// Model-size selector is cosmetic; we map it to an output-token budget so the
// choice has a mild, sensible effect (bigger size → room for more files).
const MAX_TOKENS: Record<ModelSize, number> = {
  Low: 2048,
  Medium: 4096,
  High: 8000,
};

type IncomingMessage = { role: "user" | "assistant"; content: string };

/** Pull a JSON object out of the model's text, tolerating ``` fences / prose. */
function extractJson(raw: string): string {
  let text = raw.trim();
  // Strip a leading ```json / ``` fence and a trailing ``` if present.
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  // If there's still surrounding prose, grab the outermost { ... }.
  if (!text.startsWith("{")) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      text = text.slice(first, last + 1);
    }
  }
  return text;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  let body: { messages?: IncomingMessage[]; modelSize?: ModelSize };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
  );
  const modelSize: ModelSize = body.modelSize ?? "Medium";

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Describe the app you want to build first." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  // --- Call the model ---
  let rawText: string;
  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS[modelSize] ?? 4096,
      system: genSystemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    rawText = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error calling the model.";
    return NextResponse.json({ error: `Model request failed: ${message}` }, { status: 502 });
  }

  // --- Parse + validate the JSON contract ---
  try {
    const parsed = JSON.parse(extractJson(rawText));

    const summary = typeof parsed.summary === "string" ? parsed.summary : null;
    const files: GeneratedFile[] = Array.isArray(parsed.files)
      ? parsed.files.filter(
          (f: unknown): f is GeneratedFile =>
            !!f &&
            typeof (f as GeneratedFile).path === "string" &&
            typeof (f as GeneratedFile).contents === "string"
        )
      : [];

    if (!summary || files.length === 0) {
      throw new Error("missing summary or files");
    }

    return NextResponse.json({ summary, files });
  } catch {
    // Graceful failure — the chat pane shows this message.
    return NextResponse.json(
      { error: "The model didn't return valid app JSON. Try rephrasing your request." },
      { status: 422 }
    );
  }
}
