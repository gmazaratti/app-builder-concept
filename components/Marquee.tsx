// Placeholder brand marquee (Rocket-style) — greyed dummy wordmarks scrolling.
// Swap PLACEHOLDER_BRANDS for real logos when there's something to show.
const PLACEHOLDER_BRANDS = [
  "Northwind",
  "Lumen",
  "Foundry",
  "Caldera",
  "Vantage",
  "Orbit",
  "Helio",
  "Junction",
];

export default function Marquee() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const items = [...PLACEHOLDER_BRANDS, ...PLACEHOLDER_BRANDS];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-14">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="select-none whitespace-nowrap text-lg font-semibold tracking-tight text-muted-2"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
