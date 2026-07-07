"use client";

import { useState, useRef, useEffect } from "react";
import type { ModelSize } from "@/lib/types";
import { Signal, ChevronDown } from "./icons";

// The in-app model switcher. Each tier maps (server-side) to a Gemini model,
// cheapest → best. Defaults to the cheapest so testing stays inexpensive.
const OPTIONS: { value: ModelSize; label: string; hint: string }[] = [
  { value: "Low", label: "Flash Lite", hint: "Fastest · cheapest" },
  { value: "Medium", label: "Flash", hint: "Balanced" },
  { value: "High", label: "Pro", hint: "Highest quality" },
];

export default function ModelSizeSelector({
  value,
  onChange,
}: {
  value: ModelSize;
  onChange: (v: ModelSize) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Model"
        className="flex items-center gap-1.5 rounded-pill border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <Signal width={13} height={13} />
        {current.label}
        <ChevronDown width={12} height={12} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-1.5 w-44 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-pop">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left transition-colors hover:bg-surface-2"
            >
              <span className="flex items-center gap-2">
                <Signal width={13} height={13} className="text-muted" />
                <span
                  className={`text-xs ${
                    o.value === value ? "font-medium text-foreground" : "text-muted"
                  }`}
                >
                  {o.label}
                </span>
              </span>
              <span className="text-[10px] text-muted-2">{o.hint}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
