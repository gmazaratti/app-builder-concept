"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import PhoneFrame from "@/components/PhoneFrame";
import AppPreview from "@/components/AppPreview";
import FileTree from "@/components/FileTree";
import CodeView from "@/components/CodeView";
import ModelSizeSelector from "@/components/ModelSizeSelector";
import DeviceSelector, { getDevice } from "@/components/DeviceSelector";
import { ArrowRight, Image as ImageIcon, Eye, Code, FileCode, Sparkle, PanelRight } from "@/components/icons";
import type { ChatMessage, GeneratedApp, ModelSize } from "@/lib/types";
import { INTRO_MESSAGE } from "@/lib/constants";
import { getProject, updateProject, createProject } from "@/lib/projectStore";

type Stage = "preview" | "code";

function defaultFile(app: GeneratedApp): string | null {
  const entry =
    app.files.find((f) => /(^|\/)App\.(tsx|jsx|js|ts)$/.test(f.path)) ?? app.files[0];
  return entry?.path ?? null;
}

function deriveName(prompt: string): string {
  const words = prompt.trim().split(/\s+/).slice(0, 5).join(" ");
  if (!words) return "Untitled project";
  return words.length > 32 ? words.slice(0, 32).trim() + "…" : words;
}

function ComposeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");

  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [modelSize, setModelSize] = useState<ModelSize>("Medium");
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState<GeneratedApp | undefined>(undefined);
  const [stage, setStage] = useState<Stage>("preview");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState("iphone15");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const loadedRef = useRef<string | null>(null);

  // Auto-scroll chat to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || loading) return;

      const userMsg: ChatMessage = { role: "user", content: prompt };
      // Drop the canned intro (index 0) so the API payload starts with a user turn.
      const history = [...messages.slice(1), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, modelSize }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          throw new Error(data.error || `Request failed (${res.status})`);
        }

        const generated: GeneratedApp = { summary: data.summary, files: data.files };
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: generated.summary, generated },
        ]);
        setApp(generated);
        setSelectedFile(defaultFile(generated));
        setStage("preview");
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            error: true,
            content:
              err instanceof Error
                ? `Something went wrong while generating: ${err.message}`
                : "Something went wrong while generating your app.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, modelSize, loading]
  );

  // Load the active project, reacting to the ?project= in the URL so that
  // creating/switching projects from the sidebar (same-route navigation) works.
  useEffect(() => {
    // First visit with no project (e.g. landing hero ?prompt=): make one.
    if (!initRef.current && !projectParam) {
      initRef.current = true;
      const prompt = new URLSearchParams(window.location.search).get("prompt");
      const proj = createProject(prompt ? deriveName(prompt) : undefined);
      loadedRef.current = proj.id;
      setProjectId(proj.id);
      setMessages([INTRO_MESSAGE]);
      setApp(undefined);
      setSelectedFile(null);
      router.replace(`/compose?project=${proj.id}`);
      if (prompt) send(prompt);
      return;
    }
    initRef.current = true;

    // Load whenever the URL points at a different project than what's loaded.
    if (projectParam && projectParam !== loadedRef.current) {
      const proj = getProject(projectParam);
      if (proj) {
        loadedRef.current = proj.id;
        setProjectId(proj.id);
        setMessages(proj.messages.length ? proj.messages : [INTRO_MESSAGE]);
        if (proj.app) {
          setApp(proj.app);
          setSelectedFile(defaultFile(proj.app));
        } else {
          setApp(undefined);
          setSelectedFile(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectParam]);

  // Persist chat + generated app back to the store as they change.
  useEffect(() => {
    if (!projectId) return;
    updateProject(projectId, { messages, app });
  }, [messages, app, projectId]);

  const selectedContents =
    app?.files.find((f) => f.path === selectedFile)?.contents ?? null;
  const device = getDevice(deviceId);

  // Selecting a file in the explorer flips the stage to the code view.
  const openFile = (path: string) => {
    setSelectedFile(path);
    setStage("code");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeProjectId={projectId ?? undefined} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top breadcrumb bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-5 text-sm">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-muted transition-colors hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-2">/</span>
            <span className="text-muted">Projects</span>
            <span className="text-muted-2">/</span>
            <span className="font-medium text-foreground">Compose</span>
          </div>

          {/* Toggle the chat panel */}
          <button
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            aria-pressed={chatOpen}
            title={chatOpen ? "Hide chat" : "Show chat"}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm transition-colors ${
              chatOpen
                ? "bg-surface-2 font-medium text-foreground"
                : "text-muted hover:bg-surface-2 hover:text-foreground"
            }`}
          >
            <PanelRight width={15} height={15} />
            Chat
          </button>
        </header>

        {/*
          Layout is deliberately a three-column "studio" — a persistent file
          explorer (left), a centered Preview/Code stage, and the chat docked on
          the right — rather than the conventional chat-left / preview-right split.
        */}
        <div className="flex min-h-0 flex-1">
          {/* LEFT — file explorer (always visible) */}
          <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-surface">
            <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3.5 text-sm">
              <FileCode width={14} height={14} className="text-muted-2" />
              <span className="font-medium text-foreground">Files</span>
              {app && <span className="ml-auto text-xs text-muted-2">{app.files.length}</span>}
            </div>
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
              {app ? (
                <FileTree files={app.files} selected={selectedFile} onSelect={openFile} />
              ) : (
                <p className="px-4 py-6 text-xs leading-relaxed text-muted-2">
                  Files appear here once the agent builds your app.
                </p>
              )}
            </div>
          </aside>

          {/* CENTER — Preview / Code stage */}
          <section className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-3">
              <div className="flex items-center gap-0.5 rounded-pill bg-surface-2 p-0.5">
                <button
                  type="button"
                  onClick={() => setStage("preview")}
                  className={`flex items-center gap-1.5 rounded-pill px-3 py-1 text-sm transition-colors ${
                    stage === "preview"
                      ? "bg-surface font-medium text-foreground shadow-card"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Eye width={14} height={14} />
                  Preview
                </button>
                <button
                  type="button"
                  disabled={!app}
                  onClick={() => {
                    if (!app) return;
                    if (!selectedFile) setSelectedFile(defaultFile(app));
                    setStage("code");
                  }}
                  className={`flex items-center gap-1.5 rounded-pill px-3 py-1 text-sm transition-colors disabled:opacity-40 ${
                    stage === "code"
                      ? "bg-surface font-medium text-foreground shadow-card"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Code width={14} height={14} />
                  Code
                </button>
              </div>
              {stage === "preview" && <DeviceSelector value={deviceId} onChange={setDeviceId} />}
            </div>

            <div className="min-h-0 flex-1">
              {stage === "preview" ? (
                <div className="flex h-full items-center justify-center overflow-auto bg-surface-2 p-6">
                  <PhoneFrame
                    width={device.w}
                    height={device.h}
                    radius={device.radius}
                    notch={device.notch}
                  >
                    <AppPreview app={app} />
                  </PhoneFrame>
                </div>
              ) : app && selectedFile ? (
                <CodeView path={selectedFile} contents={selectedContents} />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-2">
                  <FileCode width={22} height={22} />
                  <p className="max-w-[220px]">
                    Generate an app, then pick a file to read its code.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT — chat (collapsible, width-animated) */}
          <section
            className={`shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
              chatOpen ? "w-[380px] border-l border-border" : "w-0"
            }`}
          >
            {/* Fixed-width inner so content doesn't reflow while the panel animates */}
            <div className="flex h-full w-[380px] flex-col">
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4 text-sm">
              <div className="flex items-center gap-2">
                <Sparkle width={14} height={14} className="text-muted-2" />
                <span className="font-medium text-foreground">Chat</span>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Collapse chat"
                title="Hide chat"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-2 transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <PanelRight width={15} height={15} />
              </button>
            </div>

            <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 py-5">
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <MessageBubble key={i} message={m} />
                ))}
                {loading && <TypingIndicator />}
              </div>
            </div>

            {/* Composer */}
            <div className="shrink-0 border-t border-border p-3">
              <div className="card rounded-xl p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={2}
                  placeholder="Type a message…"
                  className="w-full resize-none rounded-md bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-2 focus:outline-none"
                />
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Add image"
                      className="flex h-7 w-7 items-center justify-center rounded-pill text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <ImageIcon width={16} height={16} />
                    </button>
                    <ModelSizeSelector value={modelSize} onChange={setModelSize} />
                  </div>
                  <button
                    type="button"
                    onClick={() => send(input)}
                    disabled={loading || !input.trim()}
                    aria-label="Send"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
                  >
                    <ArrowRight width={16} height={16} className="-rotate-90" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// useSearchParams() must sit inside a Suspense boundary.
export default function ComposePage() {
  return (
    <Suspense fallback={<div className="h-screen bg-background" />}>
      <ComposeInner />
    </Suspense>
  );
}

/* ---- Chat sub-components ---- */

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2 text-sm text-background">
        {message.content}
      </div>
    );
  }

  if (message.error) {
    return (
      <div className="max-w-[90%] rounded-xl border border-danger-border bg-danger-surface px-3.5 py-2.5 text-sm text-danger">
        {message.content}
      </div>
    );
  }

  return (
    <div className="max-w-[92%]">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {message.content}
      </p>
      {message.generated && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
          <Sparkle width={13} height={13} />
          Generated {message.generated.files.length} files
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-muted">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-2 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-2 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-2" />
    </div>
  );
}
