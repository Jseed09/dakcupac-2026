import React from "react";

// Marlin brand mark — a sleek, minimal marlin (long bill, swept body, forked
// tail), matching the chosen Canva concept. Single scalable SVG; pass `color`
// to recolor (e.g. white/teal on the navy header, navy on light).
export function MarlinMark({ size = 24, color = "#16325c", className = "" }) {
  return (
    <svg
      viewBox="0 0 140 80"
      width={(size * 140) / 80}
      height={size}
      className={className}
      role="img"
      aria-label="Marlin"
      fill={color}
    >
      {/* sleek body: bill (upper-left) sweeping through to a forked tail (right) */}
      <path d="M10 32 C30 30 48 32 64 40 C70 24 80 16 92 16 C86 28 78 36 70 42 C84 44 100 46 116 42 L136 28 C128 38 124 42 120 46 L134 62 C118 52 102 52 88 54 C72 58 50 54 34 46 C24 42 16 38 10 32 Z" />
      {/* swept pectoral fin */}
      <path d="M64 44 C64 56 70 66 78 68 C74 58 72 50 72 44 C69 44 66 44 64 44 Z" />
    </svg>
  );
}

// Full lockup: mark + bold "Marlin" wordmark. Used in the app header.
export function MarlinLogo({ size = 22, markColor = "#16325c", textColor = "#16325c" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MarlinMark size={size} color={markColor} />
      <span style={{ fontSize: size * 0.92, color: textColor, fontWeight: 800, letterSpacing: "-0.02em" }}>
        Marlin
      </span>
    </span>
  );
}
