import React from "react";
import marlinUrl from "../assets/marlin.png";

// Transparent marlin artwork, pre-cropped to the fish (471x209).
const IMG_W = 471, IMG_H = 209;

// The marlin mark. The artwork is navy on transparent; `tone="light"` recolors
// it to white via a CSS filter so it reads on the navy header, `tone="dark"`
// leaves it navy for light backgrounds.
export function MarlinMark({ height = 30, tone = "dark", className = "" }) {
  return (
    <img
      src={marlinUrl}
      alt="Marlin"
      className={className}
      style={{
        height,
        width: (height * IMG_W) / IMG_H,
        maxWidth: "none",
        display: "block",
        filter: tone === "light" ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

// Full lockup: fish mark + bold "Marlin" wordmark. Used in the app header.
export function MarlinLogo({ height = 26, tone = "dark", textColor = "#16325c" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MarlinMark height={height} tone={tone} />
      <span style={{ fontSize: height * 0.78, color: textColor, fontWeight: 800, letterSpacing: "-0.02em" }}>
        Marlin
      </span>
    </span>
  );
}
