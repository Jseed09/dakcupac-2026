import React from "react";
import { BadgeCheck, Ship, Star } from "lucide-react";
import { ObjIcon, Pill, Card } from "../lib/ui.jsx";
import { boat, owner, money } from "../lib/helpers.js";
import { MEMBERSHIPS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function Memberships({ arr, openRecord }) {
  const avgPlan = MEMBERSHIPS.length ? Math.round(arr / MEMBERSHIPS.length) : 0;
  return (
    <div>
      <ListHeader icon={BadgeCheck} hue="#5f3dc4" kind="Memberships" sub="Recurring revenue spine" count={MEMBERSHIPS.length} />
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        {[["Active plans", MEMBERSHIPS.length], ["Annual recurring revenue", money(arr)], ["Avg plan", `${money(avgPlan)}/yr`]].map(([k, v]) => (
          <div key={k} className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm p-4">
            <div className="text-[12px] text-[#706e6b] font-medium">{k}</div>
            <div className="text-2xl font-bold mt-1">{v}</div>
          </div>
        ))}
      </div>
      <Card title="Concierge Care members" icon={Star}>
        {MEMBERSHIPS.map((m) => {
          const b = boat(m.boatId);
          return (
            <div key={m.boatId} className="flex items-center gap-3 px-4 py-3 border-b border-[#f4f4f4] last:border-0">
              <ObjIcon icon={Ship} hue={b.hue} size={28} />
              <button onClick={() => openRecord(m.boatId)} className="font-semibold text-[#0a6e8c] hover:underline">"{b.name}"</button>
              <span className="text-[13px] text-[#706e6b]">{owner(m.boatId).name}</span>
              <Pill bg="#efe9fb" fg="#5f3dc4"><Star size={11} /> {m.plan}</Pill>
              <span className="ml-auto font-bold text-[#3a3a3a]">{money(m.price)}/yr</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
