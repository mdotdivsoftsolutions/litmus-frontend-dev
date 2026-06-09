import { Link } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api/category";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=600&auto=format&fit=crop";

const TINTS = [
  "bg-[#e3f2fd]",
  "bg-[#d5f5f2]",
  "bg-[#ede7f6]",
  "bg-[#e8eaf0]",
  "bg-[#fff3e0]",
  "bg-[#fce4ec]"
];

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
        className={`relative flex h-[120px] items-center justify-center overflow-hidden sm:h-[132px] ${tint}`}
      >
        <img
          src={image || FALLBACK_IMAGE}
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
  const { data: response, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getCategories
  });

  const categories = response?.data?.data || [];

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

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 pb-4 pt-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-slate-100/90 bg-white p-0 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.12)]">
                <Skeleton className="h-[120px] sm:h-[132px] w-full rounded-none" />
                <div className="flex flex-1 flex-col px-4 pb-4 pt-3 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2 mt-auto pt-2" />
                </div>
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((cat: any, i: number) => (
              <div key={cat._id}>
                <PastelCategoryCard
                  to={`/tests?category=${encodeURIComponent(cat._id)}`}
                  title={cat.name}
                  subtitle={cat.description || "Explore specialized diagnostic tests for this category."}
                  footnote={`${cat.testCount || 0} tests available`}
                  image={cat.imageUrl || FALLBACK_IMAGE}
                  tint={TINTS[i % TINTS.length]}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-muted-foreground">
              No categories available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
