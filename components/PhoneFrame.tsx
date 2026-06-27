// A styled device frame. Renders children as the screen content.
// Accepts device dimensions so the compose preview can switch between an
// iPhone, a Pixel, an iPad, etc. Used by the compose Preview tab and the
// landing product mock (which passes only `scale`).
import type { ReactNode } from "react";

export default function PhoneFrame({
  children,
  className = "",
  scale = 1,
  width = 300,
  height = 620,
  radius = 44,
  notch = true,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
  width?: number;
  height?: number;
  radius?: number;
  notch?: boolean;
}) {
  const w = width * scale;
  const h = height * scale;
  const r = radius * scale;
  const bezel = 10 * scale;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: w, height: h }}>
      <div
        className="absolute inset-0 bg-foreground shadow-card"
        style={{ borderRadius: r, padding: bezel }}
      >
        <div
          className="relative h-full w-full overflow-hidden bg-surface"
          style={{ borderRadius: Math.max(r - bezel, 6) }}
        >
          {/* notch (omitted for tablets / home-button devices) */}
          {notch && (
            <div
              className="absolute left-1/2 z-10 -translate-x-1/2 rounded-pill bg-foreground"
              style={{ top: 8 * scale, height: 22 * scale, width: 110 * scale }}
            />
          )}
          {/* screen content */}
          <div className="scroll-thin h-full w-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
