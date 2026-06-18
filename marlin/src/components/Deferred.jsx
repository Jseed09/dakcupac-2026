import React from "react";
import { DollarSign, TrendingUp, MessageSquare } from "lucide-react";
import { ObjIcon } from "../lib/ui.jsx";
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
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-[#5f6368] text-[12px] uppercase tracking-wide">
              {["Boat", "Item", "Quoted", "Amount", ""].map((c) => <th key={c} className="text-left font-semibold px-4 py-2.5">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {[...DEFERRED].sort((a, b) => b.amount - a.amount).map((d) => (
              <tr key={d.id} className="border-b border-[#f4f4f4] hover:bg-[#f7fbfd]">
                <td className="px-4 py-3">
                  <button onClick={() => openRecord(d.boatId)} className="font-semibold text-[#0a6e8c] hover:underline">"{boat(d.boatId).name}"</button>
                </td>
                <td className="px-4 py-3 text-[#3a3a3a]">{d.item}</td>
                <td className="px-4 py-3 text-[#706e6b]">{d.quoted}</td>
                <td className="px-4 py-3 font-bold text-[#1b6b34]">{money(d.amount)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onDraft(d.boatId, d.item)} className="inline-flex items-center gap-1.5 border border-[#d0d0d0] text-[#0a6e8c] text-[12px] font-semibold rounded-md px-2.5 h-7 hover:bg-[#f7fbfd]">
                    <MessageSquare size={13} /> Draft recovery text
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
