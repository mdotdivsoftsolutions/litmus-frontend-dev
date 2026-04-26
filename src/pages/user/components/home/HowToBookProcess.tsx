import { SectionHeader } from "./SectionHeader";
import { UserPlus, Search, CalendarCheck, Truck, FlaskConical, FileCheck, Stethoscope } from "lucide-react";

const processSteps = [
    {
        number: "01",
        title: "Create Account",
        subtitle: "Sign up or login to your Litmus account",
        icon: UserPlus,
    },
    {
        number: "02",
        title: "Browse & Select Tests",
        subtitle: "Choose from our extensive food safety test catalog",
        icon: Search,
    },
    {
        number: "03",
        title: "Schedule Pickup",
        subtitle: "Book your preferred collection time and location",
        icon: CalendarCheck,
    },
    {
        number: "04",
        title: "Sample Collection",
        subtitle: "Safe and secure sample collection at your doorstep",
        icon: Truck,
    },
    {
        number: "05",
        title: "Lab Analysis",
        subtitle: "Advanced testing in NABL accredited laboratories",
        icon: FlaskConical,
    },
    {
        number: "06",
        title: "Get Reports",
        subtitle: "Download FSSAI-verified reports to your profile",
        icon: FileCheck,
    },
    {
        number: "07",
        title: "Doctor Consultation",
        subtitle: "Get insights and recommendations from experts",
        icon: Stethoscope,
    },
] as const;

export function HowToBookProcess({ className }: { className?: string }) {
    return (
        <section className={`relative overflow-hidden py-16 md:py-24 ${className}`}>
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

                {/* Desktop: Horizontal Flow Chart with Icons */}
                <div className="hidden md:block">
                    {/* Connected flow with icons */}
                    <div className="relative">
                        {/* Curved Dashed Connection Line */}
                        <div className="absolute top-0 left-0 w-full h-20 pointer-events-none">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1400 100">
                                {/* Path for 7 items. Centers at 100, 300, 500, 700, 900, 1100, 1300 */}
                                <path 
                                    d="M 100 50 Q 200 0 300 50 T 500 50 T 700 50 T 900 50 T 1100 50 T 1300 50" 
                                    stroke="#67CBA0" 
                                    strokeWidth="3" 
                                    strokeDasharray="8 8" 
                                    fill="none" 
                                    opacity="0.6" 
                                />
                                {/* Dots along the curve */}
                                <circle cx="200" cy="25" r="5" fill="#008eb3" opacity="0.8" />
                                <circle cx="400" cy="75" r="5" fill="#008eb3" opacity="0.8" />
                                <circle cx="600" cy="25" r="5" fill="#008eb3" opacity="0.8" />
                                <circle cx="800" cy="75" r="5" fill="#008eb3" opacity="0.8" />
                                <circle cx="1000" cy="25" r="5" fill="#008eb3" opacity="0.8" />
                                <circle cx="1200" cy="75" r="5" fill="#008eb3" opacity="0.8" />
                            </svg>
                        </div>

                        {/* Steps grid */}
                        <div className="grid grid-cols-7 gap-3 lg:gap-5">
                            {processSteps.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.number} className="flex flex-col items-center text-center group">
                                        {/* Icon circle */}
                                        <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-[#008eb3]/30 shadow-[0_4px_20px_-4px_rgba(0,78,100,0.15)] transition-all duration-300 group-hover:border-[#008eb3] group-hover:shadow-[0_8px_30px_-4px_rgba(0,78,100,0.25)] group-hover:scale-105">
                                            <Icon className="h-8 w-8 text-[#004e64] group-hover:text-[#008eb3] transition-colors" />
                                        </div>

                                        {/* Step number badge */}
                                        <span className="text-[10px] font-black text-[#008eb3] tracking-wider mb-2">
                                            STEP {step.number}
                                        </span>

                                        {/* Title */}
                                        <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1.5">
                                            {step.title}
                                        </h4>

                                        {/* Subtitle */}
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {step.subtitle}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Mobile: Vertical Flow */}
                <div className="md:hidden space-y-6">
                    {processSteps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={step.number} className="flex gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 border-[#008eb3]/30 shadow-sm">
                                    <Icon className="h-6 w-6 text-[#004e64]" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <span className="text-[9px] font-black text-[#008eb3] tracking-wider">STEP {step.number}</span>
                                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{step.title}</h4>
                                    <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>
                                </div>
                            </div>
                        );
                    })}
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
