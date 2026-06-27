"use client";

import { useState, useRef, useEffect } from "react";
import { Devices as DevicesIcon, ChevronDown } from "./icons";

export type Device = {
  id: string;
  label: string;
  w: number;
  h: number;
  radius: number;
  notch: boolean;
};

// Preview device presets. `w`/`h` are the framed pixel sizes (chosen to fit the
// preview pane); the AppPreview content reflows to whatever size it's given.
export const DEVICES: Device[] = [
  { id: "iphone15", label: "iPhone 15", w: 300, h: 620, radius: 44, notch: true },
  { id: "iphonese", label: "iPhone SE", w: 286, h: 508, radius: 30, notch: false },
  { id: "pixel8", label: "Pixel 8", w: 300, h: 638, radius: 38, notch: true },
  { id: "ipadmini", label: "iPad mini", w: 468, h: 624, radius: 30, notch: false },
];

export function getDevice(id: string): Device {
  return DEVICES.find((d) => d.id === id) ?? DEVICES[0];
}

export default function DeviceSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getDevice(value);

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
        <DevicesIcon width={14} height={14} />
        {current.label}
        <ChevronDown width={12} height={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-40 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-pop">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                onChange(d.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-2 ${
                d.id === value ? "font-medium text-foreground" : "text-muted"
              }`}
            >
              {d.label}
              <span className="text-[10px] text-muted-2">
                {d.w}×{d.h}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
