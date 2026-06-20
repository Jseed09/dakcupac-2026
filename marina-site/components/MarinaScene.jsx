"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ===== coordinate map (native artwork space: 1536 x 1024) ===== */
const IW = 1536, IH = 1024;
const MARINA_MAP = {
  water: [[0,340],[120,320],[260,330],[390,360],[520,370],[680,380],[830,370],[980,360],[1130,355],[1280,365],[1536,390],[1536,1024],[0,1024]],
  land: [[0,0],[1536,0],[1536,390],[1280,365],[1130,355],[980,360],[830,370],[680,380],[520,370],[390,360],[260,330],[120,320],[0,340]],
  road: [[740,290],[810,245],[900,205],[1010,175],[1120,150],[1240,130],[1380,115],[1536,100]],
  ramp: [[1235,430],[1275,465],[1315,505],[1355,545],[1390,585]],
  buildings: {
    service: [[760,250],[1010,250],[1010,365],[760,365]],
    office: [[520,250],[705,250],[705,360],[520,360]],
    restaurant: [[1040,275],[1225,275],[1225,420],[1040,420]],
    fuel: [[1240,735],[1530,735],[1530,940],[1240,940]],
    jetski: [[1210,690],[1530,690],[1530,940],[1210,940]],
  },
  lanes: {
    A: [[90,520],[260,500],[430,485],[610,475],[780,465]],
    B: [[40,640],[220,620],[420,600],[620,580],[830,560]],
    C: [[220,760],[420,740],[620,720],[820,700],[1010,675]],
    D: [[600,860],[800,835],[1000,810],[1190,785]],
  },
  jetLoop: [[1260,760],[1380,725],[1495,770],[1470,880],[1340,905],[1245,855],[1260,760]],
  hotspots: [
    { id:"office", name:"Marina Office", tag:"ABOUT", cat:"services", p:[615,300], d:"Your welcome, concierge and slip assignments — the heart of Marlin Marina." },
    { id:"service", name:"Service Center", tag:"MAINTENANCE & REPAIRS", cat:"services", p:[885,305], d:"Engines, hulls and electronics. Every boat is the unit of record." },
    { id:"restaurant", name:"The Restaurant", tag:"DINING & EVENTS", cat:"services", p:[1135,335], d:"Lakeside dining and a deck made for sunsets." },
    { id:"sign", name:"Marlin Marina", tag:"WELCOME", cat:"brand", p:[450,295], d:"A premium lakeside marina for the whole family." },
    { id:"launch", name:"Boat Launch", tag:"LAUNCH", cat:"services", p:[1325,515], d:"Wide, well-lit ramp with courtesy docks." },
    { id:"fuel", name:"Fuel Dock", tag:"FUEL SERVICES", cat:"services", p:[1395,830], d:"Fuel, ice and provisioning so you cast off the moment you arrive." },
    { id:"pontoon", name:"Pontoon Slips", tag:"PONTOON RENTALS", cat:"fleet", p:[305,575], d:"Relaxed family cruising — rent by the day or keep yours here." },
    { id:"wake", name:"Wake Boats", tag:"WAKE SPORTS", cat:"fleet", p:[500,675], d:"Surf, wakeboard and ski boats, plus lessons and gear." },
    { id:"fishing", name:"Fishing Boats", tag:"FISHING", cat:"fleet", p:[700,765], d:"Rigged-and-ready fishing boats and local knowledge." },
    { id:"jetski", name:"Jet Skis", tag:"JET SKI RENTALS", cat:"fleet", p:[1375,760], d:"Quick-launch personal watercraft — ride in minutes." },
    { id:"houseboat", name:"Houseboat Slip", tag:"HOUSEBOATS", cat:"fleet", p:[770,805], d:"Wide premium slips with power and water." },
    { id:"transient", name:"Transient Slips", tag:"GUEST DOCKAGE", cat:"fleet", p:[955,665], d:"Tie up, fuel up and stay a night or a season." },
  ],
};
const ptsStr = (a) => a.map((p) => p.join(",")).join(" ");
const R = (a, b) => a + Math.random() * (b - a);

/* ===== geometry ===== */
function pointInPolygon(pt, poly) {
  let x = pt[0], y = pt[1], inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function pathInfo(path) { let segs = [], total = 0; for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0]-path[i-1][0], path[i][1]-path[i-1][1]); segs.push(l); total += l; } return { segs, total }; }
function interpolatePath(path, t) {
  t = Math.max(0, Math.min(1, t)); const { segs, total } = pathInfo(path); let d = t * total;
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const r = segs[i] ? d / segs[i] : 0; const a = path[i], b = path[i+1]; return [a[0]+(b[0]-a[0])*r, a[1]+(b[1]-a[1])*r]; } d -= segs[i]; }
  return path[path.length - 1].slice();
}
function pathAngle(path, t) { const a = interpolatePath(path, Math.max(0, t-0.01)), b = interpolatePath(path, Math.min(1, t+0.01)); return Math.atan2(b[1]-a[1], b[0]-a[0]) * 180 / Math.PI; }
function randInPolygon(poly, avoidBuildings) {
  const xs = poly.map(p=>p[0]), ys = poly.map(p=>p[1]);
  const minx=Math.min(...xs), maxx=Math.max(...xs), miny=Math.min(...ys), maxy=Math.max(...ys);
  for (let i=0;i<50;i++){ const p=[R(minx,maxx),R(miny,maxy)]; if(pointInPolygon(p,poly) && !(avoidBuildings && Object.values(MARINA_MAP.buildings).some(b=>pointInPolygon(p,b)))) return p; }
  return [(minx+maxx)/2,(miny+maxy)/2];
}

let uid = 0;

export default function MarinaScene() {
  const [cam, setCam] = useState({ x: 0, y: 0, s: 1, cover: 1 });
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [dbg, setDbg] = useState(false);
  const [readout, setReadout] = useState("");
  const fxRef = useRef(null);
  const pointers = useRef(new Map());
  const drag = useRef(null);
  const pinch = useRef(null);

  const w2s = useCallback((x, y) => [cam.x + x * cam.s, cam.y + y * cam.s], [cam]);
  const computeView = useCallback((zoom = 1.08) => { const vw = window.innerWidth, vh = window.innerHeight; const cover = Math.max(vw / IW, vh / IH); const s = cover * zoom; return { x: vw / 2 - 760 * s, y: vh / 2 - 600 * s, s, cover }; }, []);
  const clampCam = useCallback((c) => { const vw = window.innerWidth, vh = window.innerHeight, over = Math.min(vw, vh) * 0.2; return { ...c, x: Math.max(vw - IW * c.s - over, Math.min(over, c.x)), y: Math.max(vh - IH * c.s - over, Math.min(over, c.y)) }; }, []);

  useEffect(() => { const init = () => setCam(clampCam(computeView(1.08))); init(); window.addEventListener("resize", init); return () => window.removeEventListener("resize", init); }, [computeView, clampCam]);
  useEffect(() => { const onKey = (e) => { if (e.key === "d" || e.key === "D") setDbg(v => !v); if (e.key === "Escape") setSelected(null); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);

  const zoomAt = useCallback((factor, cx, cy) => { setCam((c) => { const ns = Math.min(c.cover * 1.9, Math.max(c.cover, c.s * factor)); return clampCam({ ...c, s: ns, x: cx - (cx - c.x) * (ns / c.s), y: cy - (cy - c.y) * (ns / c.s) }); }); }, [clampCam]);

  /* ===== ambient life + story + vignettes (imperative, rAF) ===== */
  useEffect(() => {
    const fx = fxRef.current; if (!fx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0, cancelled = false, lastTs = 0;
    const timers = [], styles = [], movers = [];
    const kf = (frames) => { const n = "z" + (uid++); const s = document.createElement("style"); s.textContent = "@keyframes " + n + "{" + frames + "}"; document.head.appendChild(s); styles.push(s); return n; };
    const setT = (el, x, y, extra) => { el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) ${extra || ""}`; };

    /* boats */
    const HUES = ["#c0392f","#1f6f8b","#2a9d8f","#dfe6ea","#7a4b8a","#e0a43b","#16325c"];
    const makeBoat = (color, size) => { const e = document.createElement("div"); e.style.cssText = "position:absolute;left:0;top:0;will-change:transform"; e.innerHTML = `<div style="width:${size}px;height:${size*0.42}px;background:${color};border-radius:7px 16px 16px 7px;box-shadow:0 3px 0 rgba(0,0,0,.16)"></div><div style="position:absolute;left:${size*0.34}px;top:${-size*0.22}px;width:${size*0.32}px;height:${size*0.36}px;background:#e7eef2;border-radius:4px"></div>`; return e; };
    const lanes = [MARINA_MAP.lanes.A, MARINA_MAP.lanes.B, MARINA_MAP.lanes.C, MARINA_MAP.lanes.D];
    for (let i = 0; i < 8; i++) { const el = makeBoat(HUES[i % HUES.length], R(34, 50)); fx.appendChild(el); movers.push({ el, lane: lanes[i % lanes.length], t: Math.random(), dir: Math.random() < 0.5 ? 1 : -1, sp: R(0.012, 0.028), kind: "boat" }); }
    /* jet skis */
    for (let i = 0; i < 3; i++) { const e = document.createElement("div"); e.style.cssText = "position:absolute;left:0;top:0;will-change:transform;filter:drop-shadow(0 2px 2px rgba(0,0,0,.2))"; e.innerHTML = `<div style="width:22px;height:9px;background:${["#ffd23f","#ff5d5d","#3ad1ff"][i]};border-radius:3px 8px 8px 3px"></div>`; fx.appendChild(e); movers.push({ el: e, lane: MARINA_MAP.jetLoop, t: i / 3, dir: 1, sp: R(0.05, 0.08), kind: "jet" }); }
    /* shore: kids + kite on land */
    [["#e74c3c",1455,300],["#2a9d8f",1475,304],["#f1c40f",150,318]].forEach((k, i) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;left:${k[1]}px;top:${k[2]}px;width:8px;height:11px;border-radius:5px;background:${k[0]};animation:mkid 1.5s ease-in-out ${i*0.3}s infinite`; fx.appendChild(d); });
    const kite = document.createElement("div"); kite.style.cssText = "position:absolute;left:1500px;top:230px;width:16px;height:16px;background:linear-gradient(135deg,#e9c893,#c0392f);animation:mkite 5.5s ease-in-out infinite"; kite.innerHTML = '<div style="position:absolute;left:7px;top:14px;width:1px;height:50px;background:rgba(0,0,0,.25)"></div>'; fx.appendChild(kite);

    /* rAF for movers */
    const tick = (ts) => { if (cancelled) return; const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0); lastTs = ts;
      for (const m of movers) { m.t += m.dir * m.sp * dt; if (m.kind === "jet") { if (m.t > 1) m.t -= 1; if (m.t < 0) m.t += 1; } else { if (m.t > 1) { m.t = 1; m.dir = -1; } if (m.t < 0) { m.t = 0; m.dir = 1; } }
        const p = interpolatePath(m.lane, m.t); const extra = m.kind === "jet" ? `rotate(${pathAngle(m.lane, m.t)}deg)` : `scaleX(${m.dir >= 0 ? 1 : -1})`; setT(m.el, p[0], p[1], extra); }
      raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    /* boat-launch story (once) */
    const moveAlong = (el, path, ms, opts) => new Promise((res) => { opts = opts || {}; const st = performance.now(); const step = (now) => { if (cancelled) return res(); const t = Math.min(1, (now - st) / ms); const p = interpolatePath(path, t); const ex = opts.rotate ? `rotate(${pathAngle(path, t)}deg)` : (opts.flip !== undefined ? `scaleX(${opts.flip})` : ""); setT(el, p[0], p[1], ex); if (t < 1) requestAnimationFrame(step); else res(); }; requestAnimationFrame(step); });
    const runStory = async () => {
      const boat = makeBoat("#13314c", 58); boat.style.zIndex = 5; fx.appendChild(boat); setT(boat, 1410, 595, "scaleX(-1)");
      const man = document.createElement("div"); man.style.cssText = "position:absolute;left:0;top:0;width:10px;height:10px;border-radius:50%;background:#10202e;border:2px solid #fff;z-index:6;opacity:0"; fx.appendChild(man); setT(man, 1370, 560);
      const truck = document.createElement("div"); truck.style.cssText = "position:absolute;left:0;top:0;z-index:5;opacity:0"; truck.innerHTML = `<div style="position:absolute;left:-52px;top:14px;width:50px;height:9px;background:#9aa6ac;border-radius:3px"></div><div style="position:absolute;left:6px;top:6px;width:42px;height:20px;background:#7c2a25;border-radius:4px"></div><div style="position:absolute;right:0;top:0;width:26px;height:26px;background:#c0392f;border-radius:5px"></div>`; fx.appendChild(truck);
      const ramp = MARINA_MAP.ramp;
      await moveAlong(boat, [[1410,595],[1390,585]], 1200, { flip: -1 });
      man.style.opacity = 1;
      await moveAlong(man, [[1370,560],[1345,535],[1315,505],[1280,470],[1235,430],[1215,425]], 2600);
      truck.style.opacity = 1; setT(truck, 1215, 425, "rotate(0deg)");
      await moveAlong(truck, ramp, 2600, { rotate: true });
      await moveAlong(boat, [[1410,595],[1390,585]], 900, { flip: -1 });
      await new Promise(r => { const id = setTimeout(r, 500); timers.push(id); });
      const rev = [...ramp].reverse();
      await Promise.all([moveAlong(truck, rev, 2600, { rotate: true }), moveAlong(boat, rev, 2600, { rotate: true })]);
      man.style.opacity = 0;
      const exit = [[1235,430],[1180,395],[1120,350],[1050,315],[980,280],[900,235]];
      await Promise.all([moveAlong(truck, exit, 2600, { rotate: true }), moveAlong(boat, exit, 2600, { rotate: true })]);
      boat.remove(); truck.remove(); man.remove();
    };
    timers.push(setTimeout(runStory, 4000));

    /* zone-aware random vignettes */
    const emoji = (ch, size) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;left:0;top:0;line-height:1;pointer-events:none;will-change:transform;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));font-size:${size}px`; d.textContent = ch; return d; };
    const spawnAt = (ch, size, p, framesFn, dur) => { const el = emoji(ch, size); const n = kf(framesFn(p)); el.style.animation = `${n} ${dur}s ease-in-out forwards`; fx.appendChild(el); timers.push(setTimeout(() => el.remove(), dur * 1000 + 300)); };
    const bob = (p) => `0%{transform:translate3d(${p[0]}px,${p[1]+60}px,0) translate(-50%,-50%) scale(.6);opacity:0}25%{opacity:1;transform:translate3d(${p[0]}px,${p[1]-10}px,0) translate(-50%,-50%) scale(1)}75%{opacity:1;transform:translate3d(${p[0]}px,${p[1]-14}px,0) translate(-50%,-50%)}100%{opacity:0;transform:translate3d(${p[0]}px,${p[1]+60}px,0) translate(-50%,-50%) scale(.6)}`;
    const arc = (p) => `0%{transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) rotate(-25deg);opacity:0}12%{opacity:1}50%{transform:translate3d(${p[0]+70}px,${p[1]-95}px,0) translate(-50%,-50%)}88%{opacity:1}100%{transform:translate3d(${p[0]+140}px,${p[1]}px,0) translate(-50%,-50%) rotate(25deg);opacity:0}`;
    const hold = (p) => `0%{opacity:0;transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scale(.7)}20%{opacity:1;transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scale(1.2)}`;
    const fly = (p) => `0%{transform:translate3d(-180px,${p[1]}px,0) translate(-50%,-50%)}100%{transform:translate3d(1720px,${p[1]}px,0) translate(-50%,-50%)}`;
    const wSpawn = () => randInPolygon(MARINA_MAP.water), lSpawn = () => randInPolygon(MARINA_MAP.land, true), sSpawn = () => [R(150,1380), R(70,200)];
    const VIG = [
      { id:"whale", z:wSpawn, e:"🐳", m:bob, s:50, d:6 }, { id:"dolphin", z:wSpawn, e:"🐬", m:arc, s:38, d:4 },
      { id:"fish", z:wSpawn, e:"🐟", m:arc, s:30, d:4 }, { id:"shark", z:wSpawn, e:"🦈", m:arc, s:36, d:4 },
      { id:"mermaid", z:wSpawn, e:"🧜‍♀️", m:bob, s:42, d:6 }, { id:"turtle", z:wSpawn, e:"🐢", m:bob, s:36, d:6 },
      { id:"duck", z:wSpawn, e:"🦆", m:bob, s:30, d:6 }, { id:"swan", z:wSpawn, e:"🦢", m:bob, s:36, d:6 },
      { id:"dog", z:lSpawn, e:"🐕", m:bob, s:26, d:5 }, { id:"deer", z:lSpawn, e:"🦌", m:bob, s:32, d:6 },
      { id:"picnic", z:lSpawn, e:"🧺", m:hold, s:30, d:7 }, { id:"bird", z:lSpawn, e:"🐦", m:arc, s:22, d:4 },
      { id:"fireworks", z:sSpawn, e:Math.random()<0.5?"🎆":"🎇", m:hold, s:54, d:4 }, { id:"balloon", z:sSpawn, e:"🎈", m:fly, s:44, d:24 },
      { id:"plane", z:sSpawn, e:"✈️", m:fly, s:40, d:22 }, { id:"heli", z:sSpawn, e:"🚁", m:fly, s:40, d:20 },
      { id:"ufo", z:sSpawn, e:"🛸", m:fly, s:44, d:18 }, { id:"rainbow", z:sSpawn, e:"🌈", m:hold, s:120, d:11 },
      { id:"kraken", z:wSpawn, run:(p) => { spawnAt("🚤",40,p,(q)=>`0%{transform:translate3d(${q[0]-180}px,${q[1]}px,0) translate(-50%,-50%)}45%{transform:translate3d(${q[0]}px,${q[1]}px,0) translate(-50%,-50%)}100%{transform:translate3d(${q[0]+10}px,${q[1]+130}px,0) translate(-50%,-50%) rotate(120deg);opacity:0}`,7); spawnAt("🐙",58,p,(q)=>`0%{opacity:0;transform:translate3d(${q[0]+18}px,${q[1]+130}px,0) translate(-50%,-50%)}50%{opacity:0}58%{opacity:1;transform:translate3d(${q[0]+18}px,${q[1]-14}px,0) translate(-50%,-50%)}85%{opacity:1}100%{opacity:0;transform:translate3d(${q[0]+18}px,${q[1]+130}px,0) translate(-50%,-50%)}`,7); }, d:7 },
      { id:"pirates", z:wSpawn, run:(p) => { spawnAt("⛵",46,p,(q)=>`0%{transform:translate3d(${q[0]-240}px,${q[1]}px,0) translate(-50%,-50%)}45%{transform:translate3d(${q[0]-65}px,${q[1]}px,0) translate(-50%,-50%)}100%{transform:translate3d(${q[0]-110}px,${q[1]}px,0) translate(-50%,-50%)}`,8); spawnAt("🏴‍☠️",38,p,(q)=>`0%{transform:translate3d(${q[0]+240}px,${q[1]}px,0) translate(-50%,-50%) scaleX(-1)}45%{transform:translate3d(${q[0]+55}px,${q[1]}px,0) translate(-50%,-50%) scaleX(-1)}100%{transform:translate3d(${q[0]+100}px,${q[1]}px,0) translate(-50%,-50%) scaleX(-1)}`,8); spawnAt("💥",34,p,(q)=>`0%,42%{opacity:0;transform:translate3d(${q[0]}px,${q[1]-6}px,0) translate(-50%,-50%) scale(.4)}48%{opacity:1;transform:translate3d(${q[0]}px,${q[1]-6}px,0) translate(-50%,-50%) scale(1.2)}56%{opacity:0}66%{opacity:1}74%{opacity:0}100%{opacity:0}`,8); }, d:8 },
    ];
    const active = new Set(); let lastVig = null;
    const spawnVig = (v) => { active.add(v.id); const p = v.z(); if (v.run) v.run(p); else spawnAt(v.e, v.s, p, v.m, v.d); lastVig = v.id; timers.push(setTimeout(() => active.delete(v.id), (v.d || 8) * 1000 + 400)); };
    const tickVig = () => { if (cancelled) return; if (active.size < 6) { const c = VIG.filter(v => !active.has(v.id) && v.id !== lastVig); if (c.length) spawnVig(c[(Math.random() * c.length) | 0]); } timers.push(setTimeout(tickVig, R(1300, 2900))); };
    for (let i = 0; i < 3; i++) timers.push(setTimeout(() => { const c = VIG.filter(v => !active.has(v.id)); spawnVig(c[(Math.random() * c.length) | 0]); }, 1500 + i * 900));
    timers.push(setTimeout(tickVig, 3000));

    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else { lastTs = 0; raf = requestAnimationFrame(tick); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelled = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); styles.forEach(s => s.remove()); document.removeEventListener("visibilitychange", onVis); if (fx) fx.innerHTML = ""; };
  }, []);

  /* pointer pan + pinch */
  const onPointerDown = (e) => { if (e.target.closest("[data-ui]")) return; pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pointers.current.size === 1) { drag.current = { sx: e.clientX, sy: e.clientY, moved: false }; setCam((c) => { drag.current.cx = c.x; drag.current.cy = c.y; return c; }); } else if (pointers.current.size === 2) { const [a, b] = [...pointers.current.values()]; pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y) }; } };
  const onPointerMove = (e) => {
    if (dbg) setCam((c) => { setReadout(`x:${Math.round((e.clientX - c.x) / c.s)}  y:${Math.round((e.clientY - c.y) / c.s)}`); return c; });
    if (!pointers.current.has(e.pointerId)) return; pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) { const [a, b] = [...pointers.current.values()]; const nd = Math.hypot(a.x - b.x, a.y - b.y); if (pinch.current.d) zoomAt(nd / pinch.current.d, (a.x + b.x) / 2, (a.y + b.y) / 2); pinch.current.d = nd; return; }
    if (drag.current) { const dx = e.clientX - drag.current.sx, dy = e.clientY - drag.current.sy; if (Math.abs(dx) + Math.abs(dy) > 5) drag.current.moved = true; setCam((c) => clampCam({ ...c, x: drag.current.cx + dx, y: drag.current.cy + dy })); }
  };
  const onPointerUp = (e) => { const wasMoved = drag.current && drag.current.moved; pointers.current.delete(e.pointerId); if (pointers.current.size < 2) pinch.current = null; if (pointers.current.size === 0) { drag.current = null; if (!wasMoved && !e.target.closest("[data-ui]")) { setSelected(null); if (dbg) console.log(`[${Math.round((e.clientX - cam.x) / cam.s)}, ${Math.round((e.clientY - cam.y) / cam.s)}]`); } } };

  const cardPos = selected ? (() => { const [sx, sy] = w2s(selected.p[0], selected.p[1]); let x = sx - 134, y = sy - 168; if (y < 12) y = sy + 26; x = Math.max(12, Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 280)); return { x, y }; })() : null;

  return (
    <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      onWheel={(e) => zoomAt(e.deltaY < 0 ? 1.12 : 0.89, e.clientX, e.clientY)}
      style={{ position: "fixed", inset: 0, overflow: "hidden", cursor: "grab", touchAction: "none",
        background: "linear-gradient(#bfe6f7 0%,#9ad6ef 22%,#4fb0dd 48%,#2a9fd6 72%,#1f86bb 100%)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: IW, height: IH, transformOrigin: "0 0", transform: `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.s})`, willChange: "transform" }}>
        <img src="/marina-art.png" alt="Marlin Marina" width={IW} height={IH} draggable={false} style={{ display: "block", width: IW, height: IH, pointerEvents: "none", userSelect: "none" }} />
        <div ref={fxRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        {dbg && (
          <svg viewBox={`0 0 ${IW} ${IH}`} width={IW} height={IH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <polygon points={ptsStr(MARINA_MAP.water)} fill="rgba(30,200,255,.08)" stroke="#1ec8ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polygon points={ptsStr(MARINA_MAP.land)} fill="rgba(124,252,0,.05)" stroke="#7CFC00" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polyline points={ptsStr(MARINA_MAP.road)} fill="none" stroke="#ffcc00" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polyline points={ptsStr(MARINA_MAP.ramp)} fill="none" stroke="#ff3b3b" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            {Object.values(MARINA_MAP.lanes).map((l, i) => <polyline key={i} points={ptsStr(l)} fill="none" stroke="#ff7ce0" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
            {Object.values(MARINA_MAP.buildings).map((b, i) => <polygon key={i} points={ptsStr(b)} fill="rgba(255,255,255,.06)" stroke="#fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
            {MARINA_MAP.hotspots.map((h) => <g key={h.id}><circle cx={h.p[0]} cy={h.p[1]} r="7" fill="#ffeb3b" stroke="#000" /><text x={h.p[0] + 10} y={h.p[1] + 4} fill="#fff" fontSize="13">{h.id}</text></g>)}
          </svg>
        )}
      </div>

      {MARINA_MAP.hotspots.map((h) => { const [sx, sy] = w2s(h.p[0], h.p[1]); const dim = filter !== "all" && h.cat !== filter; return (
        <motion.button key={h.id} data-ui onClick={(e) => { e.stopPropagation(); setSelected(h); }} onMouseEnter={() => { if (window.matchMedia("(hover:hover)").matches) setSelected(h); }}
          animate={{ opacity: dim ? 0.28 : 1 }} whileHover={{ scale: 1.25 }}
          style={{ position: "absolute", left: sx, top: sy, transform: "translate(-50%,-50%)", width: 24, height: 24, borderRadius: "50%", background: "rgba(54,197,224,.95)", border: "3px solid #fff", boxShadow: "0 5px 14px rgba(0,0,0,.45)", cursor: "pointer", padding: 0, zIndex: 5 }}>
          <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid #36c5e0", animation: "mpulse 2.2s ease-out infinite" }} />
        </motion.button> ); })}

      <div data-ui style={{ position: "fixed", top: 18, left: 20, display: "flex", alignItems: "center", gap: 9, zIndex: 8, background: "rgba(8,30,45,.5)", padding: "8px 14px 8px 12px", borderRadius: 30, border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(8px)" }}>
        <img src="/marlin.png" alt="" style={{ height: 20, filter: "brightness(0) invert(1)" }} />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 19, letterSpacing: "-.4px" }}>Marlin Marina</span>
      </div>

      <nav data-ui style={{ position: "fixed", top: 16, right: 18, display: "flex", gap: 2, background: "#fff", borderRadius: 30, padding: 5, zIndex: 8, boxShadow: "0 8px 24px rgba(0,0,0,.18)" }}>
        {["all", "services", "fleet"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "9px 16px", borderRadius: 24, textTransform: "capitalize", background: filter === f ? "#0f2f44" : "transparent", color: filter === f ? "#fff" : "#13384c" }}>{f}</button>
        ))}
      </nav>

      <div data-ui style={{ position: "fixed", bottom: 18, right: 18, display: "flex", flexDirection: "column", gap: 8, zIndex: 8 }}>
        {[["+", 1.25], ["−", 0.8]].map(([t, f]) => (
          <button key={t} onClick={() => zoomAt(f, window.innerWidth / 2, window.innerHeight / 2)} style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(8,30,45,.6)", color: "#fff", fontSize: 20, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>{t}</button>
        ))}
        <button onClick={() => setCam(clampCam(computeView(1.08)))} style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(8,30,45,.6)", color: "#fff", fontSize: 18, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>⤢</button>
        <button onClick={() => setDbg(v => !v)} style={{ width: 42, height: 42, borderRadius: 12, background: dbg ? "#ff3b3b" : "rgba(8,30,45,.6)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>D</button>
      </div>

      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 8, color: "#08303f", fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.88)", padding: "9px 18px", borderRadius: 22 }}>
        Drag to explore · tap a marker · tap <b>D</b> for debug
      </div>

      {dbg && <div style={{ position: "fixed", left: 12, bottom: 12, zIndex: 10, font: "12px monospace", color: "#fff", background: "rgba(0,0,0,.6)", padding: "4px 8px", borderRadius: 6 }}>{readout || "move/tap to read coords"}</div>}

      <AnimatePresence>
        {selected && cardPos && (
          <motion.div data-ui initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.16 }}
            style={{ position: "fixed", left: cardPos.x, top: cardPos.y, width: 268, zIndex: 9, background: "rgba(8,26,40,.97)", border: "1px solid rgba(54,197,224,.5)", borderRadius: 14, padding: "14px 16px", color: "#eaf3f8", boxShadow: "0 22px 50px -14px rgba(0,0,0,.6)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".7px", color: "#e9c893" }}>{selected.tag}</div>
            <h4 style={{ fontSize: 17, margin: "3px 0 5px", letterSpacing: "-.3px" }}>{selected.name}</h4>
            <p style={{ fontSize: 13, color: "#a7c0cf", lineHeight: 1.45 }}>{selected.d}</p>
            <span style={{ display: "inline-block", marginTop: 11, fontSize: 12, fontWeight: 700, color: "#08202f", background: "#36c5e0", padding: "7px 13px", borderRadius: 9, cursor: "pointer" }}>Open ›</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes mpulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}@keyframes mkid{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes mkite{0%,100%{transform:translate(0,0) rotate(42deg)}50%{transform:translate(10px,-9px) rotate(54deg)}}`}</style>
    </div>
  );
}
