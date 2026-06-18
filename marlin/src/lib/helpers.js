import { BOATS, OWNERS } from "../data/seed.js";

export const boat = (id) => BOATS.find((b) => b.id === id);
export const owner = (id) => { const b = boat(id); return b ? OWNERS[b.ownerId] : undefined; };
export const money = (n) => "$" + n.toLocaleString();

export const HEALTH = {
  Good: { bg: "#e6f4ea", fg: "#1b6b34", label: "Healthy" },
  Watch: { bg: "#fff4e0", fg: "#9a5b00", label: "Watch" },
  Attention: { bg: "#fde7e7", fg: "#b42121", label: "Needs attention" },
};

export const TIER = {
  Needed: { bar: "#b42121", chip: "#fde7e7", chipFg: "#b42121", label: "Needed now / safety" },
  Recommended: { bar: "#c47f04", chip: "#fff4e0", chipFg: "#9a5b00", label: "Recommended" },
  Watch: { bar: "#9aa0a6", chip: "#eef0f2", chipFg: "#5f6368", label: "Watch" },
};

// Color per part-pipeline stage, indexed to match PART_STATUS.
export const PART_STATE = [
  { label: "Ordered", fg: "#5f6368", bg: "#eef0f2", dot: "#9aa0a6" },
  { label: "Inbound", fg: "#9a5b00", bg: "#fff4e0", dot: "#c47f04" },
  { label: "Arrived", fg: "#0a6e8c", bg: "#e9f5f9", dot: "#1aa0c4" },
  { label: "Installed", fg: "#1b6b34", bg: "#e6f4ea", dot: "#1b6b34" },
];

// Auto-drafted customer update when a part reaches a new stage. Boat name in
// quotes, plain language, no ask, no pressure. The system says it, not a call.
export function partUpdate(boatName, partName, statusIdx, eta) {
  const part = partName.toLowerCase();
  switch (statusIdx) {
    case 0: return `We have ordered the ${part} for "${boatName}". We will let you know the moment it ships.`;
    case 1: return `The ${part} for "${boatName}" is on its way to us, ETA ${eta}. Nothing you need to do.`;
    case 2: return `Good news, the ${part} for "${boatName}" just arrived at the shop. We can get the work scheduled now.`;
    case 3: return `The ${part} is installed on "${boatName}" and tested. We will fold it into your service summary.`;
    default: return "";
  }
}

// Auto-drafted update when a delay shifts a job to a new window.
export function delayUpdate(boatName, newWindow) {
  return `Quick heads up on "${boatName}": a part we were waiting on slipped, so we moved your service to ${newWindow.toLowerCase()}. Nothing you need to do, we will keep you posted.`;
}

// On-brand recovery message. Boat name in quotes, one ask, a reason to act now, no pressure.
export function recoveryMessage(b, item) {
  // Greet by the first name. For joint owners ("Tom & Sue Albright") that is
  // the lead name, which reads naturally for the household.
  const first = owner(b.id).name.split(" ")[0];
  return `Hi ${first}, last time we had "${b.name}" in we flagged the ${item.toLowerCase()} and you wanted to circle back on it. She's due in soon anyway, so we can knock it out in the same visit and save you a trip. Want me to put her on the schedule? We've got an early-booking rate open this month.`;
}
