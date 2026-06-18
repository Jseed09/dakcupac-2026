import React from "react";
import { Package, Truck, CheckCircle2, Clock, Send, CalendarClock } from "lucide-react";
import { Pill, Card } from "../lib/ui.jsx";
import { boat, PART_STATE } from "../lib/helpers.js";
import { PART_STATUS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

const STAGE_ICON = [Clock, Truck, Package, CheckCircle2];

export default function Parts({ parts, updates, work, advancePart, reportDelay, openRecord }) {
  return (
    <div>
      <ListHeader icon={Package} hue="#0b7285" kind="Parts" sub="Inbound parts and customer updates" count={parts.length} />

      <div className="bg-[#f7fbfd] border border-[#dcebf1] rounded-lg p-4 mb-4 flex items-start gap-3">
        <Send size={18} className="text-[#0a6e8c] mt-0.5 shrink-0" />
        <div className="text-[13px] text-[#3a3a3a]">
          Every step here texts the owner automatically. When a part ships, lands, or a job slips, they hear it from
          the system. No stopping the job to return a call.
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {parts.map((p) => {
            const b = boat(p.boatId);
            const job = work.find((w) => w.id === p.workId);
            const installed = p.status >= PART_STATUS.length - 1;
            return (
              <div key={p.id} className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => openRecord(p.boatId)} className="font-semibold text-[#0a6e8c] hover:underline">"{b.name}"</button>
                  <span className="text-[13px] text-[#3a3a3a]">· {p.name}</span>
                  <Pill bg={PART_STATE[p.status].bg} fg={PART_STATE[p.status].fg}>{PART_STATE[p.status].label}</Pill>
                  {p.notified && <span className="text-[11px] text-[#1b6b34] font-semibold">Customer notified</span>}
                </div>
                <div className="text-[12px] text-[#9aa0a6] mt-0.5">{p.supplier} · ETA {p.eta}</div>

                <div className="flex items-center gap-1 mt-3">
                  {PART_STATUS.map((label, i) => {
                    const Icon = STAGE_ICON[i];
                    const reached = i <= p.status;
                    return (
                      <React.Fragment key={label}>
                        <div className="flex flex-col items-center gap-1 w-16 shrink-0">
                          <Icon size={16} color={reached ? PART_STATE[i].dot : "#d0d4d8"} />
                          <span className={"text-[10px] " + (reached ? "text-[#3a3a3a] font-semibold" : "text-[#9aa0a6]")}>{label}</span>
                        </div>
                        {i < PART_STATUS.length - 1 && <span className="flex-1 h-px" style={{ background: i < p.status ? PART_STATE[i + 1].dot : "#e5e5e5" }} />}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f0f0]">
                  <span className="flex items-center gap-1.5 text-[12px] text-[#5f6368]">
                    <CalendarClock size={14} className="text-[#9aa0a6]" />
                    Service {job ? job.scheduled : "not scheduled"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => reportDelay(p.id)} className="text-[12px] font-semibold text-[#9a5b00] border border-[#f0e0c0] bg-[#fff8ec] rounded-md px-2.5 h-7 hover:bg-[#fff2d8]">
                      Report delay
                    </button>
                    {!installed && (
                      <button onClick={() => advancePart(p.id)} className="text-[12px] font-semibold text-white bg-[#1aa0c4] hover:bg-[#1690b0] rounded-md px-2.5 h-7">
                        Mark {PART_STATUS[p.status + 1]}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Card title="Customer updates" icon={Send} action={<span className="text-[11px] text-[#9aa0a6]">auto-sent</span>}>
          {updates.map((u) => (
            <div key={u.id} className="px-4 py-3 border-b border-[#f4f4f4] last:border-0">
              <div className="flex items-center justify-between">
                <button onClick={() => openRecord(u.boatId)} className="text-[12px] font-semibold text-[#0a6e8c] hover:underline">"{boat(u.boatId).name}"</button>
                <span className="text-[11px] text-[#9aa0a6]">{u.channel} · {u.when}</span>
              </div>
              <div className="text-[13px] text-[#3a3a3a] mt-1">{u.text}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
