import React from "react";
import marlinUrl from "../assets/marlin-source.jpeg";

// Source image is 571x396: the marlin on the left, a stray blue "M" at the far
// right (~x505+). These bounds crop tightly to the fish only, dropping the M.
const SRC_W = 571, SRC_H = 396;
const CROP_X = 72, CROP_Y = 74, CROP_W = 432, CROP_H = 222;

// The marlin mark — the user's actual logo artwork, cropped to the fish. The
// artwork is navy on a light ground, so it sits in a light rounded chip to stay
// visible on the navy header. Uses an <img> with margin offsets (reliable crop;
// maxWidth:none guards against global `img{max-width:100%}` rules).
export function MarlinMark({ height = 32, className = "" }) {
  const s = height / CROP_H;
  return (
    <span
      className={className}
      role="img"
      aria-label="Marlin"
      style={{
        display: "inline-block",
        width: CROP_W * s,
        height,
        overflow: "hidden",
        borderRadius: 6,
        background: "#eef1f5",
        lineHeight: 0,
      }}
    >
      <img
        src={marlinUrl}
        alt=""
        style={{
          width: SRC_W * s,
          height: SRC_H * s,
          maxWidth: "none",
          marginLeft: -CROP_X * s,
          marginTop: -CROP_Y * s,
          display: "block",
        }}
      />
    </span>
  );
}

// Full lockup: fish mark + bold "Marlin" wordmark. Used in the app header.
export function MarlinLogo({ height = 32, textColor = "#16325c" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MarlinMark height={height} />
      <span style={{ fontSize: height * 0.6, color: textColor, fontWeight: 800, letterSpacing: "-0.02em" }}>
        Marlin
      </span>
    </span>
  );
}
