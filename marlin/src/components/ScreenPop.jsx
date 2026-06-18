import React, { useEffect } from "react";
import { Phone, X, Ship, Star } from "lucide-react";
import { ObjIcon, Pill, HealthPill } from "../lib/ui.jsx";
import { boat, owner, money } from "../lib/helpers.js";
import { FORECAST } from "../data/seed.js";

export default function ScreenPop({ boatId, onClose, onOpen }) {
  const b = boat(boatId);
  const o = owner(boatId);
  const open = (FORECAST[boatId] ?? []).filter((f) => f.tier === "Needed");
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-end p-4 sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Incoming call about ${b.name}`} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-slidein">
        <div className="bg-[#16325c] text-white px-4 py-3 flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-[#0176d3] grid place-items-center"><Phone size={16} /></span>
          <div className="flex-1">
            <div className="text-[11px] text-white/70 uppercase tracking-wide">Incoming call</div>
            <div className="font-bold">{o.phone}</div>
          </div>
          <button onClick={onClose} aria-label="Dismiss call" className="p-1 rounded hover:bg-white/10"><X size={18} /></button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <ObjIcon icon={Ship} hue={b.hue} size={40} />
            <div>
              <div className="text-[18px] font-bold leading-tight">{o.name}</div>
              <div className="text-[13px] text-[#0176d3] font-semibold">"{b.name}" · {b.engine}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            <HealthPill h={b.health} />
            {b.membership !== "None" && <Pill bg="#efe9fb" fg="#5f3dc4"><Star size={11} /> {b.membership}</Pill>}
            <Pill bg="#eef0f2" fg="#5f6368">Customer since {o.since}</Pill>
          </div>

          {open.length > 0 && (
            <div className="mt-3 bg-[#fff8f8] border border-[#f3d6d6] rounded-md p-3">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#b42121] mb-1">Open items</div>
              {open.map((f, i) => (
                <div key={i} className="text-[13px] text-[#3a3a3a]">• {f.item} <span className="text-[#9aa0a6]">({f.price ? money(f.price) : "safety"})</span></div>
              ))}
            </div>
          )}

          <div className="mt-3 bg-[#f7fbfd] border border-[#dcebf1] rounded-md p-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#0176d3] mb-1">Talk track</div>
            <div className="text-[13px] text-[#3a3a3a] italic">
              "Hey {o.name.split(" ")[0]}, how's "{b.name}" treating you? She's at {b.hours} hours.
              {open.length ? ` While I've got you, the ${open[0].item.toLowerCase()} is due. Want me to get her in?` : " Anything I can do for you today?"}"
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => onOpen(boatId)} className="flex-1 bg-[#0176d3] hover:bg-[#015fb0] text-white text-sm font-semibold rounded-md h-9">Open record</button>
            <button onClick={onClose} className="border border-[#d0d0d0] text-[#5f6368] text-sm font-semibold rounded-md px-3 h-9 hover:bg-[#f7f7f7]">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}
