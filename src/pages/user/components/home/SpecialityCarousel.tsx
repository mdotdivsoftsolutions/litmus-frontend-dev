import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const quickCategories = [
  {
    label: "Dairy & Products",
    subtitle: "Milk, cheese & butter safety panels",
    tests: 12,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#e3f2fd]",
  },
  {
    label: "Spices & Condiments",
    subtitle: "Masala, herbs & whole-spice purity",
    tests: 24,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#d5f5f2]",
  },
  {
    label: "Edible Oils & Fats",
    subtitle: "Quality & shelf-life for oils & ghee",
    tests: 8,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#ede7f6]",
  },
  {
    label: "Meat & Poultry",
    subtitle: "Pathogen & freshness verification",
    tests: 16,
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#e8eaf0]",
  },
  {
    label: "Grains & Cereals",
    subtitle: "Residue & nutritional profiling",
    tests: 18,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#e3f2fd]",
  },
  {
    label: "Snacks & Sweets",
    subtitle: "Preservatives & trans-fat screening",
    tests: 10,
    image:
      "https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#d5f5f2]",
  },
] as const;

function PastelCategoryCard({
  to,
  title,
  subtitle,
  footnote,
  image,
  tint,
}: {
  to: string;
  title: string;
  subtitle: string;
  footnote: string;
  image: string;
  tint: string;
}) {
  return (
    <Link
      to={to}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100/90 bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(15,23,42,0.18)]"
    >
      <div
        className={`relative flex h-[168px] items-center justify-center overflow-hidden sm:h-[188px] ${tint}`}
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>
        <p className="mt-auto pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {footnote}
        </p>
      </div>
    </Link>
  );
}

export function SpecialityCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-50 py-12 md:py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <SectionHeader
          badge="Clinical Specialities"
          title={
            <>
              Tests By Food{" "}
              <span className="bg-gradient-to-r from-[#D32F2F] to-[#F06C00] bg-clip-text text-transparent">
                Category
              </span>
            </>
          }
          subtitle="Architected for precision. Explore our expansive catalogue of specialized diagnostic tests across every food industry vertical."
          rightContent={
            <div className="flex items-center gap-4">
              <div className="mr-2 flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-[#D32F2F]/30 hover:bg-white hover:text-[#D32F2F] hover:shadow-md active:scale-95"
                  aria-label="Previous categories"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-[#D32F2F]/30 hover:bg-white hover:text-[#D32F2F] hover:shadow-md active:scale-95"
                  aria-label="Next categories"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <Link
                to="/tests"
                className="group hidden cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-red-100 bg-red-50 px-6 py-3 text-xs font-semibold text-[#D32F2F] shadow-sm transition-all hover:bg-white hover:underline sm:flex"
              >
                Explore Full Catalogue{" "}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          }
        />

        <div
          ref={scrollRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-12 pt-4 transition-all"
        >
          {quickCategories.map((cat) => (
            <div key={cat.label} className="w-[280px] flex-shrink-0 snap-start sm:w-[280px]">
              <PastelCategoryCard
                to={`/tests?category=${encodeURIComponent(cat.label)}`}
                title={cat.label}
                subtitle={cat.subtitle}
                footnote={`${cat.tests} tests available`}
                image={cat.image}
                tint={cat.tint}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
