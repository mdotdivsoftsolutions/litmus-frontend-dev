export type BlogCategory = "Regulatory & Compliance" | "Product & Platform" | "Science & Methods";

export type BlogContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "figure"; src: string; alt: string; caption?: string };

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  author: string;
  date: string;
  readMinutes: number;
  coverImage: string;
  blocks: BlogContentBlock[];
}

export const BLOG_CATEGORY_ORDER: BlogCategory[] = [
  "Regulatory & Compliance",
  "Product & Platform",
  "Science & Methods",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "fssai-sampling-checklist-2026",
    title: "Practical FSSAI sampling checklist for Q2 audits",
    category: "Regulatory & Compliance",
    excerpt:
      "What QA leads should verify before inspectors arrive — batch traceability, chain-of-custody notes, and lab scope alignment.",
    author: "Priya Natarajan",
    date: "May 4, 2026",
    readMinutes: 9,
    coverImage:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=1200",
    blocks: [
      {
        type: "p",
        text: "Regulatory audits rarely fail on headline metrics alone; they fail when paperwork cannot explain how a sample moved from line to lab. This playbook distils what we see working across dairy, beverages, and RTE categories with Litmus partner labs.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400",
        alt: "Documents and laptop on a desk",
        caption: "Treat your sampling dossier like a storyboard — each scene needs a timestamp and owner.",
      },
      {
        type: "h2",
        text: "Batch IDs must reconcile before inspectors knock",
      },
      {
        type: "p",
        text: "First, reconcile batch IDs between production logs and dispatch manifests. Mismatches here are the fastest path to non-conformities, especially when subcontract labs handle overflow capacity. Export a single worksheet joining ERP batches to courier airway bills — ambiguity kills credibility.",
      },
      {
        type: "h3",
        text: "Laboratory scope vs. your COA request",
      },
      {
        type: "p",
        text: "Confirm that the nominated laboratory’s NABL scope lists the exact matrix and method cited on your certificate of analysis request. If scope differs even subtly, plan for referral routing before the audit window — never assume ‘they’ve done it before.’",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1579154204601-08ee9f5f0ca9?auto=format&fit=crop&q=80&w=1400",
        alt: "Laboratory interior",
        caption: "Scope alignment beats expedited TAT when audits dissect referral chains.",
      },
      {
        type: "h2",
        text: "Rehearse deviations — calmly",
      },
      {
        type: "p",
        text: "Rehearse your escalation tree: who signs deviation notes, who speaks to the auditor, and how quickly digital copies of reports can be retrieved. Teams that drill these paths sleep better on audit eve.",
      },
      {
        type: "h3",
        text: "Cold-chain artefacts auditors actually open",
      },
      {
        type: "p",
        text: "Stress-test cold-chain evidence for fragile assays. Export temperature traces alongside timestamps that align with rider check-ins — auditors increasingly ask for both. If your IoT vendor truncates exports, fix it before Q3.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=1400",
        alt: "Temperature-controlled logistics",
        caption: "Pair telemetry screenshots with chain-of-custody signatures — not screenshots alone.",
      },
    ],
  },
  {
    slug: "label-claims-micro-panel",
    title: "Designing a microbiological panel that backs shelf-life claims",
    category: "Science & Methods",
    excerpt:
      "How to pair aerobic counts, yeast & mould, and pathogens without overspending on redundant assays.",
    author: "Dr. Rahul Menon",
    date: "Apr 29, 2026",
    readMinutes: 11,
    coverImage:
      "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=1200",
    blocks: [
      {
        type: "p",
        text: "Shelf-life validation for chilled RTE formats hinges on knowing which organisms actually limit your product — not running every plate microbiology offers. Panels should ladder from hazard signals to confirmatory work.",
      },
      {
        type: "h2",
        text: "Start with formulation physics",
      },
      {
        type: "p",
        text: "Begin with risk maps tied to pH, water activity, and MAP gas mix — those factors steer whether yeast and mould deserve priority versus LAB dominance. Sketch spoilage pathways before touching incubators.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1400",
        alt: "Scientist examining samples",
        caption: "Match accelerated-aging pulls to sensory checkpoints — spikes often precede plate divergence.",
      },
      {
        type: "h3",
        text: "When to widen selective media",
      },
      {
        type: "p",
        text: "Layer selective media thoughtfully after baseline TVC trends emerge from accelerated aging studies. Early spikes often indicate process drift rather than formulation gaps — reruns beat premature reformulation.",
      },
      {
        type: "h2",
        text: "Partner labs and pragmatic turnaround",
      },
      {
        type: "p",
        text: "Partner labs should confirm incubation programmes align with ISO methods while remaining pragmatic about turnaround. Blocking shipping decisions waiting on optional confirmations hurts velocity — sequence reporting tiers explicitly with QA.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400",
        alt: "Microbiology plates",
        caption: "Document colony morphology photos alongside CFU counts for dossier reviewers.",
      },
    ],
  },
  {
    slug: "booking-apis-for-enterprise-procurement",
    title: "What procurement teams should ask about booking APIs",
    category: "Product & Platform",
    excerpt:
      "Authentication patterns, rate limits, and invoice artefacts — non-functional requirements that decide pilot success.",
    author: "Ananya Ghosh",
    date: "Apr 21, 2026",
    readMinutes: 8,
    coverImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
    blocks: [
      {
        type: "p",
        text: "Enterprise diagnostics procurement rarely stalls on price lists; it stalls when SSO, segregation of duties, and ERP ingestion were afterthoughts. Treat APIs like mini procurements — write acceptance criteria your CIO would defend.",
      },
      {
        type: "h2",
        text: "Sandboxes that mirror production semantics",
      },
      {
        type: "p",
        text: "Ask early how sandbox tenants mimic production webhooks for order states — finance controllers want deterministic triggers before accruals hit. Replay tapes should include partial cancellations and lab reroutes.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1400",
        alt: "Analytics dashboard on screen",
        caption: "Wire dashboards early — procurement trusts spreadsheets until telemetry proves SLAs.",
      },
      {
        type: "h3",
        text: "Identity schemes across catalogues",
      },
      {
        type: "p",
        text: "Map ID schemes across SKU catalogues, lab identifiers, and finance cost centres. Translation layers saved once prevent reconciliation storms later — resist letting each vendor mint opaque surrogate keys silently.",
      },
      {
        type: "h2",
        text: "Observability beats escalation chains",
      },
      {
        type: "p",
        text: "Demand observability: dashboards highlighting SLA breaches per hub beat inbox escalation chains when volumes spike near fiscal closes. Attach paging policies tied to customer tier — silent degradation erodes renewals.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1553877522-432569d4cdae?auto=format&fit=crop&q=80&w=1400",
        alt: "Team collaborating",
        caption: "Pilot retros should include engineering + finance — not procurement alone.",
      },
    ],
  },
  {
    slug: "heavy-metals-trends-plain-language",
    title: "Reading heavy metals trends without drowning in charts",
    category: "Science & Methods",
    excerpt:
      "Turnaround variability, LOD chatter, and how to brief executives when numbers flirt with specification edges.",
    author: "Keerthi Balaji",
    date: "Apr 12, 2026",
    readMinutes: 9,
    coverImage:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1200",
    blocks: [
      {
        type: "p",
        text: "Executives want directional assurance — not every elemental trace — when approving alternate sourcing. Your job is to narrate risk without burying them in LOD footnotes.",
      },
      {
        type: "h2",
        text: "Anchor the story on limits",
      },
      {
        type: "p",
        text: "Anchor narratives on method LOD versus specification bands; ambiguity here breeds mistrust between QA and supply chain. Lead slides with pass/fail bands, then zoom into trends.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1400",
        alt: "Charts on monitor",
        caption: "Three-month rolling bands beat single snapshots when agronomic inputs swing.",
      },
      {
        type: "h3",
        text: "Regional seasonality matters",
      },
      {
        type: "p",
        text: "Highlight rolling quartiles across regions when agronomic inputs shift seasonally — single snapshots mislead. Overlay rainfall indexes sparingly; cite correlation caveats.",
      },
      {
        type: "h2",
        text: "Close with a retesting rhythm",
      },
      {
        type: "p",
        text: "Close with recommended retesting cadence tied to volume tiers rather than calendar guesses — procurement teams translate tiers into PO schedules instantly.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=1400",
        alt: "Laboratory glassware",
        caption: "Pair narrative decks with appendices listing methods — auditors ask quietly.",
      },
    ],
  },
  {
    slug: "notifications-that-respect-clinical-tone",
    title: "Notifications that respect clinical tone (and compliance)",
    category: "Product & Platform",
    excerpt:
      "Balancing urgency with non-diagnostic language in SMS, email, and push surfaces.",
    author: "Marcus D’Souza",
    date: "Mar 30, 2026",
    readMinutes: 7,
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    blocks: [
      {
        type: "p",
        text: "Consumers confuse logistics delays with clinical outcomes when wording blurs the two. Messaging stacks should borrow airline-grade clarity — status versus implication.",
      },
      {
        type: "h2",
        text: "Separate logistics from clinical readiness",
      },
      {
        type: "p",
        text: "Separate operational notices (‘phlebotomist delayed’) from clinical readiness (‘report uploaded’) across templates. Never imply interpretation via push character limits.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1400",
        alt: "Smartphone notifications",
        caption: "Preview SMS length with carrier truncation — regulatory disclaimers vanish first.",
      },
      {
        type: "h3",
        text: "Tone without diagnosis",
      },
      {
        type: "p",
        text: "Localise respectful greetings without implying diagnostic conclusions pending physician review. QA/legal paired review beats marketing solo drafts.",
      },
      {
        type: "h2",
        text: "Preference centres earn trust",
      },
      {
        type: "p",
        text: "Instrument preference centres early — suppression mistakes erode trust faster than over-notification. Default transactional channels separately from education drip campaigns.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1400",
        alt: "Customer experience meeting",
        caption: "Quarterly copy audits catch drift after rebrands — automate diff alerts.",
      },
    ],
  },
  {
    slug: "exports-documentation-packaging-basics",
    title: "Exports documentation: packaging labs expect before uplift",
    category: "Regulatory & Compliance",
    excerpt:
      "Commercial invoices, MSDS crosswalks, and retention expectations when regulators span jurisdictions.",
    author: "Sonia Verghese",
    date: "Mar 18, 2026",
    readMinutes: 12,
    coverImage:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=1200",
    blocks: [
      {
        type: "p",
        text: "Cross-border food shipments stall when paperwork vocabulary differs between exporting competent authorities and importing regulators. Harmonisation upfront beats heroic courier calls.",
      },
      {
        type: "h2",
        text: "Harmonise identifiers everywhere",
      },
      {
        type: "p",
        text: "Harmonise batch nomenclature across invoices, COAs, and airway bills — subtle SKU aliases confuse customs brokers and trigger rework at chilled uplift gates.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1400",
        alt: "Warehouse containers",
        caption: "Photograph pallet placards matching invoice lines — mobile QA patrols catch mismatches.",
      },
      {
        type: "h3",
        text: "Retention spans jurisdictions",
      },
      {
        type: "p",
        text: "Retention schedules should cite both origin and destination minimums; digital archives simplify audits years later. Encrypt attestations where regulators mandate issuer signatures.",
      },
      {
        type: "h2",
        text: "Uplift timing vs. custody blanks",
      },
      {
        type: "p",
        text: "Coordinate uplift slots only after chain-of-custody blanks are pre-signed electronically where permitted — scrambling signatures ringside invites tampering questions downstream.",
      },
      {
        type: "figure",
        src: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=1400",
        alt: "Shipping documents",
        caption: "MSDS crosswalks belong beside HS codes — keep translations reviewer-signed.",
      },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/** Related reads: same category first, then others; excludes current slug. */
export function getRelatedPosts(slug: string, limit = 4): BlogPost[] {
  const current = getBlogBySlug(slug);
  if (!current) return [];
  const rest = blogPosts.filter((p) => p.slug !== slug);
  const sameCat = rest.filter((p) => p.category === current.category);
  const other = rest.filter((p) => p.category !== current.category);
  return [...sameCat, ...other].slice(0, limit);
}

export function blogsGrouped(): Record<BlogCategory, BlogPost[]> {
  const map = {} as Record<BlogCategory, BlogPost[]>;
  for (const cat of BLOG_CATEGORY_ORDER) {
    map[cat] = [];
  }
  for (const post of blogPosts) {
    map[post.category].push(post);
  }
  return map;
}
