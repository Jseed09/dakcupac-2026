import React from "react";
import { Ship, Star, ChevronDown } from "lucide-react";
import { ObjIcon, Pill, HealthPill, DataTable } from "../lib/ui.jsx";
import { owner } from "../lib/helpers.js";
import { BOATS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function Boats({ boatHours = {}, openRecord }) {
  const cols = ["Boat", "Owner", "Engine", "Hours", "Next service", "Membership", "Health"];
  return (
    <div>
      <ListHeader icon={Ship} hue="#0b7285" kind="Boats" sub="All vessels" count={BOATS.length} />
      <DataTable cols={cols}>
        {BOATS.map((b) => (
          <tr key={b.id} onClick={() => openRecord(b.id)} className="border-b border-[#e5e5e5] last:border-0 hover:bg-[#f3f2f2] cursor-pointer">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <ObjIcon icon={Ship} hue={b.hue} size={26} />
                <div>
                  <div className="font-semibold text-[#0a6e8c]">"{b.name}"</div>
                  <div className="text-[11px] text-[#9aa0a6]">{b.hin}</div>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-[#3a3a3a]">{owner(b.id).name}</td>
            <td className="px-4 py-3 text-[#3a3a3a]">{b.engine}</td>
            <td className="px-4 py-3 text-[#3a3a3a]">{boatHours[b.id] ?? b.hours} hrs</td>
            <td className="px-4 py-3">
              {["Due now", "Overdue"].includes(b.nextService)
                ? <Pill bg="#fde7e7" fg="#b42121">{b.nextService}</Pill>
                : <span className="text-[#3a3a3a]">{b.nextService}</span>}
            </td>
            <td className="px-4 py-3">
              {b.membership === "None"
                ? <span className="text-[#9aa0a6]">None</span>
                : <Pill bg="#efe9fb" fg="#5f3dc4"><Star size={11} /> {b.membership}</Pill>}
            </td>
            <td className="px-4 py-3"><HealthPill h={b.health} /></td>
            <td className="px-2 py-3 text-right">
              <span className="inline-grid place-items-center w-7 h-7 rounded border border-transparent text-[#9aa0a6] hover:border-[#d0d0d0] hover:bg-white"><ChevronDown size={15} /></span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
