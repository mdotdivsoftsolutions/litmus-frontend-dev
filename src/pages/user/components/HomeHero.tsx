import { Link } from "react-router-dom";
import { Search, Shield, FileText, Package, Microscope, Ticket, Currency, CurrencyIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { SearchAutocomplete } from "@/components/common/SearchAutocomplete";
import { ConsultationBookingModal } from "./consultation/ConsultationBookingModal";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroScientist from "@/assets/banner-hero-1.jpg";

const slides = [
  {
    id: 1,
    title: <>Certified Laboratory Testing <br /> <span className="text-gradient-brand"> at Your Fingertips</span></>,
    description: "Select your product, choose the required parameters, submit samples, and receive accredited laboratory reports without the hassle of contacting multiple labs.",
    badge: "NABL & FSSAI Accredited Labs",
    offer: "GET OFFERS UPTO 15% ON YOUR FIRST BOOKING",
    image: heroScientist,
    imageAlt: "Food Safety Specialist",
    floatingBadges: [
      {
        icon: Shield,
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        title: "100% Reliable",
        subtitle: "Certified Results",
        position: "top-12 right-[10%]",
        animation: "animate-[bounce_3s_infinite]"
      },
      {
        icon: FileText,
        iconColor: "text-[#E53935]",
        iconBg: "bg-red-100",
        title: "FSSAI Ready",
        subtitle: "Auto-generated",
        position: "bottom-12 left-[10%]",
        animation: "animate-[bounce_4s_infinite_reverse]"
      }
    ]
  },
  {
    id: 2,
    title: <>Comprehensive Food <br /> <span className="text-gradient-brand">Safety Packages</span></>,
    description: "Explore bundled testing packages tailored for regulatory compliance. Stay FSSAI and NABL ready with our curated testing solutions.",
    badge: "Compliance Ready",
    offer: "FLAT 20% OFF ON COMPREHENSIVE PACKAGES",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    imageAlt: "Food Safety Packages",
    floatingBadges: [
      {
        icon: Package,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        title: "Curated Packages",
        subtitle: "Save Time & Money",
        position: "top-12 right-[10%]",
        animation: "animate-[bounce_3s_infinite]"
      },
    ]
  },
  {
    id: 3,
    title: <>Track & Analyze <br /> <span className="text-gradient-brand">with Ease</span></>,
    description: "Get real-time status updates on your samples and download digitally certified, tamper-proof reports the moment they are ready.",
    badge: "Real-time Tracking",
    offer: "INSTANT DIGITAL REPORTS",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2079&auto=format&fit=crop",
    imageAlt: "Track and Analyze",
    floatingBadges: [
      {
        icon: Microscope,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        title: "Real-time Updates",
        subtitle: "Track Samples",
        position: "bottom-12 left-[10%]",
        animation: "animate-[bounce_4s_infinite_reverse]"
      }
    ]
  }
];

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomeHero({ searchQuery, setSearchQuery }: HomeHeroProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <section className="relative pt-6 pb-12 md:pt-12 md:pb-20 overflow-hidden bg-[#F6FBFF]">
        <div className="absolute top-0 right-0 w-[500px] h-full md:h-[600px] bg-[#E53935]/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute bottom-0 left-0 w-[400px] h-full md:h-[400px] rounded-full bg-brand-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Carousel
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            opts={{ loop: true }}
            setApi={setApi}
            className="w-full relative"
          >
            <CarouselContent>
              {slides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <div 
                    className="border border-white/80 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative pb-8 lg:pb-0 h-full flex flex-col bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 100%), url(${slide.image})` }}
                  >
                    <div className="flex flex-col lg:flex-row flex-1 relative z-10 backdrop-blur-[4px]">
                      <div className="lg:w-1/2 px-5 pt-6 pb-2 lg:p-12 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100/50 mb-3 lg:mb-6 w-max">
                          <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                          <span className="text-xs font-medium text-slate-700">{slide.badge}</span>
                        </div>
                        <h1 className="text-3xl sm:text-[36px] font-bold text-slate-800 mb-3 lg:mb-6 tracking-tight leading-[1.2] lg:leading-[45px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                          {slide.title}
                        </h1>
                        <p className="text-slate-600 font-medium text-sm sm:text-base font-inter mb-4 lg:mb-8 max-w-md leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                          {slide.description}
                        </p>
                        <div className="inline-block bg-brand-primary/10 border border-brand-primary/20 rounded-lg px-3 py-1 mb-2 lg:mb-6 w-fit">
                          <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">{slide.offer}</p>
                        </div>
                      </div>

                      <div className="lg:w-1/2 relative p-4 lg:p-8 flex flex-1 items-center justify-center border-t lg:border-t-0 lg:border-l border-white/40">
                        <img
                          src={slide.image}
                          alt={slide.imageAlt}
                          className="relative z-10 w-full max-w-[500px] aspect-[4/3] object-cover rounded-[1.5rem] lg:rounded-[2rem] shadow-lg border-[4px] lg:border-[6px] border-white hover:scale-105 transition-transform duration-700"
                        />
                        {slide.floatingBadges.map((badge, idx) => {
                          const Icon = badge.icon;
                          return (
                            <div key={idx} className={`absolute ${badge.position} bg-white/90 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-sm border border-white flex items-center gap-2 lg:gap-3 z-20 ${badge.animation}`}>
                              <div className={`h-8 w-8 lg:h-10 lg:w-10 ${badge.iconBg} rounded-lg lg:rounded-xl flex items-center justify-center`}>
                                <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${badge.iconColor}`} />
                              </div>
                              <div>
                                <p className="text-[10px] lg:text-xs font-medium text-slate-800">{badge.title}</p>
                                <p className="text-[8px] lg:text-[10px] text-slate-500">{badge.subtitle}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Centered Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            current === index ? "bg-[#0369a1] w-8" : "bg-slate-300/80 hover:bg-slate-400 w-2.5"
                          }`}
                          onClick={() => api?.scrollTo(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section className="relative z-20 max-w-5xl mx-auto px-4 -mt-10 sm:-mt-10 mb-6 lg:mb-12">
        <div className="bg-white rounded-3xl sm:rounded-full p-4 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3">
            <form 
              className="relative min-w-0 flex-1 flex w-full"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/tests?search=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
            >
              <SearchAutocomplete
                hideIcon
                placeholder="Search for checkups..."
                inputClassName="relative placeholder:text-slate-400 z-10 w-full rounded-full border-none bg-slate-50/50 hover:bg-slate-50 py-3.5 pl-5 pr-12 text-sm text-slate-800 outline-none ring-0 focus:ring-0 h-[48px] transition-colors"
              >
                <button type="submit" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-brand-primary">
                  <Search className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                </button>
              </SearchAutocomplete>
            </form>
            
            <div className="flex shrink-0 w-full sm:w-auto overflow-x-auto gap-2 pb-1 sm:pb-0 scrollbar-hide">
              <Link
                to="/tests"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border-2 border-[#f06c00] px-5 py-3 text-xs font-bold text-[#f06c00] shadow-sm transition hover:bg-orange-50 whitespace-nowrap"
              >
                Book test
                <Microscope className="h-4 w-4" />
              </Link>
              <ConsultationBookingModal serviceName="General Consultation" source="Home Hero">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0369a1] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#075985] whitespace-nowrap"
                >
                  Book free consultation
                  <Ticket className="h-4 w-4" />
                </button>
              </ConsultationBookingModal>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white border-2 border-[#f06c00] px-5 py-3 text-xs font-bold text-[#f06c00] shadow-sm transition hover:bg-orange-50 whitespace-nowrap"
              >
                book a package
                <Package className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
