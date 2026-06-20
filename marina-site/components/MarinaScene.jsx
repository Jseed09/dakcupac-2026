"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WATER_MASK as WM } from "../lib/watermask";

const IW = 1536, IH = 1024;

/* ===== water mask: the hard "where boats may go" map (docks/land = off-limits) ===== */
let _bits = null;
function maskBits() { if (_bits) return _bits; const bin = atob(WM.bits); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); _bits = a; return a; }
function isWater(x, y) { if (x < 0 || y < 0 || x >= WM.IW || y >= WM.IH) return false; const cx = Math.floor(x / WM.IW * WM.MW), cy = Math.floor(y / WM.IH * WM.MH); const idx = cy * WM.MW + cx; return ((maskBits()[idx >> 3] >> (7 - (idx & 7))) & 1) === 1; }
function randWater() { for (let i = 0; i < 60; i++) { const p = [R(60, IW - 60), R(420, IH - 30)]; if (isWater(p[0], p[1])) return p; } return [200, 950]; }

const MARINA_MAP = {
  // cruising lanes through open water only (verified against the water mask)
  lanes: {
    front: [[90, 945], [430, 968], [820, 972], [1180, 960], [1450, 942]],
    left: [[80, 450], [92, 650], [102, 840], [110, 950]],
    right: [[1280, 520], [1290, 700], [1296, 860], [1298, 945]],
  },
  hotspots: [
    { id:"sign", name:"Marlin Marina", tag:"WELCOME", cat:"brand", p:[470,300], d:"A premium lakeside marina for the whole family." },
    { id:"office", name:"Marina Office", tag:"ABOUT", cat:"services", p:[650,315], d:"Your welcome, concierge and slip assignments — the heart of Marlin Marina." },
    { id:"service", name:"Service Center", tag:"MAINTENANCE & REPAIRS", cat:"services", p:[850,315], d:"Engines, hulls and electronics. Every boat is the unit of record." },
    { id:"restaurant", name:"The Restaurant", tag:"DINING & EVENTS", cat:"services", p:[1150,360], d:"Lakeside dining and a deck made for sunsets." },
    { id:"launch", name:"Boat Launch", tag:"LAUNCH", cat:"services", p:[1390,470], d:"Wide, well-lit ramp with courtesy docks." },
    { id:"fuel", name:"Fuel Dock", tag:"FUEL SERVICES", cat:"services", p:[1360,800], d:"Fuel, ice and provisioning so you cast off the moment you arrive." },
    { id:"pontoon", name:"Pontoon Slips", tag:"PONTOON RENTALS", cat:"fleet", p:[250,560], d:"Relaxed family cruising — rent by the day or keep yours here." },
    { id:"wake", name:"Wake Boats", tag:"WAKE SPORTS", cat:"fleet", p:[460,660], d:"Surf, wakeboard and ski boats, plus lessons and gear." },
    { id:"fishing", name:"Fishing Boats", tag:"FISHING", cat:"fleet", p:[700,740], d:"Rigged-and-ready fishing boats and local knowledge." },
    { id:"transient", name:"Transient Slips", tag:"GUEST DOCKAGE", cat:"fleet", p:[1040,650], d:"Tie up, fuel up and stay a night or a season." },
    { id:"houseboat", name:"Houseboat Slip", tag:"HOUSEBOATS", cat:"fleet", p:[900,790], d:"Wide premium slips with power and water." },
    { id:"jetski", name:"Jet Skis", tag:"JET SKI RENTALS", cat:"fleet", p:[1330,865], d:"Quick-launch personal watercraft — ride in minutes." },
  ],
};
function R(a, b) { return a + Math.random() * (b - a); }
function pathInfo(path) { let segs = [], total = 0; for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0]-path[i-1][0], path[i][1]-path[i-1][1]); segs.push(l); total += l; } return { segs, total }; }
function interpolatePath(path, t) { t = Math.max(0, Math.min(1, t)); const { segs, total } = pathInfo(path); let d = t * total; for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const r = segs[i] ? d / segs[i] : 0; const a = path[i], b = path[i+1]; return [a[0]+(b[0]-a[0])*r, a[1]+(b[1]-a[1])*r]; } d -= segs[i]; } return path[path.length - 1].slice(); }
const ptsStr = (a) => a.map((p) => p.join(",")).join(" ");

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

  /* ===== gentle life — strictly in open water ===== */
  useEffect(() => {
    const fx = fxRef.current; if (!fx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, cancelled = false, lastTs = 0;
    const timers = [], styles = [], movers = [];
    const kf = (frames) => { const n = "z" + (uid++); const s = document.createElement("style"); s.textContent = "@keyframes " + n + "{" + frames + "}"; document.head.appendChild(s); styles.push(s); return n; };

    // forward cruising route around the open water (left edge -> across the front -> up the right edge)
    const ROUTE = [[100,470],[95,650],[100,840],[150,930],[430,965],[820,972],[1180,962],[1280,905],[1294,760],[1296,600],[1292,520]];
    const makeBoat = (w) => { const e = document.createElement("img"); e.src = "/boat.png"; e.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:auto;will-change:transform;pointer-events:none;filter:drop-shadow(0 4px 5px rgba(0,0,0,.2))`; return e; };
    const boats = [];
    for (let i = 0; i < 3; i++) { const el = makeBoat(R(96, 122)); fx.appendChild(el); boats.push({ el, t: i / 3, sp: R(0.018, 0.03) }); }

    // waves — only on water cells
    for (let i = 0; i < 11; i++) { const p = randWater(); const w = R(22, 46); const d = document.createElement("div"); d.style.cssText = `position:absolute;left:${p[0]}px;top:${p[1]}px;width:${w}px;height:0;border-top:3px solid rgba(255,255,255,.5);border-radius:50%;animation:mwave ${R(2.6,4.4)}s ease-in-out ${R(0,3)}s infinite`; fx.appendChild(d); }

    const tick = (ts) => { if (cancelled) return; const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0); lastTs = ts;
      for (const b of boats) { b.t += b.sp * dt; if (b.t >= 1) b.t = 0;
        const p = interpolatePath(ROUTE, b.t); const a = interpolatePath(ROUTE, Math.min(1, b.t + 0.012));
        const hx = a[0] - p[0], hy = a[1] - p[1]; const flip = hx < 0 ? 1 : -1; const tilt = Math.max(-16, Math.min(16, hy * 0.5));
        b.el.style.opacity = b.t < 0.05 ? b.t / 0.05 : b.t > 0.95 ? (1 - b.t) / 0.05 : 1;
        b.el.style.transform = `translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scaleX(${flip}) rotate(${tilt}deg)`; }
      raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    // rare wildlife — water creatures on water only, one at a time every ~30-45s
    const emoji = (ch, size) => { const d = document.createElement("div"); d.style.cssText = `position:absolute;left:0;top:0;line-height:1;pointer-events:none;will-change:transform;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));font-size:${size}px`; d.textContent = ch; return d; };
    const spawnAt = (ch, size, p, framesFn, dur) => { const el = emoji(ch, size); const n = kf(framesFn(p)); el.style.animation = `${n} ${dur}s ease-in-out forwards`; fx.appendChild(el); timers.push(setTimeout(() => el.remove(), dur * 1000 + 300)); };
    const bob = (p) => `0%{transform:translate3d(${p[0]}px,${p[1]+46}px,0) translate(-50%,-50%) scale(.6);opacity:0}25%{opacity:1;transform:translate3d(${p[0]}px,${p[1]-8}px,0) translate(-50%,-50%) scale(1)}75%{opacity:1}100%{opacity:0;transform:translate3d(${p[0]}px,${p[1]+46}px,0) translate(-50%,-50%) scale(.6)}`;
    const arc = (p) => `0%{transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) rotate(-22deg);opacity:0}12%{opacity:1}50%{transform:translate3d(${p[0]+55}px,${p[1]-75}px,0) translate(-50%,-50%)}88%{opacity:1}100%{transform:translate3d(${p[0]+110}px,${p[1]}px,0) translate(-50%,-50%) rotate(22deg);opacity:0}`;
    const skyfly = (p) => `0%{transform:translate3d(-180px,${p[1]}px,0) translate(-50%,-50%)}100%{transform:translate3d(1720px,${p[1]}px,0) translate(-50%,-50%)}`;
    const hold = (p) => `0%{opacity:0;transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scale(.7)}20%{opacity:1;transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate3d(${p[0]}px,${p[1]}px,0) translate(-50%,-50%) scale(1.2)}`;
    const sky = () => [R(150, 1380), R(70, 200)];
    const VIG = [
      { id:"whale", z:randWater, e:"🐳", m:bob, s:46, d:6 }, { id:"dolphin", z:randWater, e:"🐬", m:arc, s:36, d:4 },
      { id:"duck", z:randWater, e:"🦆", m:bob, s:28, d:6 }, { id:"swan", z:randWater, e:"🦢", m:bob, s:34, d:6 },
      { id:"turtle", z:randWater, e:"🐢", m:bob, s:32, d:6 }, { id:"fish", z:randWater, e:"🐟", m:arc, s:28, d:4 },
      { id:"fireworks", z:sky, e:Math.random()<.5?"🎆":"🎇", m:hold, s:52, d:4 }, { id:"plane", z:sky, e:"✈️", m:skyfly, s:40, d:22 },
      { id:"rainbow", z:sky, e:"🌈", m:hold, s:110, d:11 },
      { id:"kraken", z:randWater, run:(p)=>{ spawnAt("🐙",54,p,(q)=>`0%{opacity:0;transform:translate3d(${q[0]}px,${q[1]+120}px,0) translate(-50%,-50%)}30%{opacity:1;transform:translate3d(${q[0]}px,${q[1]-12}px,0) translate(-50%,-50%)}80%{opacity:1}100%{opacity:0;transform:translate3d(${q[0]}px,${q[1]+120}px,0) translate(-50%,-50%)}`,6); }, d:6 },
    ];
    const active = new Set(); let lastVig = null;
    const spawnVig = (v) => { active.add(v.id); const p = v.z(); if (v.run) v.run(p); else spawnAt(v.e, v.s, p, v.m, v.d); lastVig = v.id; timers.push(setTimeout(() => active.delete(v.id), (v.d || 8) * 1000 + 400)); };
    const tickVig = () => { if (cancelled) return; if (active.size < 1) { const c = VIG.filter(v => !active.has(v.id) && v.id !== lastVig); if (c.length) spawnVig(c[(Math.random() * c.length) | 0]); } timers.push(setTimeout(tickVig, R(30000, 45000))); };
    // emoji wildlife events disabled — they clashed with the art style (plane, etc.).
    void [emoji, spawnVig, tickVig];

    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else { lastTs = 0; raf = requestAnimationFrame(tick); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelled = true; cancelAnimationFrame(raf); timers.forEach(clearTimeout); styles.forEach(s => s.remove()); document.removeEventListener("visibilitychange", onVis); if (fx) fx.innerHTML = ""; };
  }, []);

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
      style={{ position: "fixed", inset: 0, overflow: "hidden", cursor: "grab", touchAction: "none", background: "linear-gradient(#bfe6f7 0%,#9ad6ef 22%,#4fb0dd 48%,#2a9fd6 72%,#1f86bb 100%)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: IW, height: IH, transformOrigin: "0 0", transform: `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.s})`, willChange: "transform" }}>
        <img src="/marina-art.png" alt="Marlin Marina" width={IW} height={IH} draggable={false} style={{ display: "block", width: IW, height: IH, pointerEvents: "none", userSelect: "none" }} />
        <div ref={fxRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        {dbg && (
          <svg viewBox={`0 0 ${IW} ${IH}`} width={IW} height={IH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Object.values(MARINA_MAP.lanes).map((l, i) => <polyline key={i} points={ptsStr(l)} fill="none" stroke="#ff7ce0" strokeWidth="3" vectorEffect="non-scaling-stroke" />)}
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
        {["all", "services", "fleet"].map((f) => <button key={f} onClick={() => setFilter(f)} style={{ border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "9px 16px", borderRadius: 24, textTransform: "capitalize", background: filter === f ? "#0f2f44" : "transparent", color: filter === f ? "#fff" : "#13384c" }}>{f}</button>)}
      </nav>
      <div data-ui style={{ position: "fixed", bottom: 18, right: 18, display: "flex", flexDirection: "column", gap: 8, zIndex: 8 }}>
        {[["+", 1.25], ["−", 0.8]].map(([t, f]) => <button key={t} onClick={() => zoomAt(f, window.innerWidth / 2, window.innerHeight / 2)} style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(8,30,45,.6)", color: "#fff", fontSize: 20, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>{t}</button>)}
        <button onClick={() => setCam(clampCam(computeView(1.08)))} style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(8,30,45,.6)", color: "#fff", fontSize: 18, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>⤢</button>
        <button onClick={() => setDbg(v => !v)} style={{ width: 42, height: 42, borderRadius: 12, background: dbg ? "#ff3b3b" : "rgba(8,30,45,.6)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>D</button>
      </div>
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 8, color: "#08303f", fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.88)", padding: "9px 18px", borderRadius: 22 }}>Drag to explore · tap a marker · tap <b>D</b> for debug</div>
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

      <style>{`@keyframes mpulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}@keyframes mwave{0%,100%{opacity:.2;transform:scaleX(.7)}50%{opacity:.6;transform:scaleX(1.2)}}`}</style>
    </div>
  );
}
