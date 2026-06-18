import React from "react";
import { TrendingUp, Gauge, Snowflake, DollarSign, Navigation, MessageSquare, Ship, CheckCircle2 } from "lucide-react";
import { ObjIcon, Pill, Card } from "../lib/ui.jsx";
import { boat, owner, money, hoursDue, monthsUntil } from "../lib/helpers.js";
import { BOATS, DEFERRED, SEASON_CAMPAIGNS, NOW } from "../data/seed.js";
import ListHeader from "./ListHeader.jsx";

export default function FollowUps({ boatHours, dispatches, openRecord, onDispatch, onDraft }) {
  const dispatched = (id) => dispatches.some((d) => d.boatId === id);

  const hoursList = BOATS
    .map((b) => ({ b, d: hoursDue(b, boatHours[b.id]) }))
    .filter((x) => x.d.due || x.d.soon)
    .sort((a, c) => a.d.remaining - c.d.remaining);

  const campaigns = SEASON_CAMPAIGNS
    .map((c) => ({ ...c, away: monthsUntil(c.opensMonth, NOW.month), boats: BOATS.filter(c.applies) }))
    .filter((c) => c.away <= 4)
    .sort((a, c) => a.away - c.away);

  const deferredByBoat = Object.values(DEFERRED.reduce((acc, d) => {
    acc[d.boatId] = acc[d.boatId] || { boatId: d.boatId, amount: 0, count: 0 };
    acc[d.boatId].amount += d.amount; acc[d.boatId].count += 1; return acc;
  }, {})).sort((a, c) => c.amount - a.amount);

  const onTable = DEFERRED.reduce((s, d) => s + d.amount, 0);

  const Row = ({ id, reason, children }) => {
    const b = boat(id);
    return (
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f4f4f4] last:border-0">
        <ObjIcon icon={Ship} hue={b.hue} size={30} />
        <div className="flex-1 min-w-0">
          <button onClick={() => openRecord(id)} className="font-semibold text-[#0a6e8c] hover:underline">"{b.name}"</button>
          <span className="text-xs text-[#706e6b] ml-2">{owner(id).name}</span>
          <div className="text-[12px] text-[#5f6368] mt-0.5">{reason}</div>
          <div className="text-[11px] text-[#9aa0a6] mt-0.5">{b.location}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {children}
          {dispatched(id)
            ? <Pill bg="#e6f4ea" fg="#1b6b34"><CheckCircle2 size={11} /> Tech dispatched</Pill>
            : <button onClick={() => onDispatch(id, reason)} className="flex items-center gap-1.5 bg-[#1aa0c4] hover:bg-[#1690b0] text-white text-[12px] font-semibold rounded-md px-2.5 h-7">
                <Navigation size={13} /> Dispatch tech
              </button>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <ListHeader icon={TrendingUp} hue="#1b6b34" kind="Follow-ups" sub="Revenue you have not booked yet" count={hoursList.length + campaigns.reduce((s, c) => s + c.boats.length, 0) + deferredByBoat.length} />

      <div className="bg-[#e6f4ea] border border-[#bfe3cb] rounded-lg p-4 mb-4 flex items-center gap-3">
        <ObjIcon icon={TrendingUp} hue="#1b6b34" size={38} />
        <div>
          <div className="text-[12px] text-[#1b6b34] font-semibold uppercase tracking-wide">Quoted work still sitting open</div>
          <div className="text-3xl font-bold text-[#14502a]">{money(onTable)}</div>
        </div>
        <div className="ml-auto text-[12px] text-[#1b6b34] max-w-xs">
          Shops lose this by not following up. Marlin keeps the list in front of you and books the visit, so it does not slip.
        </div>
      </div>

      <div className="space-y-4">
        <Card title="Due by engine hours" icon={Gauge} action={<span className="text-[11px] text-[#9aa0a6]">{hoursList.length} boats</span>}>
          {hoursList.length === 0
            ? <div className="px-4 py-4 text-[13px] text-[#9aa0a6]">Nobody is over on hours right now.</div>
            : hoursList.map(({ b, d }) => (
              <Row key={b.id} id={b.id}
                reason={d.due
                  ? `At ${d.hours} hrs, past the ${b.hoursInterval}-hour interval (due at ${d.dueAt}).`
                  : `At ${d.hours} hrs, ${d.remaining} to go before the ${b.hoursInterval}-hour service.`}>
                <Pill bg={d.due ? "#fde7e7" : "#fff4e0"} fg={d.due ? "#b42121" : "#9a5b00"}>{d.due ? "Due now" : "Soon"}</Pill>
              </Row>
            ))}
        </Card>

        {campaigns.map((c) => (
          <Card key={c.id} title={c.name} icon={Snowflake}
            action={<span className="text-[11px] text-[#9a5b00] font-semibold">Books {c.window} · opens in {c.away} mo</span>}>
            <div className="px-4 py-2.5 text-[13px] text-[#5f6368] border-b border-[#f4f4f4]">{c.why}</div>
            {c.boats.map((b) => (
              <Row key={b.id} id={b.id} reason={`${b.climate} climate. Book the ${c.name.toLowerCase()} before the rush.`}>
                <Pill bg="#fff4e0" fg="#9a5b00">Seasonal</Pill>
              </Row>
            ))}
          </Card>
        ))}

        <Card title="Quoted work never closed" icon={DollarSign} action={<span className="text-sm font-bold text-[#1b6b34]">{money(onTable)}</span>}>
          {deferredByBoat.map((r) => (
            <Row key={r.boatId} id={r.boatId} reason={`${r.count} quoted item${r.count > 1 ? "s" : ""} worth ${money(r.amount)}, still open.`}>
              <button onClick={() => onDraft(r.boatId, "the quoted work we flagged")} className="flex items-center gap-1.5 border border-[#d0d0d0] text-[#0a6e8c] text-[12px] font-semibold rounded-md px-2.5 h-7 hover:bg-[#f7fbfd]">
                <MessageSquare size={13} /> Follow up
              </button>
            </Row>
          ))}
        </Card>
      </div>
    </div>
  );
}
