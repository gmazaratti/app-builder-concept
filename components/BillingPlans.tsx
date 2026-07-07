"use client";

import { useState } from "react";
import { currentUser } from "@/lib/user";
import { Check, ArrowRight } from "./icons";

type Plan = {
  name: string;
  tagline: string;
  monthly: number; // 0 = free
  credits: string;
  cta: string;
  popular?: boolean;
  inherit?: string;
  features: string[];
};

// Our own plans — an AI app builder, priced in generation credits.
const PLANS: Plan[] = [
  {
    name: "Free",
    tagline: "Kick the tires",
    monthly: 0,
    credits: "30 credits / mo",
    cta: "Get started",
    features: ["2 projects", "Web preview", "Working file browser", "Community support"],
  },
  {
    name: "Builder",
    tagline: "For indie makers",
    monthly: 19,
    credits: "300 credits / mo",
    cta: "Get Builder",
    popular: true,
    inherit: "Free",
    features: [
      "Unlimited projects",
      "Multi-device preview",
      "Code export",
      "Priority generation",
      "Email support",
    ],
  },
  {
    name: "Studio",
    tagline: "For teams shipping fast",
    monthly: 49,
    credits: "1,000 credits / mo",
    cta: "Get Studio",
    inherit: "Builder",
    features: ["GitHub sync", "Shared workspaces", "Custom system prompts", "Remove Appening badge"],
  },
];

function Price({ monthly, yearly }: { monthly: number; yearly: boolean }) {
  if (monthly === 0) {
    return (
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">$0</span>
        <span className="text-sm text-muted">/mo</span>
      </div>
    );
  }
  const perMonth = yearly ? Math.round((monthly * 10) / 12) : monthly;
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">${perMonth}</span>
        <span className="text-sm text-muted">/mo</span>
      </div>
      {yearly && (
        <p className="mt-1 text-xs text-muted">
          billed ${monthly * 10}/yr ·{" "}
          <span className="font-medium text-foreground">save ${monthly * 2}</span>
        </p>
      )}
    </div>
  );
}

export default function BillingPlans() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      {/* header + toggle */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Pricing</h1>
          <p className="mt-1.5 text-sm text-muted">
            Start free. Upgrade when your ideas outgrow it.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-pill border border-border bg-surface p-1 text-sm">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`rounded-pill px-3 py-1 font-medium transition-colors ${
              !yearly ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`flex items-center gap-1.5 rounded-pill px-3 py-1 font-medium transition-colors ${
              yearly ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            }`}
          >
            Yearly
            <span
              className={`rounded-pill px-1.5 py-0.5 text-[10px] font-semibold ${
                yearly ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted"
              }`}
            >
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* plan cards */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.name === currentUser.plan;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-surface p-6 ${
                plan.popular ? "border-foreground shadow-card" : "border-border"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-pill bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background">
                  Most popular
                </span>
              )}

              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-foreground">{plan.name}</h2>
                <span className="text-xs text-muted">{plan.tagline}</span>
              </div>

              <div className="mt-4">
                <Price monthly={plan.monthly} yearly={yearly} />
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">{plan.credits}</p>

              <button
                type="button"
                disabled={isCurrent}
                className={`mt-5 w-full rounded-pill px-4 py-2.5 text-sm font-medium transition-transform ${
                  isCurrent
                    ? "cursor-default border border-border bg-surface-2 text-muted"
                    : plan.popular
                      ? "bg-primary text-primary-foreground hover:scale-[1.01]"
                      : "border border-border text-foreground hover:bg-surface-2"
                }`}
              >
                {isCurrent ? "Current plan" : plan.cta}
              </button>

              <div className="mt-6 space-y-2.5 text-sm">
                {plan.inherit && (
                  <p className="text-xs text-muted">
                    Everything in <span className="font-medium text-foreground">{plan.inherit}</span>, plus:
                  </p>
                )}
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-muted">
                    <Check width={16} height={16} className="mt-0.5 shrink-0 text-foreground" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise band (the one dark surface here) */}
      <div className="mt-5 overflow-hidden rounded-2xl bg-dark-surface p-7 text-dark-foreground">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 className="text-xl font-semibold">Enterprise</h2>
            <p className="mt-1 text-sm text-dark-muted">
              For high-volume teams and organizations that need scale, control, and support.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {["Unlimited credits", "SSO & SAML", "Dedicated support", "Audit logs"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-dark-muted">
                  <Check width={15} height={15} className="shrink-0 text-accent" />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <div className="text-sm text-dark-muted">
              Starting at <span className="text-2xl font-bold text-dark-foreground">Custom</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-pill bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02]"
            >
              Contact sales
              <ArrowRight width={15} height={15} />
            </button>
          </div>
        </div>
      </div>

      {/* footnote */}
      <p className="mt-8 text-center text-sm text-muted">
        Building something bigger?{" "}
        <a href="#" className="font-medium text-foreground underline-offset-2 hover:underline">
          Talk to us
        </a>
        .
      </p>
    </div>
  );
}
