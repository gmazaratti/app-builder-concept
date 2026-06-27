"use client";

import { useState, useRef, useEffect } from "react";
import type { ModelSize } from "@/lib/types";
import { Signal, ChevronDown } from "./icons";

const SIZES: ModelSize[] = ["Low", "Medium", "High"];

// Small model-size selector shown in the compose input. Cosmetic for now —
// the value is sent to /api/generate but doesn't change models yet.
export default function ModelSizeSelector({
  value,
  onChange,
}: {
  value: ModelSize;
  onChange: (v: ModelSize) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-1.5 rounded-pill border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <Signal width={13} height={13} />
        {value}
        <ChevronDown width={12} height={12} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-1.5 w-32 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-card">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-2 ${
                s === value ? "font-medium text-foreground" : "text-muted"
              }`}
            >
              <Signal width={13} height={13} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
