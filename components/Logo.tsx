// Swappable wordmark — the ONE place the product's name + mark live.
// Replace the <svg> mark and/or the word "Concept" here to rebrand everywhere.
// Minimal treatment on purpose (cf. getmocha.com).

type LogoProps = {
  /** Pixel size of the square mark. Text scales alongside it. */
  size?: number;
  /** Hide the wordmark, show only the mark (e.g. collapsed sidebar). */
  markOnly?: boolean;
  className?: string;
};

export default function Logo({ size = 22, markOnly = false, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Mark: a rounded square in the foreground color with a soft cutout
            ring — abstract + brandless, easy to swap. */}
        <rect width="24" height="24" rx="7" fill="var(--color-foreground)" />
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="var(--color-background)" strokeWidth="2" />
        <circle cx="12" cy="12" r="1.6" fill="var(--color-background)" />
      </svg>
      {!markOnly && (
        <span
          className="font-semibold tracking-tight text-foreground"
          style={{ fontSize: size * 0.82 }}
        >
          Concept
        </span>
      )}
    </span>
  );
}
