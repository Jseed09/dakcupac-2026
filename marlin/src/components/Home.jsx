import React from "react";
import { DollarSign, AlertTriangle, Wrench, Truck, Ship, ChevronRight, TrendingUp, Clock } from "lucide-react";
import { ObjIcon, Pill, HealthPill, Card } from "../lib/ui.jsx";
import { boat, owner, money } from "../lib/helpers.js";
import { BOATS, DEFERRED, RECENT_ACTIVITY } from "../data/seed.js";

export default function Home({ recoverable, dueSoon, partsInbound, work, openRecord }) {
  const byBoat = Object.values(DEFERRED.reduce((acc, d) => {
    acc[d.boatId] = acc[d.boatId] || { boatId: d.boatId, amount: 0, count: 0 };
    acc[d.boatId].amount += d.amount; acc[d.boatId].count += 1; return acc;
  }, {})).sort((a, b) => b.amount - a.amount);
  const maxRecoverable = Math.max(1, ...byBoat.map((r) => r.amount));
  const kpis = [
    { label: "Recoverable deferred work", val: money(recoverable), sub: `${DEFERRED.length} open items`, icon: DollarSign, hue: "#1b6b34" },
    { label: "Boats due now", val: dueSoon.length, sub: "needs scheduling", icon: AlertTriangle, hue: "#b42121" },
    { label: "Active work orders", val: work.length, sub: "in the shop", icon: Wrench, hue: "#1971c2" },
    { label: "Parts inbound", val: partsInbound, sub: "ordered or shipping", icon: Truck, hue: "#9a5b00" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-lg border border-[#dddbda] shadow-sm p-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#706e6b] font-medium">{k.label}</span>
              <ObjIcon icon={k.icon} hue={k.hue} size={26} />
            </div>
            <div className="text-[28px] font-bold mt-2 leading-none">{k.val}</div>
            <div className="text-[12px] text-[#706e6b] mt-1">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="Boats due soon" icon={Ship} action={<span className="text-xs text-[#0176d3] font-semibold">{dueSoon.length} records</span>}>
            {dueSoon.map((b) => (
              <button key={b.id} onClick={() => openRecord(b.id)} className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#f4f4f4] hover:bg-[#f7fbfd] text-left">
                <ObjIcon icon={Ship} hue={b.hue} size={30} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#0176d3] truncate">"{b.name}"</div>
                  <div className="text-xs text-[#706e6b]">{owner(b.id).name} · {b.engine}</div>
                </div>
                <Pill bg="#fde7e7" fg="#b42121">{b.nextService}</Pill>
                <ChevronRight size={16} className="text-[#9aa0a6]" />
              </button>
            ))}
          </Card>

          <div className="mt-4">
            <Card title="Recoverable revenue, ranked by boat" icon={TrendingUp}>
              {byBoat.map((r) => (
                <button key={r.boatId} onClick={() => openRecord(r.boatId)} className="w-full flex items-center gap-3 px-4 py-2.5 border-b border-[#f4f4f4] hover:bg-[#f7fbfd] text-left">
                  <div className="flex-1">
                    <span className="font-semibold text-[#0176d3]">"{boat(r.boatId).name}"</span>
                    <span className="text-xs text-[#706e6b] ml-2">{r.count} item{r.count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="w-40 h-2 rounded-full bg-[#eef0f2] overflow-hidden">
                    <div className="h-full bg-[#1b6b34]" style={{ width: `${(r.amount / maxRecoverable) * 100}%` }} />
                  </div>
                  <span className="font-bold text-[#1b6b34] w-16 text-right">{money(r.amount)}</span>
                </button>
              ))}
            </Card>
          </div>
        </div>

        <Card title="Recent activity" icon={Clock}>
          {RECENT_ACTIVITY.map((a) => (
            <div key={a.id} className="flex gap-3 px-4 py-3 border-b border-[#f4f4f4]">
              <span className="w-2 h-2 rounded-full bg-[#0176d3] mt-1.5 shrink-0" />
              <div className="flex-1 text-[13px] text-[#3a3a3a]">{a.text}</div>
              <span className="text-xs text-[#9aa0a6]">{a.when}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
