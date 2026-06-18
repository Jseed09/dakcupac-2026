import React from "react";
import { HEALTH } from "./helpers.js";

// Salesforce-style colored object icon (rounded square, white glyph).
export function ObjIcon({ icon: Icon, hue = "#1971c2", size = 32 }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md shrink-0"
      style={{ background: hue, width: size, height: size }}>
      <Icon size={size * 0.55} color="#fff" strokeWidth={2} />
    </span>
  );
}

export function Pill({ children, bg, fg }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ background: bg, color: fg }}>{children}</span>
  );
}

export function HealthPill({ h }) {
  const s = HEALTH[h];
  return <Pill bg={s.bg} fg={s.fg}>{s.label}</Pill>;
}

export function Card({ title, action, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2 text-[#181818] font-semibold text-sm">
            {Icon && <Icon size={15} className="text-[#706e6b]" />}{title}
          </div>
          {action}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
