import { NextResponse } from "next/server";
import { genSystemPrompt } from "@/lib/genSystemPrompt";
import type { GeneratedFile, ModelSize } from "@/lib/types";

// Server-only route — the API key never reaches the client.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// The in-app selector (Flash Lite / Flash / Pro) maps to these Gemini models,
// cheapest → highest quality. Setting GEMINI_MODEL pins one model globally and
// overrides the selector.
const MODEL_BY_SIZE: Record<ModelSize, string> = {
  Low: "gemini-2.5-flash-lite", // cheapest + fastest
  Medium: "gemini-2.5-flash", // balanced
  High: "gemini-2.5-pro", // highest quality
};

// Output-token budget per tier.
const MAX_TOKENS: Record<ModelSize, number> = {
  Low: 4096,
  Medium: 8192,
  High: 16384,
};

// Response schema so Gemini returns exactly our JSON contract. Gemini's REST
// API expects UPPERCASE OpenAPI type names (OBJECT / STRING / ARRAY).
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    summary: { type: "STRING" },
    files: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          path: { type: "STRING" },
          contents: { type: "STRING" },
        },
        required: ["path", "contents"],
      },
    },
  },
  required: ["summary", "files"],
};

type IncomingMessage = { role: "user" | "assistant"; content: string };

/** Pull a JSON object out of the model's text, tolerating stray prose/fences. */
function extractJson(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  if (!text.startsWith("{")) {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) text = text.slice(first, last + 1);
  }
  return text;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server." },
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
  const modelSize: ModelSize = body.modelSize ?? "Low";
  const model = process.env.GEMINI_MODEL || MODEL_BY_SIZE[modelSize] || "gemini-2.5-flash-lite";

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Describe the app you want to build first." }, { status: 400 });
  }

  // Gemini uses "user" / "model" roles.
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: MAX_TOKENS[modelSize] ?? 8192,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };
  // 2.5 Flash / Flash-Lite "think" by default, which spends the output budget;
  // disable it for fast, predictable structured output. (Pro keeps thinking.)
  if (/2\.5-flash/.test(model)) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  // --- Call the model ---
  let rawText: string;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: genSystemPrompt }] },
        contents,
        generationConfig,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let message = `Gemini request failed (${res.status})`;
      try {
        message = JSON.parse(errText)?.error?.message || message;
      } catch {
        /* non-JSON error body */
      }
      return NextResponse.json({ error: `Model request failed: ${message}` }, { status: 502 });
    }

    const data = await res.json();
    const candidate = data?.candidates?.[0];
    rawText = (candidate?.content?.parts ?? [])
      .map((p: { text?: string }) => p.text)
      .filter(Boolean)
      .join("");

    if (!rawText) {
      const reason = candidate?.finishReason || data?.promptFeedback?.blockReason || "no content";
      return NextResponse.json(
        { error: `The model returned no output (${reason}). Try rephrasing your request.` },
        { status: 502 }
      );
    }
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
    return NextResponse.json(
      { error: "The model didn't return valid app JSON. Try rephrasing your request." },
      { status: 422 }
    );
  }
}
