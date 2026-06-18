import React from "react";
import { Ship, Anchor, ArrowLeft, Phone, Wrench, Users, DollarSign, BadgeCheck, Star, MessageSquare, MapPin, Droplets, Snowflake, Gauge, Package, Send, Navigation } from "lucide-react";
import { ObjIcon, Pill, HealthPill, Card, Path } from "../lib/ui.jsx";
import { boat, owner, money, TIER, PART_STATE } from "../lib/helpers.js";
import { CONTACTS, FORECAST, HISTORY, DEFERRED, STAGES } from "../data/seed.js";
import LiveStatus from "./LiveStatus.jsx";

export default function BoatRecord({ id, recordTab, setRecordTab, work, parts = [], updates = [], hours, onBack, onCall, onDraft, advance, onDispatch }) {
  const b = boat(id);
  const o = owner(id);
  const hrs = hours ?? b.hours;
  const job = work.find((w) => w.boatId === id);
  // Related data is keyed by boat id. Default to empty so a boat without a
  // forecast / history / contacts row renders instead of throwing.
  const contacts = CONTACTS[id] ?? [];
  const forecast = FORECAST[id] ?? [];
  const history = HISTORY[id] ?? [];
  const boatParts = parts.filter((p) => p.boatId === id);
  const boatUpdates = updates.filter((u) => u.boatId === id);
  const deferred = DEFERRED.filter((d) => d.boatId === id);
  const deferredTotal = deferred.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-[#0176d3] font-semibold mb-3 hover:underline">
        <ArrowLeft size={15} /> Boats
      </button>

      <div className="bg-white rounded-lg border border-[#dddbda] shadow-sm p-4 mb-4">
        <div className="flex items-start gap-3">
          <ObjIcon icon={Ship} hue={b.hue} size={44} />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-[#706e6b] font-semibold">Boat</div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight">"{b.name}"</h1>
              <HealthPill h={b.health} />
              {b.membership !== "None" && <Pill bg="#efe9fb" fg="#5f3dc4"><Star size={11} /> {b.membership}</Pill>}
            </div>
            <div className="text-sm text-[#706e6b] mt-0.5">{b.year} · {b.engine}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onCall(id)} className="flex items-center gap-1.5 border border-[#d0d0d0] text-[#0176d3] text-sm font-semibold rounded-md px-3 h-8 hover:bg-[#f7fbfd]">
              <Phone size={14} /> Log call
            </button>
            {onDispatch && (
              <button onClick={() => onDispatch(id)} className="flex items-center gap-1.5 border border-[#d0d0d0] text-[#0176d3] text-sm font-semibold rounded-md px-3 h-8 hover:bg-[#f7fbfd]">
                <Navigation size={14} /> Dispatch tech
              </button>
            )}
            <button className="flex items-center gap-1.5 bg-[#0176d3] hover:bg-[#015fb0] text-white text-sm font-semibold rounded-md px-3 h-8">
              <Wrench size={14} /> New work order
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[#eef0f2] mt-4 rounded-md overflow-hidden border border-[#eef0f2]">
          {[["Owner", o.name], ["HIN", b.hin], ["Engine hours", hrs + " hrs"], ["Location", b.location], ["Next service", b.nextService], ["Last service", b.lastService]].map(([k, v]) => (
            <div key={k} className="bg-white px-3 py-2">
              <div className="text-[11px] text-[#9aa0a6] font-medium">{k}</div>
              <div className="text-[13px] font-semibold text-[#3a3a3a] truncate">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {job && (
        <div className="bg-white rounded-lg border border-[#dddbda] shadow-sm p-3 mb-4">
          <Path stages={STAGES} current={job.stage} onAdvance={job.stage < STAGES.length - 1 ? () => advance(job.id) : undefined} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-[#dddbda] shadow-sm">
            <div className="flex border-b border-[#eef0f2] px-2">
              {[["details", "Details"], ["maintenance", "Maintenance forecast"], ["history", "Service history"]].map(([k, l]) => (
                <button key={k} onClick={() => setRecordTab(k)} className={"px-3 py-2.5 text-[13px] border-b-[3px] -mb-px " + (recordTab === k ? "border-[#0176d3] text-[#0176d3] font-semibold" : "border-transparent text-[#706e6b] hover:text-[#3a3a3a]")}>{l}</button>
              ))}
            </div>

            {recordTab === "details" && (
              <div className="p-4 grid sm:grid-cols-2 gap-4">
                {[
                  [MapPin, "Storage", b.storage], [Droplets, "Water type", b.water], [Snowflake, "Climate", b.climate],
                  [Gauge, "Engine hours", hrs + " hrs"], [Ship, "Year / make", `${b.year} ${b.engine.split(" ")[0]}`], [Anchor, "HIN", b.hin],
                ].map(([Icon, k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <Icon size={16} className="text-[#9aa0a6] mt-0.5" />
                    <div>
                      <div className="text-[11px] text-[#9aa0a6] font-medium">{k}</div>
                      <div className="text-[14px] text-[#3a3a3a] font-semibold">{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recordTab === "maintenance" && (
              <div className="p-4 space-y-2.5">
                {forecast.map((f) => {
                  const t = TIER[f.tier];
                  return (
                    <div key={f.item} className="flex items-start gap-3 rounded-md border border-[#eef0f2] pl-0 overflow-hidden">
                      <span className="w-1.5 self-stretch shrink-0" style={{ background: t.bar }} />
                      <div className="flex-1 py-2.5 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#222]">{f.item}</span>
                          <Pill bg={t.chip} fg={t.chipFg}>{t.label}</Pill>
                          {f.price > 0 && <span className="ml-auto font-bold text-[#3a3a3a]">{money(f.price)}</span>}
                        </div>
                        <div className="text-[13px] text-[#5f6368] mt-1">{f.why}</div>
                      </div>
                    </div>
                  );
                })}
                <p className="text-[12px] text-[#9aa0a6] pt-1">
                  Every line is tied to evidence: hours, age, a fault, or a last-visit photo. Nothing here is a guess.
                </p>
              </div>
            )}

            {recordTab === "history" && (
              <div className="p-4">
                <div className="relative pl-5">
                  <span className="absolute left-[6px] top-1 bottom-1 w-px bg-[#dddbda]" />
                  {history.map((h) => (
                    <div key={h.date} className="relative pb-4 last:pb-0">
                      <span className="absolute -left-[15px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0176d3]" />
                      <div className="text-[13px] font-semibold text-[#222]">{h.date}</div>
                      <div className="text-[13px] text-[#5f6368]">{h.note}</div>
                      <div className="text-[12px] text-[#9aa0a6] mt-0.5">Tech: {h.tech}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {job && <LiveStatus job={job} advance={advance} boatName={b.name} />}

          <Card title={`Authorized contacts (${contacts.length})`} icon={Users}>
            {contacts.map((c) => (
              <div key={c.name} className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f4f4f4] last:border-0">
                <span className="w-7 h-7 rounded-full bg-[#1971c2] grid place-items-center text-white text-[11px] font-bold">
                  {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#3a3a3a]">{c.name}</div>
                  <div className="text-[11px] text-[#9aa0a6]">{c.role}</div>
                </div>
                <Pill bg={c.perm.startsWith("Approve") ? "#e6f4ea" : "#eef0f2"} fg={c.perm.startsWith("Approve") ? "#1b6b34" : "#5f6368"}>{c.perm}</Pill>
              </div>
            ))}
          </Card>

          <Card title={`Deferred work (${deferred.length})`} icon={DollarSign}
            action={deferred.length > 0 && <span className="text-sm font-bold text-[#1b6b34]">{money(deferredTotal)}</span>}>
            {deferred.length === 0
              ? <div className="px-4 py-4 text-[13px] text-[#9aa0a6]">No open deferred work. This boat is current.</div>
              : deferred.map((d) => (
                <div key={d.id} className="px-4 py-2.5 border-b border-[#f4f4f4] last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#3a3a3a]">{d.item}</span>
                    <span className="text-[13px] font-bold text-[#3a3a3a]">{money(d.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-[#9aa0a6]">Quoted {d.quoted}</span>
                    <button onClick={() => onDraft(id, d.item)} className="flex items-center gap-1 text-[12px] font-semibold text-[#0176d3] hover:underline">
                      <MessageSquare size={12} /> Draft recovery text
                    </button>
                  </div>
                </div>
              ))}
          </Card>

          {(boatParts.length > 0 || boatUpdates.length > 0) && (
            <Card title={`Parts and updates (${boatParts.length})`} icon={Package}>
              {boatParts.map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-4 py-2.5 border-b border-[#f4f4f4]">
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[#3a3a3a]">{p.name}</div>
                    <div className="text-[11px] text-[#9aa0a6]">{p.supplier} · ETA {p.eta}</div>
                  </div>
                  <Pill bg={PART_STATE[p.status].bg} fg={PART_STATE[p.status].fg}>{PART_STATE[p.status].label}</Pill>
                </div>
              ))}
              {boatUpdates.length > 0 && (
                <div className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#0176d3] mb-1">
                    <Send size={12} /> Last update sent
                  </div>
                  <div className="text-[12px] text-[#5f6368]">{boatUpdates[0].text}</div>
                </div>
              )}
            </Card>
          )}

          {b.membership !== "None" && (
            <Card title="Membership" icon={BadgeCheck}>
              <div className="px-4 py-3 flex items-center gap-2">
                <Star size={16} className="text-[#5f3dc4]" />
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#3a3a3a]">{b.membership}</div>
                  <div className="text-[11px] text-[#9aa0a6]">Annual plan · renews automatically</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
