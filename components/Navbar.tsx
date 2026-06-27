"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Logo from "./Logo";
import ResourcesDropdown from "./ResourcesDropdown";
import { ChevronDown, ArrowRight } from "./icons";

export default function Navbar() {
  const [openResources, setOpenResources] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Small open/close delay so the pointer can travel from trigger to panel.
  const open = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenResources(true);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenResources(false), 120);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <nav
        className="mx-auto flex items-center justify-between px-6"
        style={{ maxWidth: "var(--page-max)", height: "var(--nav-height)" }}
      >
        {/* Left: logo */}
        <Link href="/" className="flex items-center" aria-label="Concept home">
          <Logo />
        </Link>

        {/* Center: nav links */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          <Link href="#" className="btn-ghost">
            Pricing
          </Link>
          <Link href="#" className="btn-ghost">
            Blog
          </Link>

          {/* Resources trigger + mega-dropdown */}
          <div
            className="relative"
            onMouseEnter={open}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              className="btn-ghost"
              aria-expanded={openResources}
              onClick={() => setOpenResources((v) => !v)}
            >
              Resources
              <ChevronDown
                width={15}
                height={15}
                className={`transition-transform duration-200 ${openResources ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-150 ${
                openResources
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <ResourcesDropdown />
            </div>
          </div>
        </div>

        {/* Right: primary CTA */}
        <Link href="/dashboard" className="btn-primary">
          Start building
          <ArrowRight width={15} height={15} />
        </Link>
      </nav>
    </header>
  );
}
