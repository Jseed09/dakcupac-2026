import React, { useEffect, useState } from "react";
import { MessageSquare, X, Copy, Check } from "lucide-react";
import { boat, owner } from "../lib/helpers.js";

export default function DraftModal({ draft, copied, setCopied, onClose }) {
  const b = boat(draft.boatId);
  // Local editable copy so edits made in the textarea are what gets copied,
  // not the original generated draft.
  const [text, setText] = useState(draft.text);

  useEffect(() => { setText(draft.text); }, [draft.text]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts where the Clipboard API is absent.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Recovery text for ${b.name}`} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#eef0f2] flex items-center gap-2">
          <MessageSquare size={16} className="text-[#0176d3]" />
          <span className="font-bold">Recovery text · "{b.name}"</span>
          <button onClick={onClose} aria-label="Close" className="ml-auto p-1 rounded hover:bg-[#f3f3f3]"><X size={18} /></button>
        </div>
        <div className="p-4">
          <div className="text-[11px] text-[#9aa0a6] mb-1">To {owner(draft.boatId).name} · {owner(draft.boatId).phone}</div>
          <textarea value={text} onChange={(e) => { setText(e.target.value); setCopied(false); }} rows={6} className="w-full text-[14px] text-[#222] border border-[#dcebf1] rounded-md p-3 bg-[#f7fbfd] outline-none resize-none leading-relaxed" />
          <div className="text-[12px] text-[#9aa0a6] mt-2">
            Warm, one ask, boat by name in quotes, a reason to act now. No pressure.
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={copy} className="flex-1 flex items-center justify-center gap-1.5 bg-[#0176d3] hover:bg-[#015fb0] text-white text-sm font-semibold rounded-md h-9">
              {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy message</>}
            </button>
            <button onClick={onClose} className="border border-[#d0d0d0] text-[#5f6368] text-sm font-semibold rounded-md px-3 h-9 hover:bg-[#f7f7f7]">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
