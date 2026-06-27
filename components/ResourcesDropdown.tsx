// The Resources mega-dropdown.
//
// Light, on-theme styling (matches the rest of the surface — not a dark panel).
// Content is specific to Concept (an AI mobile-app builder): ways to build
// faster + ways to learn, plus a Pro promo. This is intentionally NOT a clone
// of any reference site's menu.

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  Layers,
  Blocks,
  Plug,
  Compass,
  Book,
  Sparkle,
  Rocket,
  ArrowRight,
} from "./icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type DropLink = { icon: Icon; title: string; subtitle: string; href: string };
type DropColumn = { label: string; links: DropLink[] };

// Edit these to change the dropdown contents.
const COLUMNS: DropColumn[] = [
  {
    label: "Build",
    links: [
      { icon: Layers, title: "Templates", subtitle: "Start from a ready-made app", href: "#" },
      { icon: Blocks, title: "Components", subtitle: "Drop-in UI building blocks", href: "#" },
      { icon: Plug, title: "Integrations", subtitle: "Connect APIs and data", href: "#" },
    ],
  },
  {
    label: "Learn",
    links: [
      { icon: Compass, title: "Guides", subtitle: "Ship your first app step by step", href: "#" },
      { icon: Book, title: "Docs", subtitle: "Reference and setup", href: "#" },
      { icon: Sparkle, title: "Changelog", subtitle: "See what's new", href: "#" },
    ],
  },
];

const PROMO = {
  title: "Publish with Concept Pro",
  body: "Take a generated app to the App Store and Play Store in a few clicks.",
  cta: "See Pro",
  href: "#",
};

function LinkRow({ icon: Icon, title, subtitle, href }: DropLink) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-md px-2.5 py-2 transition-colors hover:bg-surface-2"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors group-hover:border-muted-2">
        <Icon width={17} height={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="block text-xs text-muted">{subtitle}</span>
      </span>
    </Link>
  );
}

export default function ResourcesDropdown() {
  return (
    <div className="grid w-[640px] grid-cols-[1fr_1fr_1.05fr] gap-2 rounded-xl border border-border bg-surface p-3 shadow-card">
      {COLUMNS.map((col) => (
        <div key={col.label} className="px-1">
          <div className="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-2">
            {col.label}
          </div>
          <div className="flex flex-col">
            {col.links.map((l) => (
              <LinkRow key={l.title} {...l} />
            ))}
          </div>
        </div>
      ))}

      {/* Promo card with accent pill CTA */}
      <Link
        href={PROMO.href}
        className="flex flex-col justify-between rounded-lg bg-surface-2 p-4 transition-colors hover:bg-border"
      >
        <div>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
            <Rocket width={18} height={18} />
          </span>
          <div className="mt-3 text-[15px] font-semibold leading-snug text-foreground">
            {PROMO.title}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{PROMO.body}</p>
        </div>
        <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-pill bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
          {PROMO.cta}
          <ArrowRight width={13} height={13} />
        </span>
      </Link>
    </div>
  );
}
