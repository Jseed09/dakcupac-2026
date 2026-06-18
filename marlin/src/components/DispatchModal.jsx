import React, { useEffect, useState } from "react";
import { Navigation, X, MapPin, Wrench, CalendarClock } from "lucide-react";
import { boat, owner } from "../lib/helpers.js";
import { TECHS, SERVICE_WINDOWS } from "../data/seed.js";

export default function DispatchModal({ dispatch, onSubmit, onClose }) {
  const b = boat(dispatch.boatId);
  const [tech, setTech] = useState(TECHS[0]);
  const [location, setLocation] = useState(b.location);
  const [when, setWhen] = useState(SERVICE_WINDOWS[0]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Dispatch a tech to ${b.name}`} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#eef0f2] flex items-center gap-2">
          <Navigation size={16} className="text-[#0a6e8c]" />
          <span className="font-bold">Dispatch a tech · "{b.name}"</span>
          <button onClick={onClose} aria-label="Close" className="ml-auto p-1 rounded hover:bg-[#f3f3f3]"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-[13px] text-[#5f6368]">
            We go to the boat. Pick who, where, and when. {owner(dispatch.boatId).name} gets a text with the details, no call needed.
          </p>
          {dispatch.reason && (
            <div className="bg-[#f7fbfd] border border-[#dcebf1] rounded-md px-3 py-2 text-[13px] text-[#3a3a3a]">{dispatch.reason}</div>
          )}

          <div>
            <label className="text-[11px] uppercase tracking-wide text-[#9aa0a6] font-semibold">Technician</label>
            <div className="flex items-center gap-2 mt-1 border border-[#dcebf1] rounded-md px-3 h-10 bg-[#f7fbfd]">
              <Wrench size={15} className="text-[#9aa0a6]" />
              <select value={tech} onChange={(e) => setTech(e.target.value)} className="bg-transparent outline-none text-[14px] w-full">
                {TECHS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wide text-[#9aa0a6] font-semibold">Meet at</label>
            <div className="flex items-center gap-2 mt-1 border border-[#dcebf1] rounded-md px-3 h-10 bg-[#f7fbfd]">
              <MapPin size={15} className="text-[#9aa0a6]" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent outline-none text-[14px] w-full" />
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wide text-[#9aa0a6] font-semibold">Window</label>
            <div className="flex items-center gap-2 mt-1 border border-[#dcebf1] rounded-md px-3 h-10 bg-[#f7fbfd]">
              <CalendarClock size={15} className="text-[#9aa0a6]" />
              <select value={when} onChange={(e) => setWhen(e.target.value)} className="bg-transparent outline-none text-[14px] w-full">
                {SERVICE_WINDOWS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={() => onSubmit({ boatId: dispatch.boatId, tech, location, window: when })} className="flex-1 bg-[#1aa0c4] hover:bg-[#1690b0] text-white text-sm font-semibold rounded-md h-9">
              Dispatch and notify
            </button>
            <button onClick={onClose} className="border border-[#d0d0d0] text-[#5f6368] text-sm font-semibold rounded-md px-3 h-9 hover:bg-[#f7f7f7]">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
