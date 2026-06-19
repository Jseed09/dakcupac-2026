import React from "react";
import marlinUrl from "../assets/marlin-source.jpeg";

// Source image is 571x396 with the marlin on the left and a stray "M" on the
// right. These bounds crop tightly to just the fish (dropping the M and the
// empty margins).
const SRC_W = 571, SRC_H = 396;
const CROP_X = 44, CROP_Y = 84, CROP_W = 436, CROP_H = 214;

// The marlin mark — the user's actual logo image, cropped to the fish only.
export function MarlinMark({ height = 28, rounded = true, className = "" }) {
  const s = height / CROP_H;
  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        width: CROP_W * s,
        height,
        backgroundImage: `url(${marlinUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${SRC_W * s}px ${SRC_H * s}px`,
        backgroundPosition: `${-CROP_X * s}px ${-CROP_Y * s}px`,
        borderRadius: rounded ? 6 : 0,
      }}
      role="img"
      aria-label="Marlin"
    />
  );
}

// Full lockup: fish mark + bold "Marlin" wordmark. Used in the app header.
export function MarlinLogo({ height = 30, textColor = "#16325c" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MarlinMark height={height} />
      <span style={{ fontSize: height * 0.66, color: textColor, fontWeight: 800, letterSpacing: "-0.02em" }}>
        Marlin
      </span>
    </span>
  );
}
