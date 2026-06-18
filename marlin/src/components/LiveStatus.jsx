import React from "react";
import { ListChecks, CheckCircle2, Clock, Circle, Camera } from "lucide-react";
import { Pill } from "../lib/ui.jsx";
import { STAGES } from "../data/seed.js";

export default function LiveStatus({ job, advance, boatName }) {
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[#f0f0f0] flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm"><ListChecks size={15} className="text-[#706e6b]" /> Live service status</div>
        <Pill bg="#e9f5f9" fg="#0a6e8c">{job.tech.split(" ")[0]} on it</Pill>
      </div>
      <div className="p-4">
        <div className="space-y-0">
          {STAGES.map((s, i) => {
            const done = i < job.stage, current = i === job.stage;
            return (
              <div key={s} className="flex items-center gap-2.5 py-1">
                {done ? <CheckCircle2 size={18} className="text-[#1b6b34]" />
                  : current ? <Clock size={18} className="text-[#1aa0c4]" />
                    : <Circle size={18} className="text-[#d0d4d8]" />}
                <span className={"text-[13px] " + (current ? "font-bold text-[#0a6e8c]" : done ? "text-[#3a3a3a]" : "text-[#9aa0a6]")}>{s}</span>
                {current && <span className="ml-auto text-[11px] text-[#9aa0a6]">now</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-[#5f6368] bg-[#f7fbfd] rounded-md p-2">
          <Camera size={14} className="text-[#1aa0c4]" />
          Owner sees each step by SMS. Tap, photo, dictate. AI writes the message.
        </div>
        {job.stage < STAGES.length - 1 && (
          <button onClick={() => advance(job.id)} className="mt-3 w-full bg-[#053a4e] hover:bg-[#04303f] text-white text-sm font-semibold rounded-md h-9">
            Advance stage
          </button>
        )}
        {job.stage === STAGES.length - 1 &&
          <div className="mt-3 text-center text-[13px] font-semibold text-[#1b6b34]">"{boatName}" is ready for pickup</div>}
      </div>
    </div>
  );
}
