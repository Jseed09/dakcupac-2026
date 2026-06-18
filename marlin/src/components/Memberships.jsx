import React from "react";
import { BadgeCheck, Ship, Star } from "lucide-react";
import { ObjIcon, Pill, Card } from "../lib/ui.jsx";
import { boat, owner } from "../lib/helpers.js";
import { MEMBERSHIPS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function Memberships({ openRecord }) {
  return (
    <div>
      <ListHeader icon={BadgeCheck} hue="#5f3dc4" kind="Memberships" sub="Care plan members" count={MEMBERSHIPS.length} />
      <Card title="Concierge Care members" icon={Star}>
        {MEMBERSHIPS.map((m) => {
          const b = boat(m.boatId);
          return (
            <div key={m.boatId} className="flex items-center gap-3 px-4 py-3 border-b border-[#f4f4f4] last:border-0">
              <ObjIcon icon={Ship} hue={b.hue} size={28} />
              <button onClick={() => openRecord(m.boatId)} className="font-semibold text-[#0176d3] hover:underline">"{b.name}"</button>
              <span className="text-[13px] text-[#706e6b]">{owner(m.boatId).name}</span>
              <Pill bg="#efe9fb" fg="#5f3dc4"><Star size={11} /> {m.plan}</Pill>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
