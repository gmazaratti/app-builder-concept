"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowRight, Image as ImageIcon } from "./icons";

// The hero "prompt input" card. Submitting routes to /compose with the prompt,
// which the compose screen picks up and sends to /api/generate automatically.
export default function HeroPrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit() {
    const prompt = value.trim();
    const url = prompt ? `/compose?prompt=${encodeURIComponent(prompt)}` : "/compose";
    router.push(url);
  }

  return (
    <div className="card mx-auto w-full max-w-2xl rounded-xl p-2 shadow-card">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder="Describe the app you want to build…"
        rows={3}
        className="w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-[15px] text-foreground placeholder:text-muted-2 focus:outline-none"
      />
      <div className="flex items-center justify-between px-1.5 pb-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex h-8 w-8 items-center justify-center rounded-pill text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Plus width={18} height={18} />
          </button>
          <button
            type="button"
            aria-label="Add image"
            className="flex h-8 w-8 items-center justify-center rounded-pill text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <ImageIcon width={17} height={17} />
          </button>
        </div>
        <button type="button" onClick={submit} className="btn-primary">
          Build now
          <ArrowRight width={15} height={15} />
        </button>
      </div>
    </div>
  );
}
