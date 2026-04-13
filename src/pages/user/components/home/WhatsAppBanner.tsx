import { useState, useEffect } from "react";
import { ArrowRight, Phone, FileEdit, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const bannerSlides = [
   {
      id: "whatsapp",
      title: "Can't find what you're looking for?",
      subtitle: "We are here to help. Say 'Hi' on WhatsApp",
      icon: MessageSquare,
      color: "from-[#1D7A5D] to-[#128C7E]",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
   },
   {
      id: "phone",
      title: "Need help with Booking?",
      subtitle: "Our healthcare experts are just a call away to assist you.",
      icon: Phone,
      color: "from-[#D32F2F] to-[#F06C00]", // Brand Primary
   },
   {
      id: "order",
      title: "Ready for a Quick Order?",
      subtitle: "Skip the forms. Place your testing order in under 60 seconds.",
      icon: FileEdit,
      color: "from-[#ec4343] to-[#d42c2c]", // Brand red variants
   }
];

export function WhatsAppBanner({ className }: { className?: string }) {
   const [current, setCurrent] = useState(0);

   useEffect(() => {
      const timer = setInterval(() => {
         setCurrent((prev) => (prev + 1) % bannerSlides.length);
      }, 5000);
      return () => clearInterval(timer);
   }, []);

   return (
      <section className={cn("py-10", className)}>
         <div className="max-w-4xl mx-auto px-4">
            
            <div className="relative overflow-hidden rounded-2xl shadow-md group">
               <div 
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ transform: `translateX(-${current * 100}%)` }}
               >
                  {bannerSlides.map((slide) => (
                     <div 
                        key={slide.id} 
                        className={cn(
                           "min-w-full h-[140px] relative flex items-center justify-between px-8 lg:px-14 bg-gradient-to-br",
                           slide.color
                        )}
                     >
                        <div className="relative z-10 flex flex-col justify-center max-w-xl">
                           <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight mb-1">
                              {slide.title}
                           </h2>
                           
                           <div className="w-full h-[0.5px] border-b border-dashed border-white/20 mb-2" />
                           
                           <div className="flex items-center gap-2 group/action cursor-pointer">
                              <p className="text-white/80 text-xs lg:text-sm font-medium">
                                 {slide.subtitle}
                              </p>
                              <ArrowRight className="h-4 w-4 text-white/80 group-hover/action:translate-x-1 transition-transform" />
                           </div>
                        </div>

                        <div className="relative z-10">
                           <div className="h-20 w-20 lg:h-24 lg:w-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                              <div className="h-[75%] w-[75%] bg-white rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                                 {slide.id === 'whatsapp' ? (
                                    <img src={slide.image} className="h-8 w-8 lg:h-9 lg:w-9 object-contain" alt="WhatsApp" />
                                 ) : (
                                    <slide.icon className={cn("h-8 w-8 lg:h-9 lg:w-9", slide.id === 'phone' ? 'text-[#D32F2F]' : 'text-[#ec4343]')} />
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Indicators */}
               <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  {bannerSlides.map((_, i) => (
                     <div 
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={cn(
                           "h-1 transition-all duration-500 rounded-full cursor-pointer",
                           i === current ? "w-4 bg-white" : "w-1 bg-white/30 hover:bg-white/50"
                        )}
                     />
                  ))}
               </div>
               
               <button onClick={() => setCurrent((prev) => (prev === 0 ? bannerSlides.length -1 : prev - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20">
                  <ChevronLeft className="h-3.5 w-3.5" />
               </button>
               <button onClick={() => setCurrent((prev) => (prev + 1) % bannerSlides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20">
                  <ChevronRight className="h-3.5 w-3.5" />
               </button>
            </div>
         </div>
      </section>
   );
}
