# Marlin Marina — interactive homepage (Next.js)

An explorable, illustrated marina world. The marina **is** the navigation: pan/zoom
the scene and tap buildings/docks for services. Built with **Next.js + Framer Motion**
(SVG/DOM layers, no WebGL) so it stays fast on mobile.

## Deploy on Vercel (one-time, ~2 min — works from iPad)

1. Go to **vercel.com** and sign in with **GitHub**.
2. **Add New… → Project**, and **Import** the repo `Jseed09/dakcupac-2026`.
3. IMPORTANT: set **Root Directory** to **`marina-site`** (click *Edit* next to Root Directory and pick the folder).
   - Framework should auto-detect as **Next.js**. Leave build/output defaults.
4. Click **Deploy**. Vercel installs dependencies and builds it (this environment can't,
   but Vercel can).
5. You get a live URL like `https://<project>.vercel.app`. Every push to the branch
   redeploys automatically — that URL is the feedback loop.

To deploy the working branch first: in the Vercel project, set the **Production Branch**
to `claude/new-session-bmwdvn` (Settings → Git), or merge to `main` when ready.

## Local dev (optional, on a computer)

```bash
cd marina-site
npm install
npm run dev   # http://localhost:3000
```

## Structure

- `app/` — Next.js App Router (layout, page, global CSS)
- `components/MarinaScene.jsx` — the interactive scene: camera (pan/zoom/clamp),
  `MARINA_MAP` coordinate system, hotspot markers, info cards (Framer Motion),
  category filter, and a **debug overlay** (press **`D`**) that draws every
  zone/path/hotspot and logs world coordinates on click — used to tune positions
  against the artwork.
- `public/marina-art.png` — the marina illustration (1536×1024)
- `public/marlin.png` — the marlin logo

## Roadmap (next, once the deploy loop is confirmed)

- Tune `MARINA_MAP` coordinates using the debug overlay so every dock/ramp/lane
  lines up with the art.
- Zone-locked ambient life (boats on lanes, jet skis, shore vignettes).
- Path-based boat-launch story (plays once per load).
- Layered illustration for true per-element animation.
