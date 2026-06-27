"use client";

import { useState, type ComponentType, type SVGProps } from "react";
import Modal from "./Modal";
import { Sparkle, Rocket, Devices, Code, MessageSquare, ArrowRight, ArrowLeft } from "./icons";

type Step = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  tip: string;
};

// A step-by-step "how to build an app" walkthrough with a tip on each step.
const STEPS: Step[] = [
  {
    icon: Sparkle,
    title: "Describe your idea",
    body: "On the home screen or in a project's chat, tell the agent what you want in plain English — the kind of app, its main screens, and the feel you're after.",
    tip: 'Be specific: "a habit tracker with a weekly streak and a calm home screen" beats "a tracker."',
  },
  {
    icon: Rocket,
    title: "Watch it generate",
    body: "In a few seconds the agent returns a real Expo / React Native starter — a short summary plus the actual project files, ready to explore.",
    tip: "Name two or three key features up front for a richer first build.",
  },
  {
    icon: Devices,
    title: "Preview on any device",
    body: "Use the Preview stage and the device selector to see your app on an iPhone, Pixel, or iPad — the layout reflows live as you switch.",
    tip: "Flip between devices to catch spacing and overflow issues early.",
  },
  {
    icon: Code,
    title: "Read the real code",
    body: "Open the Files explorer and click any file to read its code in the stage. App.tsx is the entry point — nothing is hidden behind a paywall.",
    tip: "Follow the imports from App.tsx to understand how the app fits together.",
  },
  {
    icon: MessageSquare,
    title: "Iterate in chat",
    body: "Keep chatting to refine — add a screen, change the colors, tweak the data. Collapse the chat panel any time you want more room to preview.",
    tip: "Small, specific asks land better than one giant message.",
  },
];

export default function TutorialModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const Icon = step.icon;
  const last = i === STEPS.length - 1;

  const close = () => {
    onClose();
    setTimeout(() => setI(0), 200);
  };

  return (
    <Modal open={open} onClose={close} title="How to build an app" maxWidth="max-w-lg">
      <div className="min-h-[230px]">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-foreground">
          <Icon width={22} height={22} />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>

        <div className="mt-4 flex gap-2.5 rounded-lg border border-border bg-surface-2 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            <span className="rounded bg-accent px-1.5 py-0.5">Tip</span>
          </span>
          <p className="text-sm text-foreground">{step.tip}</p>
        </div>
      </div>

      {/* Footer: progress + navigation */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          className="flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
        >
          <ArrowLeft width={15} height={15} />
          Back
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((_, n) => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? "w-5 bg-foreground" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        {last ? (
          <button type="button" onClick={close} className="btn-primary">
            Get started
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setI((n) => Math.min(STEPS.length - 1, n + 1))}
            className="btn-primary"
          >
            Next
            <ArrowRight width={15} height={15} />
          </button>
        )}
      </div>
    </Modal>
  );
}
