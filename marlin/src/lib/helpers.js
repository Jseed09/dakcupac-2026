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

// On-brand recovery message. Boat name in quotes, one ask, a reason to act now, no pressure.
export function recoveryMessage(b, item) {
  // Greet by the first name. For joint owners ("Tom & Sue Albright") that is
  // the lead name, which reads naturally for the household.
  const first = owner(b.id).name.split(" ")[0];
  return `Hi ${first}, last time we had "${b.name}" in we flagged the ${item.toLowerCase()} and you wanted to circle back on it. She's due in soon anyway, so we can knock it out in the same visit and save you a trip. Want me to put her on the schedule? We've got an early-booking rate open this month.`;
}
