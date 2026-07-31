import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConsultationBookingModal } from "../consultation/ConsultationBookingModal";
import { WHATSAPP_URL, WHATSAPP_NUMBER } from "@/lib/constants";

// WhatsApp SVG logo (official green icon)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      d="M22.94 9.06A9.37 9.37 0 0 0 16 6.25a9.41 9.41 0 0 0-8.15 14.1L6.25 25.75l5.5-1.44A9.41 9.41 0 0 0 25.75 16a9.37 9.37 0 0 0-2.81-6.94zm-6.94 14.44a7.81 7.81 0 0 1-3.98-1.1l-.28-.17-2.92.76.78-2.85-.18-.29a7.82 7.82 0 1 1 6.58 3.65zm4.29-5.86c-.23-.12-1.37-.68-1.58-.75s-.37-.12-.52.12-.6.75-.73.91-.27.17-.5.06a6.3 6.3 0 0 1-1.85-1.14 6.93 6.93 0 0 1-1.28-1.59c-.13-.23 0-.35.1-.47s.23-.27.35-.41a1.6 1.6 0 0 0 .23-.38.42.42 0 0 0-.02-.41c-.06-.12-.52-1.25-.71-1.71s-.38-.39-.52-.4h-.44a.85.85 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.94 4.52 4.52 0 0 0 .95 2.4 10.35 10.35 0 0 0 3.96 3.5c.55.24 .98.38 1.32.49a3.18 3.18 0 0 0 1.46.09 2.39 2.39 0 0 0 1.57-1.1 1.94 1.94 0 0 0 .14-1.1c-.06-.1-.21-.16-.44-.28z"
      fill="white"
    />
  </svg>
);

// Phone icon
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
      fill="#1B8EF2"
    />
    <path
      d="M17 8V4M17 4L15 6M17 4L19 6"
      stroke="#1B8EF2"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Quick Order icon
const QuickOrderIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="14" height="18" rx="2" fill="#F06292" />
    <path d="M9 3h6v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V3z" fill="#E91E63" />
    <path d="M8 10h8M8 13h8M8 16h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const actions = [
  {
    id: "phone",
    label: "Book via",
    highlight: "Phone Call",
    icon: PhoneIcon,
    cardBg: "bg-slate-50",
    border: "border-slate-200",
    hoverShadow: "hover:shadow-md hover:bg-white hover:border-slate-300",
    href: "tel:+919876543210",
  },
  {
    id: "quick-order",
    label: "Quick",
    highlight: "Order",
    icon: QuickOrderIcon,
    cardBg: "bg-slate-50",
    border: "border-slate-200",
    hoverShadow: "hover:shadow-md hover:bg-white hover:border-slate-300",
    href: "/quick-order",
  },
  {
    id: "whatsapp",
    label: "Book via",
    highlight: "Whatsapp",
    icon: WhatsAppIcon,
    cardBg: "bg-slate-50",
    border: "border-slate-200",
    hoverShadow: "hover:shadow-md hover:bg-white hover:border-slate-300",
    href: WHATSAPP_URL,
    target: "_blank",
  },
];

export const PromoBanner = ({ className }: { className?: string }) => {
   const banner = {
      title: <>Can&apos;t Find <span >what you&apos;re</span> <span className="text-gradient-brand">Looking For</span></>,
      subtitle: "NABL Accredited Tests",
      desc: "Unsure whether you need microbiological, chemical, nutritional, heavy metal, pesticide residue, shelf-life, or contaminant testing?",
      color: "#004D62",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
   };

   return (
      <section className={cn(className)}>
         <div className="max-w-7xl mx-auto px-4">
            <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)] border border-slate-100 h-[620px] md:h-[320px]">
               <div className="h-full w-full flex flex-col lg:flex-row">
                  <div className="flex-[1] p-10 lg:pl-16 flex flex-col justify-center relative z-10 bg-white">
                     <div className="inline-flex items-center gap-2 mb-3" style={{ color: banner.color }}>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{banner.subtitle}</span>
                     </div>
                     <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tighter leading-[1.05] mb-4">
                        {banner.title}
                     </h2>
                     <p className="text-slate-500 text-sm font-semibold mb-8 max-w-lg">
                        {banner.desc}
                     </p>
                     <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
                        {actions.map((action) => {
                           const Icon = action.icon;
                           const linkEl = (
                              <a
                                 key={action.id}
                                 href={action.id === "quick-order" ? undefined : action.href}
                                 onClick={(e) => {
                                    if (action.id === "phone") {
                                       e.preventDefault();
                                       toast.success("Connecting you with our medical advisor...", {
                                          description: "Call initiated to +91 98765 43210 (Litmus Advisory Support).",
                                       });
                                    } else if (action.id === "whatsapp") {
                                       e.preventDefault();
                                       toast.success("Redirecting to WhatsApp...", {
                                          description: `Opening chat with +${WHATSAPP_NUMBER}.`,
                                       });
                                       setTimeout(() => {
                                          window.open(WHATSAPP_URL, "_blank");
                                       }, 800);
                                    }
                                 }}
                                 target={action.target}
                                 rel={action.target === "_blank" ? "noopener noreferrer" : undefined}
                                 className={cn(
                                    "flex items-center gap-2.5 px-5 py-2.5 rounded-xl border backdrop-blur-sm transition-all duration-200 cursor-pointer group/action w-full sm:w-auto justify-center",
                                    action.cardBg,
                                    action.border,
                                    action.hoverShadow
                                 )}
                              >
                                 <span className="flex-shrink-0 transition-transform duration-200 group-hover/action:scale-110">
                                    <Icon />
                                 </span>
                                 <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                    {action.label}{" "}
                                    <strong className="text-gray-800 font-bold">{action.highlight}</strong>
                                 </span>
                              </a>
                           );

                           if (action.id === "quick-order") {
                              return (
                                 <ConsultationBookingModal key={action.id} serviceName="Quick Package Order">
                                    {linkEl}
                                 </ConsultationBookingModal>
                              );
                           }

                           return linkEl;
                        })}
                     </div>
                  </div>
                  <div className="flex-1 relative h-32 lg:h-auto overflow-hidden">
                     <img src={banner.img} className="w-full h-full object-cover" alt="Verification" />
                     <div className="absolute inset-0 bg-black/5" />
                     <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent hidden lg:block" />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};
