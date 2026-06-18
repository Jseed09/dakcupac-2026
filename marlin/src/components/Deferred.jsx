import React from "react";
import { DollarSign, TrendingUp, MessageSquare, ChevronDown } from "lucide-react";
import { ObjIcon, DataTable } from "../lib/ui.jsx";
import { boat, money } from "../lib/helpers.js";
import { DEFERRED } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function Deferred({ recoverable, onDraft, openRecord }) {
  return (
    <div>
      <ListHeader icon={DollarSign} hue="#1b6b34" kind="Deferred Work" sub="Recoverable revenue" count={DEFERRED.length} />
      <div className="bg-[#e6f4ea] border border-[#bfe3cb] rounded-lg p-4 mb-4 flex items-center gap-3">
        <ObjIcon icon={TrendingUp} hue="#1b6b34" size={38} />
        <div>
          <div className="text-[12px] text-[#1b6b34] font-semibold uppercase tracking-wide">Total recoverable, already in your book</div>
          <div className="text-3xl font-bold text-[#14502a]">{money(recoverable)}</div>
        </div>
        <div className="ml-auto text-[12px] text-[#1b6b34] max-w-xs">
          Real, owner-acknowledged, evidence-backed work the shop already quoted. Surface it, do not invent it.
        </div>
      </div>
      <DataTable cols={["Boat", "Item", "Quoted", "Amount", ""]}>
        {[...DEFERRED].sort((a, b) => b.amount - a.amount).map((d) => (
          <tr key={d.id} className="border-b border-[#dddbda] last:border-0 hover:bg-[#f3f2f2]">
            <td className="px-4 py-3">
              <button onClick={() => openRecord(d.boatId)} className="font-semibold text-[#0176d3] hover:underline">"{boat(d.boatId).name}"</button>
            </td>
            <td className="px-4 py-3 text-[#3a3a3a]">{d.item}</td>
            <td className="px-4 py-3 text-[#706e6b]">{d.quoted}</td>
            <td className="px-4 py-3 font-bold text-[#1b6b34]">{money(d.amount)}</td>
            <td className="px-4 py-3 text-right">
              <button onClick={() => onDraft(d.boatId, d.item)} className="inline-flex items-center gap-1.5 border border-[#d0d0d0] text-[#0176d3] text-[12px] font-semibold rounded-md px-2.5 h-7 hover:bg-[#f7fbfd]">
                <MessageSquare size={13} /> Draft recovery text
              </button>
            </td>
            <td className="px-2 py-3 text-right">
              <span className="inline-grid place-items-center w-7 h-7 rounded border border-transparent text-[#9aa0a6] hover:border-[#d0d0d0] hover:bg-white"><ChevronDown size={15} /></span>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
