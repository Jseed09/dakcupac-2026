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

export default function MarinaScene() {
  const stageRef = useRef(null);
  const [cam, setCam] = useState({ x: 0, y: 0, s: 1, cover: 1 });
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [dbg, setDbg] = useState(false);
  const [readout, setReadout] = useState("");
  const pointers = useRef(new Map());
  const drag = useRef(null);
  const pinch = useRef(null);

  const w2s = useCallback((x, y) => [cam.x + x * cam.s, cam.y + y * cam.s], [cam]);

  const computeView = useCallback((zoom = 1.08) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const cover = Math.max(vw / IW, vh / IH);
    const s = cover * zoom;
    return { x: vw / 2 - 760 * s, y: vh / 2 - 600 * s, s, cover };
  }, []);

  const clampCam = useCallback((c) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const over = Math.min(vw, vh) * 0.2;
    return {
      ...c,
      x: Math.max(vw - IW * c.s - over, Math.min(over, c.x)),
      y: Math.max(vh - IH * c.s - over, Math.min(over, c.y)),
    };
  }, []);

  useEffect(() => {
    const init = () => setCam(clampCam(computeView(1.08)));
    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, [computeView, clampCam]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "d" || e.key === "D") setDbg((v) => !v);
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const zoomAt = useCallback((factor, cx, cy) => {
    setCam((c) => {
      const ns = Math.min(c.cover * 1.9, Math.max(c.cover, c.s * factor));
      return clampCam({ ...c, s: ns, x: cx - (cx - c.x) * (ns / c.s), y: cy - (cy - c.y) * (ns / c.s) });
    });
  }, [clampCam]);

  /* pointer pan + pinch */
  const onPointerDown = (e) => {
    if (e.target.closest("[data-ui]")) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      drag.current = { sx: e.clientX, sy: e.clientY, moved: false };
      setCam((c) => { drag.current.cx = c.x; drag.current.cy = c.y; return c; });
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  };
  const onPointerMove = (e) => {
    if (dbg) {
      setCam((c) => { setReadout(`x:${Math.round((e.clientX - c.x) / c.s)}  y:${Math.round((e.clientY - c.y) / c.s)}`); return c; });
    }
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const nd = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.d) zoomAt(nd / pinch.current.d, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch.current.d = nd;
      return;
    }
    if (drag.current) {
      const dx = e.clientX - drag.current.sx, dy = e.clientY - drag.current.sy;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.current.moved = true;
      setCam((c) => clampCam({ ...c, x: drag.current.cx + dx, y: drag.current.cy + dy }));
    }
  };
  const onPointerUp = (e) => {
    const wasMoved = drag.current && drag.current.moved;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      if (!wasMoved && !e.target.closest("[data-ui]")) {
        setSelected(null);
        if (dbg) { const wx = Math.round((e.clientX - cam.x) / cam.s), wy = Math.round((e.clientY - cam.y) / cam.s); console.log(`[${wx}, ${wy}]`); }
      }
    }
  };

  const cardPos = selected ? (() => {
    const [sx, sy] = w2s(selected.p[0], selected.p[1]);
    let x = sx - 134, y = sy - 168;
    if (y < 12) y = sy + 26;
    x = Math.max(12, Math.min(x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 280));
    return { x, y };
  })() : null;

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={(e) => zoomAt(e.deltaY < 0 ? 1.12 : 0.89, e.clientX, e.clientY)}
      style={{ position: "fixed", inset: 0, overflow: "hidden", cursor: "grab",
        background: "linear-gradient(#bfe6f7 0%,#9ad6ef 22%,#4fb0dd 48%,#2a9fd6 72%,#1f86bb 100%)", touchAction: "none" }}
    >
      {/* world */}
      <div style={{ position: "absolute", top: 0, left: 0, width: IW, height: IH,
        transformOrigin: "0 0", transform: `translate3d(${cam.x}px,${cam.y}px,0) scale(${cam.s})`, willChange: "transform" }}>
        <img src="/marina-art.png" alt="Marlin Marina" width={IW} height={IH}
          draggable={false} style={{ display: "block", width: IW, height: IH, pointerEvents: "none", userSelect: "none" }} />
        {dbg && (
          <svg viewBox={`0 0 ${IW} ${IH}`} width={IW} height={IH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <polygon points={ptsStr(MARINA_MAP.water)} fill="rgba(30,200,255,.08)" stroke="#1ec8ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polygon points={ptsStr(MARINA_MAP.land)} fill="rgba(124,252,0,.05)" stroke="#7CFC00" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polyline points={ptsStr(MARINA_MAP.road)} fill="none" stroke="#ffcc00" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polyline points={ptsStr(MARINA_MAP.ramp)} fill="none" stroke="#ff3b3b" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            {Object.values(MARINA_MAP.lanes).map((l, i) => (
              <polyline key={i} points={ptsStr(l)} fill="none" stroke="#ff7ce0" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            ))}
            {Object.values(MARINA_MAP.buildings).map((b, i) => (
              <polygon key={i} points={ptsStr(b)} fill="rgba(255,255,255,.06)" stroke="#fff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            ))}
            {MARINA_MAP.hotspots.map((h) => (
              <g key={h.id}>
                <circle cx={h.p[0]} cy={h.p[1]} r="7" fill="#ffeb3b" stroke="#000" />
                <text x={h.p[0] + 10} y={h.p[1] + 4} fill="#fff" fontSize="13">{h.id}</text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* hotspot markers (constant screen size) */}
      {MARINA_MAP.hotspots.map((h) => {
        const [sx, sy] = w2s(h.p[0], h.p[1]);
        const dim = filter !== "all" && h.cat !== filter;
        return (
          <motion.button
            key={h.id}
            data-ui
            onClick={(e) => { e.stopPropagation(); setSelected(h); }}
            onMouseEnter={() => { if (window.matchMedia("(hover:hover)").matches) setSelected(h); }}
            animate={{ opacity: dim ? 0.28 : 1 }}
            whileHover={{ scale: 1.25 }}
            style={{ position: "absolute", left: sx, top: sy, transform: "translate(-50%,-50%)",
              width: 24, height: 24, borderRadius: "50%", background: "rgba(54,197,224,.95)",
              border: "3px solid #fff", boxShadow: "0 5px 14px rgba(0,0,0,.45)", cursor: "pointer", padding: 0, zIndex: 5 }}
          >
            <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid #36c5e0",
              animation: "mpulse 2.2s ease-out infinite" }} />
          </motion.button>
        );
      })}

      {/* logo */}
      <div data-ui style={{ position: "fixed", top: 18, left: 20, display: "flex", alignItems: "center", gap: 9, zIndex: 8,
        background: "rgba(8,30,45,.5)", padding: "8px 14px 8px 12px", borderRadius: 30, border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(8px)" }}>
        <img src="/marlin.png" alt="" style={{ height: 20, filter: "brightness(0) invert(1)" }} />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 19, letterSpacing: "-.4px" }}>Marlin Marina</span>
      </div>

      {/* menu */}
      <nav data-ui style={{ position: "fixed", top: 16, right: 18, display: "flex", gap: 2, background: "#fff",
        borderRadius: 30, padding: 5, zIndex: 8, boxShadow: "0 8px 24px rgba(0,0,0,.18)" }}>
        {["all", "services", "fleet"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: "9px 16px", borderRadius: 24,
              textTransform: "capitalize", background: filter === f ? "#0f2f44" : "transparent", color: filter === f ? "#fff" : "#13384c" }}>
            {f}
          </button>
        ))}
      </nav>

      {/* zoom controls */}
      <div data-ui style={{ position: "fixed", bottom: 18, right: 18, display: "flex", flexDirection: "column", gap: 8, zIndex: 8 }}>
        {[["+", 1.25], ["−", 0.8]].map(([t, f]) => (
          <button key={t} onClick={() => zoomAt(f, window.innerWidth / 2, window.innerHeight / 2)}
            style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(8,30,45,.6)", color: "#fff", fontSize: 20, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>{t}</button>
        ))}
        <button onClick={() => setCam(clampCam(computeView(1.08)))}
          style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(8,30,45,.6)", color: "#fff", fontSize: 18, cursor: "pointer", border: "1px solid rgba(255,255,255,.2)" }}>⤢</button>
      </div>

      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 8,
        color: "#08303f", fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,.88)", padding: "9px 18px", borderRadius: 22 }}>
        Drag to explore · tap a marker · press D for debug
      </div>

      {dbg && (
        <div style={{ position: "fixed", left: 12, bottom: 12, zIndex: 10, font: "12px monospace", color: "#fff",
          background: "rgba(0,0,0,.6)", padding: "4px 8px", borderRadius: 6 }}>{readout}</div>
      )}

      {/* info card */}
      <AnimatePresence>
        {selected && cardPos && (
          <motion.div data-ui
            initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            style={{ position: "fixed", left: cardPos.x, top: cardPos.y, width: 268, zIndex: 9,
              background: "rgba(8,26,40,.97)", border: "1px solid rgba(54,197,224,.5)", borderRadius: 14, padding: "14px 16px",
              color: "#eaf3f8", boxShadow: "0 22px 50px -14px rgba(0,0,0,.6)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".7px", color: "#e9c893" }}>{selected.tag}</div>
            <h4 style={{ fontSize: 17, margin: "3px 0 5px", letterSpacing: "-.3px" }}>{selected.name}</h4>
            <p style={{ fontSize: 13, color: "#a7c0cf", lineHeight: 1.45 }}>{selected.d}</p>
            <span style={{ display: "inline-block", marginTop: 11, fontSize: 12, fontWeight: 700, color: "#08202f",
              background: "#36c5e0", padding: "7px 13px", borderRadius: 9, cursor: "pointer" }}>Open ›</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes mpulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}`}</style>
    </div>
  );
}
