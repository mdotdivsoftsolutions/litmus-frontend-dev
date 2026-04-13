import { SectionHeader } from "./SectionHeader";

const processSteps = [
    {
        number: "01",
        title: "Create Account",
        subtitle: "Sign up or login to your Litmus account",
    },
    {
        number: "02",
        title: "Browse & Select Tests",
        subtitle: "Choose from our extensive food safety test catalog",
    },
    {
        number: "03",
        title: "Schedule Pickup",
        subtitle: "Book your preferred collection time and location",
    },
    {
        number: "04",
        title: "Sample Collection",
        subtitle: "Safe and secure sample collection at your home",
    },
    {
        number: "05",
        title: "Lab Analysis",
        subtitle: "Advanced testing in NABL accredited laboratories",
    },
    {
        number: "06",
        title: "Get Reports",
        subtitle: "Download FSSAI-verified reports to your profile",
    },
    {
        number: "07",
        title: "Doctor Consultation",
        subtitle: "Get insights and recommendations from experts",
    },
] as const;

export function HowToBookProcess() {
    return (
        <section className="relative overflow-hidden bg-slate-50 py-16 md:py-24">

            <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
                <SectionHeader
                    badge="Network of Trust"
                    title={
                        <>
                            How We <span className="text-gradient-brand">Work</span>
                        </>
                    }
                    subtitle="Your complete journey from registration to receiving certified food safety test reports"
                    className="mb-16 md:mb-20 justify-start"
                />

                {/* Main Flow Container */}
                <div className="relative">
                    {/* Desktop: Horizontal Flow */}
                    <div className="hidden md:flex items-start justify-between gap-8 lg:gap-12">
                        {/* Steps */}
                        <div className="flex flex-1 items-start gap-4 lg:gap-8">
                            {processSteps.slice(0, 4).map((step, idx) => (
                                <div key={step.number} className="flex flex-col flex-1">
                                    {/* Number and Arrow Container */}
                                    <div className="flex items-start gap-4 lg:gap-6">
                                        {/* Number */}
                                        <div className="flex-shrink-0">
                                            <p className="text-6xl lg:text-7xl font-black bg-gradient-to-l from-[#008eb3] to-[#004e64] bg-clip-text text-transparent">{step.number}</p>
                                        </div>

                                        {/* Arrow */}
                                        {idx < 3 && (
                                            <div className="mt-4 flex-shrink-0">
                                                <svg width="40" height="28" viewBox="0 0 40 28" fill="none">

                                                    <defs>
                                                        <linearGradient
                                                            id={`arrowGradient-${idx}`}   // ✅ unique ID
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="28"
                                                            gradientUnits="userSpaceOnUse"
                                                        >
                                                            <stop offset="0%" stopColor="#008eb3" />
                                                            <stop offset="100%" stopColor="#004e64" />
                                                        </linearGradient>
                                                    </defs>

                                                    <line
                                                        x1="0"
                                                        y1="14"
                                                        x2="32"
                                                        y2="14"
                                                        stroke={`url(#arrowGradient-${idx})`}
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                    />

                                                    <polyline
                                                        points="32,10 38,14 32,18"
                                                        stroke={`url(#arrowGradient-${idx})`}
                                                        strokeWidth="2"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />

                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Details */}
                                    <div className="mt-4 lg:mt-6">
                                        <h4 className="text-sm lg:text-base font-bold text-slate-900 leading-tight">{step.title}</h4>
                                        <p className="mt-2 text-xs lg:text-sm text-slate-600 leading-relaxed">{step.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* STAGES Badge - Right Side */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-8">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-1.5 w-1.5 rounded-full bg-gradient-to-l from-[#008eb3] to-[#004e64]" />
                            ))}
                            <span className="text-xs bg-gradient-to-l from-[#008eb3] to-[#004e64] bg-clip-text text-transparent font-semibold text-slate-400 uppercase tracking-widest transform -rotate-90 whitespace-nowrap mt-4">
                                Stages
                            </span>
                        </div>
                    </div>

                    {/* Mobile: Vertical Flow */}
                    <div className="md:hidden space-y-6">
                        {processSteps.map((step, idx) => (
                            <div key={step.number} className="flex gap-4">
                                {/* Number */}
                                <div className="flex-shrink-0">
                                    <p className="text-5xl font-black text-[#D32F2F]">{step.number}</p>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-2">
                                    <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                                    <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>
                                </div>

                                {/* Connector line */}
                                {idx < processSteps.length - 1 && (
                                    <div className="absolute left-8 h-8 w-0.5 bg-[#D32F2F]/30" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-16 flex items-center justify-center gap-6">
                    <div className="h-px w-12 bg-gradient-to-l from-[#008eb3] to-[#004e64]" />
                    <p className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-l from-[#008eb3] to-[#004e64] bg-clip-text text-transparent">
                        Complete • Secure • FSSAI Approved
                    </p>
                    <div className="h-px w-12 bg-gradient-to-l from-[#008eb3] to-[#004e64]" />
                </div>
            </div>
        </section>
    );
}
