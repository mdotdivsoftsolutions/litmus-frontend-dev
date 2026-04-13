import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight, Milk, Coffee, Wheat, Flame, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

const featuredCategoryCards = [
  {
    name: "Dairy Products",
    subtitle: "Milk, cheese & butter safety panels",
    count: 120,
    icon: Milk,
    color: "bg-[#D32F2F]",
    lightColor: "bg-red-50",
    textColor: "text-[#D32F2F]",
  },
  {
    name: "Beverages",
    subtitle: "Juice, dairy drinks & bottled checks",
    count: 85,
    icon: Coffee,
    color: "bg-[#F06C00]",
    lightColor: "bg-orange-50",
    textColor: "text-[#F06C00]",
  },
  {
    name: "Grains & Cereals",
    subtitle: "Staple quality & residue screening",
    count: 210,
    icon: Wheat,
    color: "bg-[#D32F2F]",
    lightColor: "bg-red-50",
    textColor: "text-[#D32F2F]",
  },
  {
    name: "Spices",
    subtitle: "Adulteration & purity you can trust",
    count: 145,
    icon: Flame,
    color: "bg-[#F06C00]",
    lightColor: "bg-orange-50",
    textColor: "text-[#F06C00]",
  },
] as const;

function FeaturedPackageCard({
  to,
  title,
  footnote,
  icon: Icon,
  color,
}: {
  to: string;
  title: string;
  footnote: string;
  icon: LucideIcon;
  color: string;
  textColor: string;
}) {
  return (
    <Link
      to={to}
      className="group flex flex-col rounded-[1.5rem] border border-slate-100 bg-white p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)]"
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon Container */}
        <div
          className={cn(
            "mb-8 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:scale-110",
            color
          )}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight text-slate-800">{title}</h3>

        {/* Badge */}
        <div className="mt-4 flex items-center gap-1.5 rounded-full bg-slate-50 px-4 py-1.5 text-[11px] font-bold text-slate-500 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {footnote}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-50">
        <span className="text-sm font-bold text-slate-400 transition-colors group-hover:text-slate-600">
          View Details
        </span>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
            "bg-red-50 text-brand-primary group-hover:bg-gradient-brand group-hover:text-white"
          )}
        >
          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
        </div>
      </div>
    </Link>
  );
}

export function FeaturedPackages() {
  return (
    <section className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden border-slate-100 bg-white py-12 md:py-20">
      {/* Decorative background shadows */}
      <div className="pointer-events-none absolute right-[-5%] top-0 h-[600px] w-[600px] rounded-full bg-red-50/40 blur-[120px]" />
      <div className="pointer-events-none absolute left-[-5%] bottom-0 h-[600px] w-[600px] rounded-full bg-orange-50/30 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
        <SectionHeader
          title={
            <>
              Most Booked{" "}
              <span className="bg-gradient-to-r from-[#D32F2F] to-[#F06C00] bg-clip-text text-transparent">
                Packages
              </span>
            </>
          }
          subtitle="Explore our highly certified, industry-standard testing categories architected for precision."
          action={{
            label: "Explore All Categories",
            href: "/tests",
          }}
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategoryCards.map((cat) => (
            <FeaturedPackageCard
              key={cat.name}
              to={`/tests?category=${encodeURIComponent(cat.name)}`}
              title={cat.name}
              footnote={`${cat.count}+ Verified Tests`}
              icon={cat.icon}
              color={cat.color}
              textColor={cat.textColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
