/* Pure pricing maths. All numbers come from site.pricing (DZD), nothing is hard-coded here. */
const round = (n, step) => Math.round(n / step) * step;
const sum = (list, key) => list.reduce((t, x) => t + x[key], 0);

export const fmt = (n) => new Intl.NumberFormat("en-US").format(n);

/** The add-ons that make sense for a project type. */
export const addonsFor = (cfg, typeId) => cfg.addons.filter((a) => !a.only || a.only.includes(typeId));

/** Add-on ids a plan resolves to for a type. A plan with `addons: null` is the visitor's own pick. */
export function planPicks(cfg, typeId, planId, custom) {
  const plan = cfg.plans.find((p) => p.id === planId) ?? cfg.plans[0];
  const valid = addonsFor(cfg, typeId);
  return (plan.addons ?? custom).filter((id) => valid.some((a) => a.id === id));
}

export function computeEstimate(cfg, typeId, pickedIds, student) {
  const type = cfg.types.find((t) => t.id === typeId) ?? cfg.types[0];
  const addons = addonsFor(cfg, type.id).filter((a) => pickedIds.includes(a.id));
  const subtotal = type.base + sum(addons, "price");
  const discount = student ? round(subtotal * cfg.studentRate, 1000) : 0;
  const total = subtotal - discount;
  const weeks = type.weeks + sum(addons, "weeks");
  const [lo, hi] = cfg.rangeSpread;
  return {
    type, addons, subtotal, discount, total, student,
    low: round(total * lo, 5000), high: round(total * hi, 5000),
    weeksMin: Math.round(weeks), weeksMax: Math.ceil(weeks * 1.25),
  };
}

/** Price of a preset plan for a type, before any student discount (shown on the plan buttons). */
export const planSubtotal = (cfg, typeId, plan) =>
  computeEstimate(cfg, typeId, planPicks(cfg, typeId, plan.id, []), false).subtotal;

/** Matching budget bucket label from site.pricing.budgetTiers ([[maxDZD, label], …]). */
export const budgetFor = (cfg, total) => (cfg.budgetTiers.find(([max]) => total < max) ?? cfg.budgetTiers.at(-1))[1];

/** Plain-text summary that travels with the contact form. */
export function summarize(est, planName) {
  const lines = [
    `Estimate from the pricing calculator: ${est.type.name} (${planName})`,
    ...est.addons.map((a) => `+ ${a.name}`),
    `Estimated price: ${fmt(est.total)} DZD (typical range ${fmt(est.low)} – ${fmt(est.high)} DZD)`,
    `Timeline: about ${est.weeksMin}–${est.weeksMax} weeks`,
  ];
  if (est.student) lines.push(`Student discount applied: -${fmt(est.discount)} DZD (student card to be shown)`);
  return lines.join("\n");
}
