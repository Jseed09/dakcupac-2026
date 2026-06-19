import React from "react";

// Marlin brand mark — a stylized leaping marlin (long bill, sail dorsal fin,
// forked tail) drawn as a single scalable SVG so it stays crisp from favicon
// size up to the header. Defaults to the ocean-teal accent; pass `color` to
// recolor (e.g. white on the navy header).
export function MarlinMark({ size = 24, color = "#1aa0c4", className = "" }) {
  return (
    <svg
      viewBox="0 0 120 72"
      width={(size * 120) / 72}
      height={size}
      className={className}
      role="img"
      aria-label="Marlin"
      fill={color}
    >
      {/* forked tail */}
      <path d="M4 18 C16 28 16 30 22 34 C16 38 16 40 4 54 C18 48 26 42 30 36 C26 30 18 24 4 18 Z" />
      {/* body tapering into the long bill */}
      <path d="M26 36 C40 22 60 19 78 24 C88 27 98 31 116 35 L116 37 C98 41 88 45 78 48 C60 53 40 50 26 36 Z" />
      {/* tall sail dorsal fin */}
      <path d="M40 28 C46 8 64 4 76 10 C70 20 60 27 50 31 C46 30 42 29 40 28 Z" />
      {/* lower pectoral fin */}
      <path d="M58 42 C60 54 68 62 76 62 C70 52 68 46 66 41 C63 41 60 41 58 42 Z" />
      {/* eye (knockout) */}
      <circle cx="92" cy="34" r="3" fill="#16325c" />
    </svg>
  );
}

// Full lockup: mark + "Marlin" wordmark. Used in the app header.
export function MarlinLogo({ size = 22, markColor = "#1aa0c4", textColor = "#ffffff" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MarlinMark size={size} color={markColor} />
      <span className="font-bold tracking-tight" style={{ fontSize: size * 0.78, color: textColor }}>
        Marlin
      </span>
    </span>
  );
}
