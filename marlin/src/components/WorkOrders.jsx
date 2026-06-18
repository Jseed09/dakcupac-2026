import React from "react";
import { Wrench, CalendarClock, Package } from "lucide-react";
import { boat, PART_STATE } from "../lib/helpers.js";
import { STAGES, PART_STATUS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function WorkOrders({ work, parts = [], advance, openRecord }) {
  return (
    <div>
      <ListHeader icon={Wrench} hue="#1971c2" kind="Work Orders" sub="Service pipeline" count={work.length} />
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage, si) => {
          const cards = work.filter((w) => w.stage === si);
          return (
            <div key={stage} className="w-56 shrink-0">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#5f6368]">{stage}</span>
                <span className="text-[11px] text-[#9aa0a6] bg-white border border-[#e5e5e5] rounded-full px-1.5">{cards.length}</span>
              </div>
              <div className="space-y-2 min-h-[60px] bg-[#ececec] rounded-lg p-2">
                {cards.map((w) => {
                  const b = boat(w.boatId);
                  // The part holding the job back is the least-advanced one not yet installed.
                  const gating = parts
                    .filter((p) => p.workId === w.id && p.status < PART_STATUS.length - 1)
                    .sort((a, c) => a.status - c.status)[0];
                  return (
                    <div key={w.id} className="bg-white rounded-md border border-[#e5e5e5] shadow-sm p-2.5">
                      <button onClick={() => openRecord(w.boatId)} className="font-semibold text-[#0a6e8c] text-sm hover:underline">"{b.name}"</button>
                      <div className="text-[11px] text-[#9aa0a6] mt-0.5">{b.engine}</div>
                      {w.scheduled && (
                        <div className="flex items-center gap-1 text-[11px] text-[#5f6368] mt-1.5">
                          <CalendarClock size={12} className="text-[#9aa0a6]" /> {w.scheduled}
                        </div>
                      )}
                      {gating && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Package size={12} style={{ color: PART_STATE[gating.status].dot }} />
                          <span className="text-[11px] font-semibold" style={{ color: PART_STATE[gating.status].fg }}>
                            Part {PART_STATE[gating.status].label.toLowerCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-[#5f6368]">{w.tech.split(" ")[0]} · {w.opened}</span>
                        {si < STAGES.length - 1 &&
                          <button onClick={() => advance(w.id)} className="text-[11px] font-semibold text-[#0a6e8c] hover:underline">Advance →</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
