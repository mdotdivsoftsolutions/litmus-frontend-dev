import { Link } from "react-router-dom";
import { Search, Shield, FileText, Package, Microscope, Ticket, Currency, CurrencyIcon } from "lucide-react";
import { useState } from "react";
import { SearchAutocomplete } from "@/components/common/SearchAutocomplete";
import { ConsultationBookingModal } from "./consultation/ConsultationBookingModal";
import heroScientist from "@/assets/banner-hero-1.jpg";

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function HomeHero({ searchQuery, setSearchQuery }: HomeHeroProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <>
      <section className="relative pt-8 pb-16 md:py-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-[500px] h-full md:h-[600px] bg-[#E53935]/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        <div className="absolute bottom-0 left-0 w-[400px] h-full md:h-[400px] rounded-full bg-brand-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm overflow-hidden mt-4">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-100 mb-6 w-max">
                  <span className="h-2 w-2 rounded-full bg-[#E53935] animate-pulse" />
                  <span className="text-xs font-medium text-slate-700">NABL & FSSAI Accredited Labs</span>
                </div>
                <h1 className="text-2xl sm:text-[36px] font-bold text-slate-800 mb-6 tracking-tight leading-[45px]">
                  Certified Laboratory Testing <br /> <span className="text-gradient-brand"> at Your Fingertips</span>
                </h1>
                <p className="text-slate-500 text-lg mb-8 max-w-md leading-relaxed">
                  Select your product, choose the required parameters, submit samples, and receive accredited laboratory reports without the hassle of contacting multiple labs.
                </p>
                <div className="inline-block bg-brand-primary/10 border border-brand-primary/20 rounded-lg px-3 py-1 mb-6 w-fit">
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">GET OFFERS UPTO 15% ON YOUR FIRST BOOKING</p>
                </div>
              </div>

              <div className="lg:w-1/2 relative bg-gradient-to-br from-red-50/50 to-orange-50/50 p-8 flex items-center justify-center border-l border-white/40">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                <img
                  src={heroScientist}
                  alt="Food Safety Specialist"
                  className="relative z-10 w-full max-w-[420px] aspect-[4/3] object-cover rounded-[2rem] shadow-lg border-[6px] border-white hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-12 right-[10%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white flex items-center gap-3 z-20 animate-[bounce_3s_infinite]">
                  <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">100% Reliable</p>
                    <p className="text-[10px] text-slate-500">Certified Results</p>
                  </div>
                </div>
                <div className="absolute bottom-12 left-[10%] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white flex items-center gap-3 z-20 animate-[bounce_4s_infinite_reverse]">
                  <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#E53935]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">FSSAI Ready</p>
                    <p className="text-[10px] text-slate-500">Auto-generated</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 mb-4 -mt-10 relative z-20">
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div
            className="rounded-[1.5rem] border border-white/50 bg-gradient-to-br from-white/[0.42] via-white/[0.14] to-white/[0.06] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.65),0_16px_48px_-16px_rgba(15,23,42,0.18)] backdrop-blur-[28px] backdrop-saturate-[1.7] md:p-8"
            style={{
              WebkitBackdropFilter: "blur(28px) saturate(170%)",
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
              <form 
                className="relative min-w-0 flex-1 flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/tests?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
              >

                <SearchAutocomplete
                  hideIcon
                  placeholder="Search for tests, categories..."
                  inputClassName="relative placeholder:text-slate-400 z-10 w-full rounded-2xl border-2 border-[#008eb3]/30 bg-white py-3.5 pl-4 pr-12 text-sm text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none ring-[#1a237e]/20 focus:ring-none h-[52px]"
                >
                  <button type="submit" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-slate-400 hover:text-brand-primary">
                    <Search
                      className="h-5 w-5"
                      aria-hidden
                    />
                  </button>
                </SearchAutocomplete>
              </form>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/tests"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_-4px_rgb(var(--brand-primary-rgb)/0.55)] transition hover:brightness-105"
                >
                  Book test
                  <Microscope className="h-5 w-5 shrink-0 opacity-95" strokeWidth={2} />
                </Link>
                <ConsultationBookingModal serviceName="General Consultation" source="Home Hero">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#008eb3] to-[#004e64] px-5 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_-4px_rgba(32,178,170,0.45)] transition hover:brightness-105"
                  >
                    Book free consultation
                    <Ticket className="h-5 w-5 shrink-0 opacity-95" strokeWidth={2} />
                  </button>
                </ConsultationBookingModal>
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_14px_-4px_rgb(var(--brand-primary-rgb)/0.55)] transition hover:brightness-105"
                >
                  book a package
                  <Package className="h-5 w-5 shrink-0 opacity-95" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
