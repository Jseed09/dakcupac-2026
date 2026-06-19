import React from "react";

// Marlin brand mark — a stylized leaping marlin (long bill, sail dorsal fin,
// forked tail) drawn as a single scalable SVG so it stays crisp from favicon
// size up to the header. Defaults to the ocean-teal accent; pass `color` to
// recolor (e.g. white on the navy header).
export function MarlinMark({ size = 24, color = "#1aa0c4", className = "" }) {
  return (
    <svg
      viewBox="0 0 128 72"
      width={(size * 128) / 72}
      height={size}
      className={className}
      role="img"
      aria-label="Marlin"
      fill={color}
    >
      {/* upper + lower lunate (crescent) tail flukes */}
      <path d="M22 35 C16 28 12 22 8 15 C16 21 20 27 24 33 Z" />
      <path d="M22 37 C16 44 12 50 8 57 C16 51 20 45 24 39 Z" />
      {/* deep body tapering into the long spear bill */}
      <path d="M22 34 C32 24 46 20 64 21 C76 22 86 25 98 29 L126 31 L126 33 L98 34 C86 38 76 41 64 42 C46 44 32 42 22 38 Z" />
      {/* tall pointed first dorsal fin */}
      <path d="M48 25 C54 9 66 5 82 8 C74 15 64 21 54 26 C52 26 50 26 48 25 Z" />
      {/* long swept pectoral fin */}
      <path d="M80 34 C84 45 82 55 74 61 C76 51 74 43 72 36 C75 35 78 34 80 34 Z" />
      {/* eye (knockout) */}
      <circle cx="110" cy="31" r="2.6" fill="#16325c" />
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
