// ============================================================================
// Marlin demo seed data.
// The boat is the unit of record, keyed to its HIN. People link to boats.
// Swap this module for a real API / database layer when wiring the backend.
// ============================================================================

export const OWNERS = {
  o1: { name: "John Mercer", phone: "(703) 555-0142", since: "2019" },
  o2: { name: "Dana Okafor", phone: "(804) 555-0188", since: "2021" },
  o3: { name: "Rick Calloway", phone: "(540) 555-0119", since: "2017" },
  o4: { name: "Priya Nair", phone: "(571) 555-0173", since: "2020" },
  o5: { name: "Tom & Sue Albright", phone: "(757) 555-0166", since: "2015" },
  o6: { name: "Marcus Lee", phone: "(434) 555-0150", since: "2022" },
};

export const BOATS = [
  { id: "b1", name: "Reel Therapy", ownerId: "o1", hin: "YAM12345K819", year: 2019, engine: "Yamaha F250 4-stroke", hours: 98, storage: "In-water slip", water: "Salt", climate: "Hard freeze", membership: "Concierge Care", health: "Attention", nextService: "Due now", lastService: "Oct 12, 2025", hue: "#0b7285" },
  { id: "b2", name: "Second Wind", ownerId: "o2", hin: "MER88210L221", year: 2021, engine: "Mercury 300 V8 Verado", hours: 142, storage: "Dry stack", water: "Brackish", climate: "Light freeze", membership: "Concierge Care", health: "Watch", nextService: "Jul 2026", lastService: "May 2, 2026", hue: "#1971c2" },
  { id: "b3", name: "Knot Working", ownerId: "o3", hin: "MCR55019H517", year: 2017, engine: "MerCruiser 5.0 MPI", hours: 320, storage: "Trailered", water: "Fresh", climate: "Hard freeze", membership: "None", health: "Attention", nextService: "Overdue", lastService: "Aug 9, 2024", hue: "#e8590c" },
  { id: "b4", name: "Jenny", ownerId: "o4", hin: "YJW20FX0J920", year: 2020, engine: "Yamaha FX Cruiser (x2 skis)", hours: 60, storage: "Trailered", water: "Fresh", climate: "Light freeze", membership: "Concierge Care", health: "Good", nextService: "Sep 2026", lastService: "Apr 18, 2026", hue: "#2f9e44" },
  { id: "b5", name: "Wet Dream", ownerId: "o5", hin: "VLP44D40F015", year: 2015, engine: "Volvo Penta D4-300", hours: 510, storage: "In-water slip", water: "Salt", climate: "Light freeze", membership: "Concierge Care", health: "Watch", nextService: "Aug 2026", lastService: "Mar 21, 2026", hue: "#5f3dc4" },
  { id: "b6", name: "Gail Force", ownerId: "o6", hin: "SEA22RXT2K22", year: 2022, engine: "Sea-Doo RXT-X 300", hours: 22, storage: "Trailered", water: "Salt", climate: "Hard freeze", membership: "None", health: "Good", nextService: "Oct 2026", lastService: "Apr 30, 2026", hue: "#c2255c" },
];

export const CONTACTS = {
  b1: [
    { name: "John Mercer", role: "Owner", perm: "Approve spend" },
    { name: "Colleen Mercer", role: "Spouse", perm: "Schedule & view" },
    { name: "Ethan Mercer", role: "Adult child", perm: "Schedule only" },
  ],
  b2: [{ name: "Dana Okafor", role: "Owner", perm: "Approve spend" }],
  b3: [{ name: "Rick Calloway", role: "Owner", perm: "Approve spend" }],
  b4: [
    { name: "Priya Nair", role: "Owner", perm: "Approve spend" },
    { name: "Sam Nair", role: "Co-owner", perm: "Approve spend" },
  ],
  b5: [
    { name: "Tom Albright", role: "Owner", perm: "Approve spend" },
    { name: "Sue Albright", role: "Co-owner", perm: "Approve spend" },
    { name: "Capt. Reyes", role: "Hired captain", perm: "Schedule only" },
  ],
  b6: [{ name: "Marcus Lee", role: "Owner", perm: "Approve spend" }],
};

// Maintenance forecast. Every line ties to evidence. Tiers, never a guess.
export const FORECAST = {
  b1: [
    { tier: "Needed", item: "Impeller & water pump", why: "98 hrs since last service, salt water. Last photo showed early vane wear.", price: 180 },
    { tier: "Needed", item: "Replace expired flares", why: "Flares hit the 42-month expiry this month. Safety item.", price: 45 },
    { tier: "Recommended", item: "Lower unit reseal", why: "Gear oil came out milky on the last drain. Water intrusion likely.", price: 480 },
    { tier: "Recommended", item: "Anodes", why: "Anodes measured at 55% on last visit. Salt eats them faster.", price: 60 },
    { tier: "Watch", item: "Bottom paint", why: "Two seasons on current coat. Inspect at next haul-out, not yet due.", price: 0 },
  ],
  b2: [
    { tier: "Recommended", item: "Prop reconditioning", why: "Minor edge dings noted at spring commission. Not urgent.", price: 220 },
    { tier: "Watch", item: "Fuel-water separator", why: "Approaching interval by hours. Watch next visit.", price: 0 },
  ],
  b3: [
    { tier: "Needed", item: "Bellows replacement", why: "Cracking visible in last inspection photo. Risk of flooding the drive.", price: 620 },
    { tier: "Needed", item: "Trim sender", why: "Owner reported erratic trim gauge. Confirmed fault.", price: 180 },
    { tier: "Recommended", item: "Full annual service", why: "Last service Aug 2024. Well past interval at 320 hrs.", price: 540 },
  ],
  b4: [{ tier: "Watch", item: "Wear ring", why: "Normal for hours. No action needed yet.", price: 0 }],
  b5: [
    { tier: "Recommended", item: "Raw water pump", why: "Original at 510 hrs. Replace before failure on a hot day.", price: 390 },
    { tier: "Watch", item: "Coolant service", why: "Within window. Plan for fall.", price: 0 },
  ],
  b6: [{ tier: "Watch", item: "None due", why: "Low hours, recent service. You are good to go.", price: 0 }],
};

export const HISTORY = {
  b1: [
    { date: "Oct 12, 2025", note: "Winterized, fogged engine, stabilizer added, battery on tender.", tech: "Mike Alvarez" },
    { date: "Apr 3, 2025", note: "Spring commission. New battery, oil & filter, lower unit oil clean.", tech: "Mike Alvarez" },
    { date: "Oct 8, 2024", note: "Winterization.", tech: "Carlos Mendez" },
    { date: "Jun 20, 2024", note: "100-hour service. Impeller replaced, plugs, fuel filter.", tech: "Mike Alvarez" },
  ],
  b2: [{ date: "May 2, 2026", note: "Spring commission, prop dings noted.", tech: "Carlos Mendez" }],
  b3: [{ date: "Aug 9, 2024", note: "Oil change only. Owner declined annual.", tech: "Mike Alvarez" }],
  b4: [{ date: "Apr 18, 2026", note: "Both skis serviced, wear rings inspected.", tech: "Carlos Mendez" }],
  b5: [{ date: "Mar 21, 2026", note: "Annual service, anodes replaced.", tech: "Mike Alvarez" }],
  b6: [{ date: "Apr 30, 2026", note: "New-owner intake, baseline inspection.", tech: "Carlos Mendez" }],
};

export const DEFERRED = [
  { id: "d1", boatId: "b1", item: "Lower unit reseal", quoted: "Apr 3, 2026", amount: 480 },
  { id: "d2", boatId: "b1", item: "Gelcoat scratch, port side", quoted: "Apr 3, 2026", amount: 150 },
  { id: "d3", boatId: "b3", item: "Bellows replacement", quoted: "Aug 9, 2024", amount: 620 },
  { id: "d4", boatId: "b3", item: "Trim sender", quoted: "Aug 9, 2024", amount: 180 },
  { id: "d5", boatId: "b5", item: "Raw water pump", quoted: "Mar 21, 2026", amount: 390 },
  { id: "d6", boatId: "b2", item: "Prop reconditioning", quoted: "May 2, 2026", amount: 220 },
];

export const STAGES = ["Checked in", "Diagnosed", "Quote sent", "Approved", "Parts staged", "In progress", "Quality check", "Ready"];

export const INITIAL_WORK = [
  { id: "w1", boatId: "b1", stage: 5, tech: "Mike Alvarez", opened: "Jun 16", scheduled: "Week of Jun 23" },
  { id: "w2", boatId: "b5", stage: 2, tech: "Carlos Mendez", opened: "Jun 17", scheduled: "Week of Jul 7" },
  { id: "w3", boatId: "b2", stage: 0, tech: "Mike Alvarez", opened: "Jun 18", scheduled: "Week of Jul 14" },
];

export const MEMBERSHIPS = BOATS.filter((b) => b.membership !== "None").map((b) => ({ boatId: b.id, plan: b.membership }));

// Parts pipeline. Each part belongs to a work order (workId) and a boat.
// status is an index into PART_STATUS. Advancing a part is what triggers the
// automatic customer update, so the owner hears it from the system, not a call.
export const PART_STATUS = ["Ordered", "Inbound", "Arrived", "Installed"];

// Bookable service windows in order. A delay moves a job to the next window.
export const SERVICE_WINDOWS = [
  "Week of Jun 23", "Week of Jun 30", "Week of Jul 7", "Week of Jul 14",
  "Week of Jul 21", "Week of Aug 4", "Week of Aug 18",
];

export const INITIAL_PARTS = [
  { id: "p1", workId: "w1", boatId: "b1", name: "Water pump impeller kit", supplier: "Yamaha OEM", status: 1, eta: "Jun 20", notified: true },
  { id: "p2", workId: "w1", boatId: "b1", name: "Lower unit seal kit", supplier: "Sierra", status: 2, eta: "Arrived Jun 18", notified: true },
  { id: "p3", workId: "w2", boatId: "b5", name: "Raw water pump", supplier: "Volvo Penta", status: 0, eta: "Jun 24", notified: false },
  { id: "p4", workId: "w3", boatId: "b2", name: "Reconditioned prop", supplier: "Coastal Prop", status: 1, eta: "Jun 23", notified: true },
];

// Customer updates that have already gone out. New ones get prepended as parts
// advance or jobs slip. The whole point: the customer is kept current without
// the shop having to stop and call.
export const UPDATES_SEED = [
  { id: "u1", boatId: "b1", text: 'The lower unit seal kit for "Reel Therapy" just arrived at the shop. We can slot the work in now.', when: "1h", channel: "SMS" },
  { id: "u2", boatId: "b5", text: 'We have ordered the raw water pump for "Wet Dream". We will let you know the moment it ships.', when: "3h", channel: "SMS" },
];

// Home dashboard activity feed. Most recent first.
export const RECENT_ACTIVITY = [
  { id: "a1", text: 'Mike Alvarez advanced "Reel Therapy" to In progress', when: "2m" },
  { id: "a2", text: 'Quote sent on "Wet Dream" raw water pump', when: "1h" },
  { id: "a3", text: '"Second Wind" checked in for prop work', when: "3h" },
  { id: "a4", text: "Winterization reminder queued for 41 salt boats", when: "5h" },
  { id: "a5", text: '"Gail Force" new-owner intake completed', when: "1d" },
];

// Schedule view: shop load percentage by month, plus the suggested actions to
// level the curve. The seam to replace with real capacity data.
export const SHOP_LOAD = [
  { month: "Jan", load: 18 }, { month: "Feb", load: 22 }, { month: "Mar", load: 48 },
  { month: "Apr", load: 92 }, { month: "May", load: 100 }, { month: "Jun", load: 96 },
  { month: "Jul", load: 88 }, { month: "Aug", load: 80 }, { month: "Sep", load: 70 },
  { month: "Oct", load: 85 }, { month: "Nov", load: 40 }, { month: "Dec", load: 20 },
];

export const SCHEDULE_ACTIONS = [
  { id: "s1", title: "Pre-book spring commissioning now", detail: "Offer Jan-Feb booking at early-bird rate to 41 in-water boats. Pulls April demand forward." },
  { id: "s2", title: "Sell winter project slots", detail: "Nov-Dec capacity is wide open. Target lower-unit and repower jobs at incentive pricing." },
  { id: "s3", title: "Stagger fall haul-outs", detail: "Spread October haul-outs across 3 weeks instead of one panic week." },
];
