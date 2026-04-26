import { Link } from "react-router-dom";
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
  {
    label: "Beverages & Drinks",
    subtitle: "Juice, dairy drinks & bottled water",
    tests: 14,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#fff3e0]",
  },
  {
    label: "Bakery & Confectionery",
    subtitle: "Bread, cakes & chocolate testing",
    tests: 11,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#fce4ec]",
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
      {/* 30% smaller image area: was h-[168px]/h-[188px], now h-[120px]/h-[132px] */}
      <div
        className={`relative flex h-[120px] items-center justify-center overflow-hidden sm:h-[132px] ${tint}`}
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h3 className="text-base font-bold leading-snug tracking-tight text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>
        <p className="mt-auto pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {footnote}
        </p>
      </div>
    </Link>
  );
}

export function SpecialityCarousel() {
  return (
    <section className="relative flex min-h-full flex-col justify-center overflow-hidden bg-white py-12 md:py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <SectionHeader
          badge="Clinical Specialities"
          title={
            <>
              Tests By Food{" "}
              <span className="text-gradient-brand">
                Category
              </span>
            </>
          }
          subtitle="Architected for precision. Explore our expansive catalogue of specialized diagnostic tests across every food industry vertical."
          action={{
            label: "Explore Full Catalogue",
            href: "/tests",
          }}
        />

        {/* 2 rows x 4 columns grid — 8 categories */}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 pb-4 pt-4">
          {quickCategories.map((cat) => (
            <div key={cat.label}>
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
