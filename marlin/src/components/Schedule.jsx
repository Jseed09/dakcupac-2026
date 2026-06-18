import React from "react";
import { Calendar, Gauge, ListChecks } from "lucide-react";
import { Card } from "../lib/ui.jsx";
import { SHOP_LOAD, SCHEDULE_ACTIONS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function Schedule() {
  return (
    <div>
      <ListHeader icon={Calendar} hue="#0b7285" kind="Schedule" sub="Demand smoothing" count={SHOP_LOAD.length} />
      <Card title="Shop load by month" icon={Gauge}>
        <div className="p-4">
          <div className="flex items-end gap-2 h-48">
            {SHOP_LOAD.map(({ month: m, load: v }) => {
              const trough = v < 35, peak = v > 90;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-md relative" style={{ height: `${v}%`, background: peak ? "#b42121" : trough ? "#0176d3" : "#9fb4bd" }}>
                    <span className="absolute -top-5 left-0 right-0 text-center text-[10px] text-[#5f6368]">{v}%</span>
                  </div>
                  <span className="text-[11px] text-[#706e6b]">{m}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-[12px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#b42121]" /> Overbooked peak</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#0176d3]" /> Dead trough, sell into it</span>
          </div>
        </div>
      </Card>
      <div className="mt-4">
        <Card title="Suggested actions to level the curve" icon={ListChecks}>
          {SCHEDULE_ACTIONS.map((a, i) => (
            <div key={a.id} className="flex gap-3 px-4 py-3 border-b border-[#f4f4f4] last:border-0">
              <span className="w-6 h-6 rounded-full bg-[#e9f5f9] text-[#0176d3] grid place-items-center text-xs font-bold shrink-0">{i + 1}</span>
              <div>
                <div className="text-[13px] font-semibold text-[#222]">{a.title}</div>
                <div className="text-[13px] text-[#5f6368]">{a.detail}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
