# CLAUDE.md

Guidance for Claude Code working in this repo. Read this before making changes.

## What this is
Marlin is a service console for marine businesses (outboard service, jet skis,
boats, yachts), modeled on Salesforce Lightning. It is a working front-end
prototype with seeded demo data. No backend yet.

## The one idea that drives the data model
The boat is the unit of record, keyed to its HIN. People link to boats, not the
other way around. A boat outlives its owner, dealer, and mechanic, so the record
persists and transfers. When you add features, keep the boat at the center.

## Run it
- `npm install`
- `npm run dev` then open http://localhost:5173
- `npm run build` to produce `dist/`
- `npm run preview` to serve the build

## Stack
- Vite + React 18 (function components, hooks, no router)
- Tailwind CSS 3 (utility classes, arbitrary hex values are intentional)
- lucide-react for icons
- No state library. App-level state lives in `src/App.jsx` via `useState`.
- No persistence. Do not add localStorage or sessionStorage.

## Architecture map
- `src/App.jsx` — shell: top header, object nav, view router (tab state), modals.
  All shared state and handlers (openRecord, advance, openDraft) live here and
  pass down as props.
- `src/data/seed.js` — all demo data: OWNERS, BOATS, CONTACTS, FORECAST, HISTORY,
  DEFERRED, STAGES, INITIAL_WORK, MEMBERSHIPS. This is the seam to replace with a
  real API/database layer. Keep the shapes stable or update consumers.
- `src/lib/helpers.js` — `boat(id)`, `owner(id)`, `money(n)`, the HEALTH and TIER
  color maps, and `recoveryMessage(boat, item)`.
- `src/lib/ui.jsx` — shared presentational pieces: ObjIcon, Pill, HealthPill, Card,
  Path (Salesforce-style chevron stage bar), DataTable (SLDS list table shell).
- `src/components/*` — one file per view or feature. ListHeader is shared by the
  list views. LiveStatus renders inside BoatRecord.

## Views
Home, Owners, Boats, BoatRecord (Details / Maintenance forecast / Service history
tabs plus related lists), WorkOrders (Kanban over STAGES), Deferred (recoverable
revenue), Schedule (demand smoothing), Memberships. ScreenPop and DraftModal are
overlays.

## Product conventions, do not break these
- Boat names ALWAYS render in quotation marks everywhere on screen. Example:
  `"{b.name}"`. This is the product's signature, not a typo.
- Every maintenance recommendation is tiered (Needed / Recommended / Watch) and
  tied to evidence (hours, age, a fault, a photo). Never surface a recommendation
  without a reason. The honesty discipline is the product.
- Deferred-work recovery means surfacing real, owner-acknowledged, quoted work.
  It never means manufacturing a reason to call.
- Outreach copy is warm, one ask, names the boat in quotes, gives a reason to act
  now, and never pressures. See `recoveryMessage`.

## Writing style for any copy or docs you add
- No em dashes. Use periods, commas, colons, or parentheses.
- Plain, active voice. Name things by what the user controls.

## Look and feel (Salesforce Lightning, boating brand)
The target is to read like Salesforce Lightning Experience with a marine brand.
Match SLDS patterns: global header + object nav, list-view headers, record
highlights panel, Path chevrons, data tables with row-action carets.

- Font: Inter (loaded in index.html), falling back to the system sans stack.
- Global header: Salesforce navy #16325c with white text and centered search.
- Nav bar: the white Lightning variant (white bg, #3e3e3c tabs, active tab is
  #0176d3 text with a #0176d3 underline). It sits below the navy header.
- Brand/accent and links: SLDS blue #0176d3, hover #015fb0.
- Boating accent kept subtle: the Marlin anchor tile stays teal #1aa0c4, and
  per-record object icons keep their colorful hues.
- App background #f3f3f3, cards white with #dddbda (SLDS) borders
- Table header #fafaf9, row hover #f3f2f2, borders #dddbda
- Health: green #1b6b34, amber #9a5b00, red #b42121
- Tier bars: Needed #b42121, Recommended #c47f04, Watch #9aa0a6
- Part stages: Ordered grey, Inbound #c47f04, Arrived #1aa0c4, Installed #1b6b34

## Good next tasks (build order from the product ledger)
1. Effortless ingestion: parse QuickBooks / scan paper invoices into the asset graph.
2. Wire the screen-pop to a real CTI layer (Twilio or RingCentral).
3. Self-building seasonal calendar from per-boat service cadence.
4. Deferred-work dollar dashboard with a real outreach send, not just a draft.
Then: telematics, AI voice agent, BoatFax-style verified service history.

## Conventions when extending
- Keep App.jsx as the single source of cross-view state. Lift state there, pass props.
- Add a new view: create `src/components/Thing.jsx`, import it in App.jsx, add a
  NAV entry, add a branch in the view router.
- Reuse ObjIcon, Pill, Card, ListHeader rather than re-styling from scratch.
