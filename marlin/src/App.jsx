import React, { useState } from "react";
import { Grid, Search, Phone, Anchor, Bell, Settings, Ship, Users, Wrench, DollarSign, Calendar, BadgeCheck, Package, TrendingUp, Gauge, HelpCircle, ChevronDown } from "lucide-react";
import { boat, recoveryMessage, partUpdate, delayUpdate, dispatchUpdate } from "./lib/helpers.js";
import { BOATS, DEFERRED, STAGES, INITIAL_WORK, INITIAL_PARTS, UPDATES_SEED, PART_STATUS, SERVICE_WINDOWS } from "./data/seed.js";
import Home from "./components/Home.jsx";
import Boats from "./components/Boats.jsx";
import Owners from "./components/Owners.jsx";
import BoatRecord from "./components/BoatRecord.jsx";
import WorkOrders from "./components/WorkOrders.jsx";
import FollowUps from "./components/FollowUps.jsx";
import Deferred from "./components/Deferred.jsx";
import Schedule from "./components/Schedule.jsx";
import Memberships from "./components/Memberships.jsx";
import Parts from "./components/Parts.jsx";
import ScreenPop from "./components/ScreenPop.jsx";
import DraftModal from "./components/DraftModal.jsx";
import IntakeModal from "./components/IntakeModal.jsx";
import DispatchModal from "./components/DispatchModal.jsx";

const NAV = [
  ["home", "Home", Grid],
  ["owners", "Owners", Users],
  ["boats", "Boats", Ship],
  ["followups", "Follow-ups", TrendingUp],
  ["workorders", "Work Orders", Wrench],
  ["parts", "Parts", Package],
  ["deferred", "Deferred Work", DollarSign],
  ["schedule", "Schedule", Calendar],
  ["memberships", "Memberships", BadgeCheck],
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [openBoat, setOpenBoat] = useState(null);
  const [recordTab, setRecordTab] = useState("details");
  const [work, setWork] = useState(INITIAL_WORK);
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [updates, setUpdates] = useState(UPDATES_SEED);
  const [boatHours, setBoatHours] = useState({});
  const [dispatches, setDispatches] = useState([]);
  const [intake, setIntake] = useState(false);
  const [dispatch, setDispatch] = useState(null);
  const [pop, setPop] = useState(null);
  const [draft, setDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  const hoursOf = (id) => boatHours[id] ?? boat(id).hours;

  const recoverable = DEFERRED.reduce((s, d) => s + d.amount, 0);
  const dueSoon = BOATS.filter((b) => ["Due now", "Overdue"].includes(b.nextService));
  const partsInbound = parts.filter((p) => p.status < 2).length;

  const go = (t) => { setTab(t); setOpenBoat(null); };
  const openRecord = (id) => { setOpenBoat(id); setRecordTab("details"); setTab("boats"); setPop(null); };
  const advance = (id) => setWork((w) => w.map((x) => (x.id === id ? { ...x, stage: Math.min(x.stage + 1, STAGES.length - 1) } : x)));
  const openDraft = (boatId, item) => { setDraft({ boatId, item, text: recoveryMessage(boat(boatId), item) }); setCopied(false); };

  // Prepend a customer update to the auto-sent feed.
  const pushUpdate = (boatId, text) => setUpdates((u) => [{ id: `u${Date.now()}`, boatId, text, when: "Just now", channel: "SMS" }, ...u]);

  // Advancing a part one stage texts the owner automatically.
  const advancePart = (id) => {
    const p = parts.find((x) => x.id === id);
    if (!p || p.status >= PART_STATUS.length - 1) return;
    const next = p.status + 1;
    setParts((ps) => ps.map((x) => (x.id === id ? { ...x, status: next, notified: true } : x)));
    pushUpdate(p.boatId, partUpdate(boat(p.boatId).name, p.name, next, p.eta));
  };

  // A delay slips the linked job to the next window and tells the owner.
  const reportDelay = (id) => {
    const p = parts.find((x) => x.id === id);
    const job = p && work.find((w) => w.id === p.workId);
    if (!job) return;
    const i = SERVICE_WINDOWS.indexOf(job.scheduled);
    const next = SERVICE_WINDOWS[Math.min(i + 1, SERVICE_WINDOWS.length - 1)];
    if (next === job.scheduled) return;
    setWork((w) => w.map((x) => (x.id === job.id ? { ...x, scheduled: next } : x)));
    pushUpdate(p.boatId, delayUpdate(boat(p.boatId).name, next));
  };

  // Owner or tech logs a fresh hours reading, which re-checks what is due.
  const updateHours = (boatId, hours) => { setBoatHours((h) => ({ ...h, [boatId]: hours })); setIntake(false); };

  // Send a tech to the boat's location and text the owner the details.
  const dispatchTech = ({ boatId, tech, location, window }) => {
    setDispatches((d) => [...d, { boatId, tech, location, window }]);
    pushUpdate(boatId, dispatchUpdate(boat(boatId).name, tech, location, window));
    setDispatch(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-[#181818]" style={{ fontFamily: "'Inter', 'Salesforce Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" }}>
      <header className="bg-[#032d3d] text-white">
        <div className="flex items-center gap-3 px-4 h-14">
          <button className="p-1.5 rounded hover:bg-white/10" title="App launcher" aria-label="App launcher"><Grid size={18} /></button>
          <div className="flex items-center gap-2 pr-3 mr-1 border-r border-white/15">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[#1aa0c4]"><Anchor size={16} /></span>
            <span className="font-bold tracking-tight text-[15px]">Marlin</span>
          </div>
          <button className="flex items-center gap-1 text-[15px] font-bold hover:bg-white/10 rounded px-1.5 h-8">
            Service Console <ChevronDown size={15} className="text-white/70" />
          </button>
          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-2 bg-white/95 text-[#444] rounded-md px-3 h-9">
              <Search size={15} className="text-[#706e6b]" />
              <input placeholder="Search boats, owners, HIN, work orders" className="bg-transparent outline-none text-sm w-full placeholder-[#9aa0a6]" />
            </div>
          </div>
          <button onClick={() => setIntake(true)} className="ml-auto flex items-center gap-2 border border-white/25 text-white text-sm font-semibold rounded-md px-3 h-9 hover:bg-white/10">
            <Gauge size={15} /> <span className="hidden sm:inline">Log hours</span>
          </button>
          <button onClick={() => setPop("b1")} className="flex items-center gap-2 bg-[#1aa0c4] hover:bg-[#1690b0] text-white text-sm font-semibold rounded-md px-3 h-9">
            <Phone size={15} /> <span className="hidden sm:inline">Simulate call</span>
          </button>
          <button className="p-1.5 rounded hover:bg-white/10" aria-label="Help"><HelpCircle size={18} /></button>
          <button className="p-1.5 rounded hover:bg-white/10" aria-label="Setup"><Settings size={18} /></button>
          <button className="p-1.5 rounded hover:bg-white/10" aria-label="Notifications"><Bell size={18} /></button>
          <span className="w-8 h-8 rounded-full bg-[#1aa0c4] grid place-items-center text-xs font-bold">MA</span>
        </div>

        <nav className="flex items-stretch px-2 gap-1 bg-[#053a4e] overflow-x-auto">
          {NAV.map(([id, label, Icon]) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => go(id)} className={"group flex items-center gap-2 px-3 py-2.5 text-[13px] whitespace-nowrap border-b-[3px] " + (active ? "border-[#1aa0c4] text-white font-semibold bg-white/5" : "border-transparent text-white/70 hover:text-white hover:bg-white/5")}>
                <Icon size={15} />{label}
                <ChevronDown size={13} className="text-white/40 group-hover:text-white/70" />
              </button>
            );
          })}
        </nav>
      </header>

      <main className="max-w-[1180px] mx-auto px-4 py-5">
        {openBoat ? (
          <BoatRecord id={openBoat} recordTab={recordTab} setRecordTab={setRecordTab} work={work} parts={parts} updates={updates} hours={hoursOf(openBoat)} onBack={() => setOpenBoat(null)} onCall={setPop} onDraft={openDraft} advance={advance} onDispatch={(id, reason) => setDispatch({ boatId: id, reason })} />
        ) : tab === "home" ? (
          <Home recoverable={recoverable} dueSoon={dueSoon} partsInbound={partsInbound} work={work} openRecord={openRecord} />
        ) : tab === "owners" ? (
          <Owners openRecord={openRecord} />
        ) : tab === "boats" ? (
          <Boats boatHours={boatHours} openRecord={openRecord} />
        ) : tab === "followups" ? (
          <FollowUps boatHours={boatHours} dispatches={dispatches} openRecord={openRecord} onDispatch={(id, reason) => setDispatch({ boatId: id, reason })} onDraft={openDraft} />
        ) : tab === "workorders" ? (
          <WorkOrders work={work} parts={parts} advance={advance} openRecord={openRecord} />
        ) : tab === "parts" ? (
          <Parts parts={parts} updates={updates} work={work} advancePart={advancePart} reportDelay={reportDelay} openRecord={openRecord} />
        ) : tab === "deferred" ? (
          <Deferred recoverable={recoverable} onDraft={openDraft} openRecord={openRecord} />
        ) : tab === "schedule" ? (
          <Schedule />
        ) : (
          <Memberships openRecord={openRecord} />
        )}
      </main>

      {pop && <ScreenPop boatId={pop} onClose={() => setPop(null)} onOpen={openRecord} />}
      {draft && <DraftModal draft={draft} copied={copied} setCopied={setCopied} onClose={() => setDraft(null)} />}
      {intake && <IntakeModal boatHours={boatHours} onSubmit={updateHours} onClose={() => setIntake(false)} />}
      {dispatch && <DispatchModal dispatch={dispatch} onSubmit={dispatchTech} onClose={() => setDispatch(null)} />}
    </div>
  );
}
