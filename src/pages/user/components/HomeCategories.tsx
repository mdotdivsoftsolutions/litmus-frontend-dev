import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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

/** Top image band + white copy block — pastel tints match reference layout */
const featuredCategoryCards = [
  {
    name: "Dairy Products",
    subtitle: "Milk, cheese & butter safety panels",
    count: 120,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#e3f2fd]",
  },
  {
    name: "Beverages",
    subtitle: "Juice, dairy drinks & bottled checks",
    count: 85,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#d5f5f2]",
  },
  {
    name: "Spices",
    subtitle: "Adulteration & purity you can trust",
    count: 145,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#ede7f6]",
  },
  {
    name: "Grains & Cereals",
    subtitle: "Staple quality & residue screening",
    count: 210,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop",
    tint: "bg-[#e8eaf0]",
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100/90 bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-16px_rgba(15,23,42,0.18)]"
    >
      <div
        className={`relative flex h-[168px] items-center justify-center overflow-hidden sm:h-[188px] ${tint}`}
      >
        <img
          src={image}
          alt=""
          className="object-cover w-full h-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{subtitle}</p>
        <p className="mt-3 text-xs font-semibold text-slate-400">{footnote}</p>
      </div>
    </Link>
  );
}

export function HomeCategories() {
  return (
    <>
      <section className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden border-slate-100 bg-white py-24 pb-32">
        <div className="pointer-events-none absolute right-[-10%] top-0 h-[600px] w-[600px] rounded-full bg-red-50/50 blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-800 lg:text-4xl">
                Most Booked{" "}
                <span className="bg-gradient-to-r from-[#D32F2F] to-[#F06C00] bg-clip-text text-transparent">
                  Packages
                </span>
              </h2>
              <p className="mt-3 text-lg text-slate-500">
                Explore our highly certified, industry-standard testing categories.
              </p>
            </div>
            <span className="group flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-[#D32F2F] hover:underline">
              Explore All Categories{" "}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
            {featuredCategoryCards.map((cat) => (
              <PastelCategoryCard
                key={cat.name}
                to={`/tests?category=${encodeURIComponent(cat.name)}`}
                title={cat.name}
                subtitle={cat.subtitle}
                footnote={`${cat.count}+ verified tests`}
                image={cat.image}
                tint={cat.tint}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-50 py-24">
        <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-50/30 blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
          <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D32F2F]">
                Clinical Specialities
              </div>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-slate-800 lg:text-4xl">
                Tests By Food{" "}
                <span className="bg-gradient-to-r from-[#D32F2F] to-[#F06C00] bg-clip-text text-transparent">
                  Category
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-lg text-slate-500">
                Architected for precision. Explore our expansive catalogue of specialized diagnostic tests
                across every food industry vertical.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden flex-col items-end md:flex">
                <span className="text-2xl font-bold text-slate-800">150+</span>
                <span className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  Verified Tests
                </span>
              </div>
              <span className="group flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-red-100 bg-red-50 px-6 py-3 text-sm font-medium text-[#D32F2F] shadow-sm transition-all hover:underline">
                Explore Full Catalogue{" "}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {quickCategories.map((cat) => (
              <PastelCategoryCard
                key={cat.label}
                to={`/tests?category=${encodeURIComponent(cat.label)}`}
                title={cat.label}
                subtitle={cat.subtitle}
                footnote={`${cat.tests} tests in this category`}
                image={cat.image}
                tint={cat.tint}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
