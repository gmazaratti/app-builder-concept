import Navbar from "@/components/Navbar";
import HeroPrompt from "@/components/HeroPrompt";
import LandingShowcase from "@/components/LandingShowcase";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";
import { Sparkle, Compass, Rocket } from "@/components/icons";

const STEPS = [
  {
    icon: Sparkle,
    title: "Describe it",
    body: "Write what you want in plain English. No setup, no boilerplate, no config files.",
  },
  {
    icon: Compass,
    title: "Watch it build",
    body: "The agent generates a real starter app — screens, components, and structure — in seconds.",
  },
  {
    icon: Rocket,
    title: "Make it yours",
    body: "Edit the files, preview on a phone, and keep iterating until it feels right.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto px-6 pb-10 pt-20 text-center" style={{ maxWidth: "var(--page-max)" }}>
        <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Describe an app.
          <br />
          Get a real one back.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-muted">
          Appening is an AI agent that turns a sentence into a working mobile app —
          screens, code, and a live preview you can shape.
        </p>

        <div className="mt-9">
          <HeroPrompt />
          <p className="mt-3 text-xs text-muted-2">
            Free to try · No account needed for the demo
          </p>
        </div>
      </section>

      {/* Product showcase */}
      <section className="mx-auto px-6 pb-16" style={{ maxWidth: "var(--page-max)" }}>
        <Reveal>
          <LandingShowcase />
        </Reveal>
      </section>

      {/* Brand marquee (placeholder) */}
      <section className="mx-auto px-6 pb-20" style={{ maxWidth: "var(--page-max)" }}>
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-muted-2">
          Building the next generation of apps
        </p>
        <Marquee />
      </section>

      {/* How it works (scroll-reveal) */}
      <section
        className="mx-auto px-6"
        style={{ maxWidth: "var(--page-max)", paddingBottom: "var(--section-y)" }}
      >
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From idea to app in three steps
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="card h-full rounded-xl p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2 text-foreground">
                  <s.icon width={20} height={20} />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div
          className="mx-auto flex flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row"
          style={{ maxWidth: "var(--page-max)" }}
        >
          <Logo size={20} />
          <p className="text-xs text-muted-2">
            Appening — a demo. Unbranded placeholder, themeable end to end.
          </p>
        </div>
      </footer>
    </main>
  );
}
