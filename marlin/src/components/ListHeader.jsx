import React from "react";
import { Plus } from "lucide-react";
import { ObjIcon } from "../lib/ui.jsx";

export default function ListHeader({ icon, hue, kind, count, sub }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <ObjIcon icon={icon} hue={hue} size={34} />
      <div>
        <div className="text-[11px] uppercase tracking-wide text-[#706e6b] font-semibold">{kind}</div>
        <div className="font-bold text-lg leading-tight">{sub}</div>
      </div>
      <span className="ml-2 text-sm text-[#706e6b]">{count} items</span>
      <button className="ml-auto flex items-center gap-1.5 bg-[#1aa0c4] hover:bg-[#1690b0] text-white text-sm font-semibold rounded-md px-3 h-8">
        <Plus size={15} /> New
      </button>
    </div>
  );
}
