// Renders a representative "running app" screen inside the phone frame.
//
// We do NOT execute arbitrary generated React Native code (unsafe + heavy for a
// concept demo). Instead we render a clean, generic app screen themed from the
// generation result — app name + summary drive the header, and a mock layout
// stands in for the live UI. Swap this for react-native-web later if desired.
import type { GeneratedApp } from "@/lib/types";

function jsonName(files: GeneratedApp["files"], match: RegExp, pick: (j: any) => unknown) {
  for (const f of files) {
    if (match.test(f.path)) {
      try {
        const n = pick(JSON.parse(f.contents));
        if (n) return String(n);
      } catch {
        /* ignore malformed json */
      }
    }
  }
  return null;
}

function deriveMeta(app?: GeneratedApp): { name: string; tagline: string } {
  if (!app) return { name: "Your App", tagline: "Describe an app to see it here." };

  const tagline = app.summary.split(/[.\n]/)[0]?.trim() || "Built with Appening";

  // Prefer app.json's expo.name (usually properly cased), then package.json.
  const fromJson =
    jsonName(app.files, /app\.json$/, (j) => j?.expo?.name) ??
    jsonName(app.files, /package\.json$/, (j) => j?.name);

  if (fromJson) return { name: fromJson, tagline };

  // Fall back to a short first sentence of the summary.
  const first = app.summary.split(/[.\n]/)[0]?.trim() || "Your App";
  return { name: first.length <= 26 ? first : "Your App", tagline };
}

export default function AppPreview({ app }: { app?: GeneratedApp }) {
  const { name, tagline } = deriveMeta(app);

  return (
    <div className="flex min-h-full flex-col bg-surface">
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-9 pb-1 text-[11px] font-medium text-foreground">
        <span>9:41</span>
        <span className="tracking-tight text-muted">●●● ▲ ▮</span>
      </div>

      {/* header */}
      <div className="px-6 pt-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Today</p>
        <h2 className="mt-1 text-2xl font-bold leading-tight text-foreground">{name}</h2>
        <p className="mt-1 text-sm text-muted">{tagline}</p>
      </div>

      {/* hero stat card */}
      <div className="mx-5 mt-5 rounded-2xl bg-foreground p-5 text-background">
        <p className="text-xs font-medium opacity-70">This week</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">42.8</p>
        <div className="mt-4 flex gap-2">
          {[64, 40, 80, 52, 70].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end" style={{ height: 48 }}>
              <div className="rounded-full bg-background opacity-90" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* list items */}
      <div className="mt-5 space-y-2 px-5">
        {["Morning session", "Quick review", "Evening goal"].map((t, i) => (
          <div key={t} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2 text-sm font-semibold text-foreground">
              {i + 1}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-foreground">{t}</span>
              <span className="block text-xs text-muted">Tap to open</span>
            </span>
            <span className="text-muted-2">›</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* bottom tab bar */}
      <div className="mt-4 grid grid-cols-4 border-t border-border bg-surface px-2 pb-6 pt-3">
        {["Home", "Search", "Add", "You"].map((t, i) => (
          <div
            key={t}
            className={`flex flex-col items-center gap-1 text-[10px] ${
              i === 0 ? "text-foreground" : "text-muted-2"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-md ${i === 0 ? "bg-foreground" : "bg-surface-2"}`}
            />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
