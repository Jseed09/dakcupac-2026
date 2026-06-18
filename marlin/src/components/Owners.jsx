import React from "react";
import { Users } from "lucide-react";
import { OWNERS, BOATS } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function Owners({ openRecord }) {
  return (
    <div>
      <ListHeader icon={Users} hue="#1971c2" kind="Owners" sub="All owners" count={Object.keys(OWNERS).length} />
      <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e8e8e8] text-[#5f6368] text-[12px] uppercase tracking-wide">
              {["Owner", "Phone", "Customer since", "Boats"].map((c) => <th key={c} className="text-left font-semibold px-4 py-2.5">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {Object.entries(OWNERS).map(([oid, o]) => {
              const owned = BOATS.filter((b) => b.ownerId === oid);
              return (
                <tr key={oid} className="border-b border-[#f4f4f4] hover:bg-[#f7fbfd]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#1971c2] grid place-items-center text-white text-xs font-bold">
                        {o.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </span>
                      <span className="font-semibold text-[#0a6e8c]">{o.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#3a3a3a]">{o.phone}</td>
                  <td className="px-4 py-3 text-[#3a3a3a]">{o.since}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {owned.map((b) => (
                        <button key={b.id} onClick={() => openRecord(b.id)} className="text-xs font-semibold text-[#0a6e8c] bg-[#e9f5f9] rounded-full px-2 py-0.5 hover:bg-[#d6edf4]">
                          "{b.name}"
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
