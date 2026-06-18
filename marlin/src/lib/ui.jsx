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

// Salesforce-style Path: chevron segments for a record's stages. Completed are
// filled in the link teal, the current stage is the deep hull, the rest are grey.
export function Path({ stages, current, onAdvance, advanceLabel }) {
  const clipFor = (i) => {
    const last = i === stages.length - 1;
    if (i === 0) return "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%)";
    if (last) return "polygon(0 0, 100% 0, 100% 100%, 0 100%, 13px 50%)";
    return "polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%)";
  };
  return (
    <div className="flex items-stretch gap-2">
      <div className="flex-1 flex items-stretch min-w-0">
        {stages.map((s, i) => {
          const done = i < current, active = i === current;
          const bg = done ? "#0176d3" : active ? "#16325c" : "#e8eaec";
          const fg = done || active ? "#ffffff" : "#5f6368";
          return (
            <div key={s} className="relative flex-1 min-w-0" style={{ marginLeft: i === 0 ? 0 : -13 }}>
              <div className="h-9 flex items-center justify-center text-[11px] font-semibold px-3 truncate"
                style={{ background: bg, color: fg, clipPath: clipFor(i), paddingLeft: i === 0 ? 12 : 18 }}
                title={s}>
                {s}
              </div>
            </div>
          );
        })}
      </div>
      {onAdvance && current < stages.length - 1 && (
        <button onClick={onAdvance} className="shrink-0 border border-[#d0d0d0] text-[#0176d3] text-[12px] font-semibold rounded-md px-3 h-9 hover:bg-[#f7fbfd] whitespace-nowrap">
          {advanceLabel || `Mark ${stages[current + 1]}`}
        </button>
      )}
    </div>
  );
}

export function Card({ title, action, children, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg border border-[#dddbda] shadow-[0_2px_2px_rgba(0,0,0,0.05)]">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#dddbda]">
          <div className="flex items-center gap-2 text-[#080707] font-bold text-[15px]">
            {Icon && <Icon size={15} className="text-[#706e6b]" />}{title}
          </div>
          {action}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

// Salesforce-style data table shell: subtle header, hover rows, SLDS borders,
// and a trailing row-action chevron column. cols is an array of header labels;
// rows render via the children render function for full control.
export function DataTable({ cols, children }) {
  return (
    <div className="bg-white rounded-lg border border-[#dddbda] shadow-[0_2px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#fafaf9] border-b border-[#dddbda] text-[#514f4d] text-[12px]">
            {cols.map((c) => <th key={c} className="text-left font-semibold px-4 py-2.5 whitespace-nowrap">{c}</th>)}
            <th className="w-10 px-2 py-2.5" aria-label="Row actions" />
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
