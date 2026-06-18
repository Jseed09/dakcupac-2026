import React, { useEffect, useState } from "react";
import { Gauge, X, Ship } from "lucide-react";
import { BOATS } from "../data/seed.js";
import { hoursDue } from "../lib/helpers.js";

export default function IntakeModal({ boatHours, onSubmit, onClose }) {
  const [boatId, setBoatId] = useState(BOATS[0].id);
  const [hours, setHours] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const b = BOATS.find((x) => x.id === boatId);
  const current = boatHours[boatId] ?? b.hours;
  const entered = hours === "" ? null : Number(hours);
  const preview = entered != null && !Number.isNaN(entered) ? hoursDue(b, entered) : null;
  const valid = entered != null && !Number.isNaN(entered) && entered >= current;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Log engine hours" onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#eef0f2] flex items-center gap-2">
          <Gauge size={16} className="text-[#0a6e8c]" />
          <span className="font-bold">Log engine hours</span>
          <button onClick={onClose} aria-label="Close" className="ml-auto p-1 rounded hover:bg-[#f3f3f3]"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-[13px] text-[#5f6368]">
            Owner or tech enters the boat by hull ID and current hours. We re-check what is due right away.
          </p>

          <div>
            <label className="text-[11px] uppercase tracking-wide text-[#9aa0a6] font-semibold">Boat (hull ID)</label>
            <div className="flex items-center gap-2 mt-1 border border-[#dcebf1] rounded-md px-3 h-10 bg-[#f7fbfd]">
              <Ship size={15} className="text-[#9aa0a6]" />
              <select value={boatId} onChange={(e) => { setBoatId(e.target.value); setHours(""); }} className="bg-transparent outline-none text-[14px] w-full">
                {BOATS.map((x) => <option key={x.id} value={x.id}>{`"${x.name}" · ${x.hin}`}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wide text-[#9aa0a6] font-semibold">Current engine hours</label>
            <input type="number" inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} placeholder={`${current} or higher`} className="w-full mt-1 border border-[#dcebf1] rounded-md px-3 h-10 bg-[#f7fbfd] outline-none text-[14px]" />
            <div className="text-[11px] text-[#9aa0a6] mt-1">Last reading on file: {current} hrs.</div>
          </div>

          {preview && (
            <div className={"rounded-md px-3 py-2 text-[13px] " + (preview.due ? "bg-[#fde7e7] text-[#b42121]" : preview.soon ? "bg-[#fff4e0] text-[#9a5b00]" : "bg-[#e6f4ea] text-[#1b6b34]")}>
              {preview.due
                ? `Service is due. Past the ${b.hoursInterval}-hour interval (due at ${preview.dueAt} hrs).`
                : preview.soon
                  ? `Service is coming up. ${preview.remaining} hrs to the next interval.`
                  : `On track. ${preview.remaining} hrs until the next interval.`}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button disabled={!valid} onClick={() => onSubmit(boatId, entered)} className={"flex-1 text-white text-sm font-semibold rounded-md h-9 " + (valid ? "bg-[#1aa0c4] hover:bg-[#1690b0]" : "bg-[#9fd0de] cursor-not-allowed")}>
              Save reading
            </button>
            <button onClick={onClose} className="border border-[#d0d0d0] text-[#5f6368] text-sm font-semibold rounded-md px-3 h-9 hover:bg-[#f7f7f7]">Cancel</button>
          </div>
          {entered != null && !valid && <div className="text-[11px] text-[#b42121]">Hours cannot go below the last reading of {current}.</div>}
        </div>
      </div>
    </div>
  );
}
