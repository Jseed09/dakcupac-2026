import React from "react";
import { Plus, ChevronDown, Search, Filter, RefreshCw, Settings2 } from "lucide-react";
import { ObjIcon } from "../lib/ui.jsx";

// Salesforce list-view header: object tile, the object type over a list-view
// name with a switcher caret, item count, then list actions on the right.
export default function ListHeader({ icon, hue, kind, count, sub }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <ObjIcon icon={icon} hue={hue} size={36} />
      <div className="min-w-0">
        <div className="text-[12px] text-[#706e6b] font-medium leading-tight">{kind}</div>
        <button className="flex items-center gap-1 font-bold text-[19px] leading-tight text-[#181818] hover:text-[#0a6e8c]">
          {sub} <ChevronDown size={16} className="text-[#706e6b]" />
        </button>
        <div className="text-[12px] text-[#706e6b] leading-tight">{count} items · updated a few seconds ago</div>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <button aria-label="Search this list" className="grid place-items-center w-8 h-8 rounded-md border border-[#d0d0d0] text-[#5f6368] hover:bg-[#f3f3f3]"><Search size={15} /></button>
        <button aria-label="Refresh" className="grid place-items-center w-8 h-8 rounded-md border border-[#d0d0d0] text-[#5f6368] hover:bg-[#f3f3f3]"><RefreshCw size={15} /></button>
        <button aria-label="Filters" className="grid place-items-center w-8 h-8 rounded-md border border-[#d0d0d0] text-[#5f6368] hover:bg-[#f3f3f3]"><Filter size={15} /></button>
        <button aria-label="List settings" className="grid place-items-center w-8 h-8 rounded-md border border-[#d0d0d0] text-[#5f6368] hover:bg-[#f3f3f3]"><Settings2 size={15} /></button>
        <button className="flex items-center gap-1.5 bg-[#1aa0c4] hover:bg-[#1690b0] text-white text-sm font-semibold rounded-md px-3 h-8 ml-1">
          <Plus size={15} /> New
        </button>
      </div>
    </div>
  );
}
