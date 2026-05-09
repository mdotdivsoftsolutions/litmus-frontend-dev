export type CareerCategory =
  | "Engineering"
  | "Laboratory & Quality"
  | "Operations & Logistics"
  | "Sales & Growth";

export interface CareerOpening {
  slug: string;
  title: string;
  category: CareerCategory;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  posted: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
}

export const CAREER_CATEGORY_ORDER: CareerCategory[] = [
  "Engineering",
  "Laboratory & Quality",
  "Operations & Logistics",
  "Sales & Growth",
];

export const careerOpenings: CareerOpening[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "Senior Full-stack Engineer",
    category: "Engineering",
    location: "Chennai · Hybrid",
    type: "Full-time",
    posted: "Apr 28, 2026",
    summary:
      "Own consumer booking flows, lab integrations, and observability for Litmus production traffic.",
    responsibilities: [
      "Design and ship resilient APIs consumed by partner laboratories and logistics vendors.",
      "Collaborate with product designers on accessibility-forward UX across checkout and reports.",
      "Improve CI/CD, feature flags, and incident tooling alongside platform teammates.",
    ],
    requirements: [
      "5+ years shipping TypeScript or Kotlin services plus React web apps.",
      "Comfort modelling workflows involving payments, scheduling, and document uploads.",
      "Hands-on experience with PostgreSQL or equivalent relational databases.",
    ],
    niceToHave: ["Healthcare or diagnostics integrations", "OpenTelemetry / Datadog"],
  },
  {
    slug: "mobile-engineer-flutter",
    title: "Mobile Engineer (Flutter)",
    category: "Engineering",
    location: "Bangalore · Remote-first",
    type: "Full-time",
    posted: "Apr 22, 2026",
    summary:
      "Bring specimen tracking and push notifications to our Flutter companion experiences.",
    responsibilities: [
      "Implement resilient offline caches for appointments and PDF reports.",
      "Partner with QA on device matrices spanning Android and iOS pilots.",
      "Instrument crashes and latency budgets tied to critical journeys.",
    ],
    requirements: [
      "3+ years Flutter/Dart experience shipping consumer-facing releases.",
      "Understanding of REST integrations secured via OAuth or token pinning.",
      "Automated UI testing familiarity using integration harnesses.",
    ],
    niceToHave: ["Kotlin Swift bridging experience"],
  },
  {
    slug: "quality-assurance-scientist",
    title: "Quality Assurance Scientist",
    category: "Laboratory & Quality",
    location: "Mumbai · On-site",
    type: "Full-time",
    posted: "May 2, 2026",
    summary:
      "Guide proficiency testing programmes across microbiology and chemistry panels.",
    responsibilities: [
      "Maintain deviation workflows interfacing with NABL audit artefacts.",
      "Coach technicians on ISO 17025 documentation hygiene.",
      "Partner with tech teams translating assay matrices into catalogue accuracy.",
    ],
    requirements: [
      "Masters in Food Tech / Microbiology / Chemistry with 4+ years lab QA.",
      "Hands-on exposure to PT schemes and CAPA closure cycles.",
      "Confidence authoring scope maps consumed by auditors.",
    ],
    niceToHave: ["Lead auditor certification"],
  },
  {
    slug: "lab-integration-specialist",
    title: "Lab Integration Specialist",
    category: "Laboratory & Quality",
    location: "Chennai · Hybrid",
    type: "Full-time",
    posted: "Apr 18, 2026",
    summary:
      "Be the bridge between partner laboratories and Litmus digital onboarding tooling.",
    responsibilities: [
      "Configure HL7/FHIR feeds plus bespoke CSV pipelines until unified adapters ship.",
      "Train lab coordinators on dashboard KPIs for SLA adherence.",
      "Diagnose escalations involving barcode mismatches or delayed manifests.",
    ],
    requirements: [
      "3+ years coordinating diagnostic logistics between clinicians and labs.",
      "Exposure to LIMS tooling plus ERP invoicing nuances.",
      "Comfort facilitating workshops in English with Tamil or Hindi stakeholders.",
    ],
  },
  {
    slug: "cold-chain-operations-lead",
    title: "Cold-chain Operations Lead",
    category: "Operations & Logistics",
    location: "Hyderabad · On-site",
    type: "Full-time",
    posted: "May 6, 2026",
    summary:
      "Design repeatable playbook for temperature-monitored specimen corridor nationally.",
    responsibilities: [
      "Negotiate vendor SLAs with tertiary referral hubs.",
      "Run nightly tower reviewing KPI dashboards vs escalation thresholds.",
      "Collaborate with product on predictive ETA modelling feeds.",
    ],
    requirements: [
      "7+ years in healthcare logistics / pharma cold-chain oversight.",
      "Demonstrated crisis leadership spanning pilots beyond Tier-I metros.",
      "Comfort analysing telemetry datasets exported into spreadsheets.",
    ],
  },
  {
    slug: "customer-support-shift-lead",
    title: "Customer Support Shift Lead",
    category: "Operations & Logistics",
    location: "New Delhi · Hybrid",
    type: "Full-time",
    posted: "Apr 30, 2026",
    summary:
      "Lead multilingual pods resolving escalations around bookings and reporting UX.",
    responsibilities: [
      "Coach associates using QA rubrics mirrored across outsourced pods.",
      "Partner with CRM admins refining macros grounded in regulatory disclaimers.",
      "Produce weekly narratives tying VOC insights into backlog grooming.",
    ],
    requirements: [
      "4+ years scaling omnichannel healthcare contact centres.",
      "Fluent Hindi plus English business writing.",
      "Experience with Zendesk or Freshdesk automation primitives.",
    ],
  },
  {
    slug: "enterprise-sales-director",
    title: "Enterprise Sales Director — FMCG",
    category: "Sales & Growth",
    location: "Pan-India · Travel-heavy",
    type: "Full-time",
    posted: "May 8, 2026",
    summary:
      "Expand marquee FMCG partnerships for contractual assurance programmes.",
    responsibilities: [
      "Own six-seven digit quarterly forecasting rhythms anchored by CFO stakeholders.",
      "Partner with science SMEs tailoring diligence dossiers ahead of audits.",
      "Represent Litmus at select conferences emphasizing credibility narratives.",
    ],
    requirements: [
      "10+ years enterprise SaaS / diagnostics hunting motions.",
      "Comfort structuring outcome-linked commercials referencing SLA regimes.",
      "Demonstrated wins navigating centralized procurement desks.",
    ],
  },
  {
    slug: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    category: "Sales & Growth",
    location: "Remote · IST overlap",
    type: "Full-time",
    posted: "Apr 14, 2026",
    summary:
      "Blend experimentation discipline with regulatory sensitivities across lifecycle journeys.",
    responsibilities: [
      "Operationalise cohort studies bridging Braze journeys plus CMS authoring workflows.",
      "Partner with compliance reviewers approving outbound creatives referencing assays.",
      "Instrument dashboards marrying blended attribution curves.",
    ],
    requirements: [
      "5+ years lifecycle marketing within regulated domains.",
      "Hands-on SQL or Warehouse-derived dashboards familiarity.",
      "Portfolio illustrating nuanced experimentation narratives.",
    ],
    niceToHave: ["Experience collaborating alongside clinicians"],
  },
];

export function getCareerBySlug(slug: string): CareerOpening | undefined {
  return careerOpenings.find((o) => o.slug === slug);
}

export function careersGrouped(): Record<CareerCategory, CareerOpening[]> {
  const map = {} as Record<CareerCategory, CareerOpening[]>;
  for (const cat of CAREER_CATEGORY_ORDER) {
    map[cat] = [];
  }
  for (const opening of careerOpenings) {
    map[opening.category].push(opening);
  }
  return map;
}
