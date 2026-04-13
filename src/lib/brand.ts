/**
 * Consumer marketing palette — source of truth is :root in src/index.css.
 * Use Tailwind: text-brand-primary, from-brand-card-from, utilities .text-gradient-brand, .bg-gradient-card, etc.
 */
export const brandCssVars = {
  textFrom: "--brand-text-from",
  textTo: "--brand-text-to",
  primary: "--brand-primary",
  cardFrom: "--brand-card-from",
  cardTo: "--brand-card-to",
  cardDeep: "--brand-card-deep",
} as const;
