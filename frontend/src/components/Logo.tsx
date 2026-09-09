interface LogoProps {
  /** Show the "منهج" wordmark beside the mark. */
  withWordmark?: boolean;
  /** Pixel height of the mark itself. */
  size?: number;
  className?: string;
}

/**
 * The Manhaj mark: two swooshes (teal/green + light blue) crossing to form
 * an "M", with a small glow where the strokes meet. Pure SVG so it stays
 * crisp at any size and adapts to dark mode via currentColor / CSS vars,
 * instead of a raster asset with an invert-filter hack.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="منهج"
    >
      <defs>
        <linearGradient id="manhaj-teal" x1="4" y1="36" x2="26" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--teal-hover)" />
          <stop offset="1" stopColor="var(--teal)" />
        </linearGradient>
        <linearGradient id="manhaj-sky" x1="22" y1="8" x2="44" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--sky)" />
          <stop offset="1" stopColor="var(--navy)" />
        </linearGradient>
        <radialGradient id="manhaj-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--sky)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--sky)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* left swoosh: teal/green, rises then dips to the crossing point */}
      <path
        d="M5 37 C 5 30, 9 22, 15 22 C 20 22, 22 27, 24 27"
        stroke="url(#manhaj-teal)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* right swoosh: light blue into navy, mirrors down from the crossing point */}
      <path
        d="M24 21 C 26 21, 28 26, 33 26 C 39 26, 43 18, 43 11"
        stroke="url(#manhaj-sky)"
        strokeWidth="6.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* glow accent at the crossing point */}
      <circle cx="24" cy="24" r="7" fill="url(#manhaj-glow)" />
      <circle cx="24" cy="24" r="2.1" fill="var(--surface)" />
    </svg>
  );
}

export default function Logo({ withWordmark = true, size = 30, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span
          className="font-display font-bold text-foreground"
          style={{ fontSize: size * 0.62 }}
        >
          منهج
        </span>
      )}
    </span>
  );
}
