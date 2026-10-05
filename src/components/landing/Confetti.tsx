const COLORS = [
  "oklch(0.82 0.13 200 / 0.95)",
  "oklch(0.9 0.08 200 / 0.9)",
  "oklch(0.78 0.12 215 / 0.85)",
  "oklch(0.95 0.02 220 / 0.8)",
];

/** احتفال هادئ واحترافي — انفجار خفيف من مركز النافذة */
export function Confetti({ pieces = 28 }: { pieces?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: pieces }).map((_, i) => {
        const angle = (i / pieces) * 360 + ((i * 17) % 40) - 20;
        const distance = 90 + ((i * 23) % 70);
        const delay = (i % 12) * 0.04;
        const duration = 1.6 + ((i * 11) % 7) / 10;
        const size = 5 + ((i * 5) % 6);
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: "50%",
              top: "45%",
              width: `${size}px`,
              height: `${size * 1.4}px`,
              background: COLORS[i % COLORS.length],
              "--angle": `${angle}deg`,
              "--distance": `${distance}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
