# Marlin

A Salesforce-style service console for marine businesses. The boat is the unit of
record, keyed to its Hull Identification Number. Marlin makes a small shop feel
like a concierge that remembers every customer and every boat, and reaches out
before something breaks.

This repository is a working front-end prototype with seeded demo data. No
backend is wired yet. `src/data/seed.js` is the seam to replace with a real API.

## Quick start
```bash
npm install
npm run dev
```
Open http://localhost:5173.

## Scripts
- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build

## What is in the prototype
- Object navigation: Home, Owners, Boats, Work Orders, Deferred Work, Schedule, Memberships
- Boats list view and a boat record page (the "medical chart") with a highlights
  panel, Details / Maintenance forecast / Service history tabs, and related lists
  for authorized contacts, deferred work, membership, and live service status
- A maintenance forecast tiered Needed / Recommended / Watch, every line tied to evidence
- A Work Orders Kanban across eight service stages with advanceable cards
- A live service status tracker (the "pizza tracker")
- A deferred-work recovery dashboard with on-brand message drafting
- A demand-smoothing schedule view
- A phone screen-pop that surfaces owner, boat, open items, and a talk track

## Tech
Vite, React 18, Tailwind CSS 3, lucide-react. No router, no state library, no
persistence layer.

## For contributors and for Claude Code
See `CLAUDE.md` for architecture, product conventions, and the build-order roadmap.
The two rules that are easy to miss: boat names always render in quotation marks,
and every maintenance recommendation must be tied to evidence.
