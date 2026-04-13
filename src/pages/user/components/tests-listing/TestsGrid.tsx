import { ArrowDown } from "lucide-react";
import type { MouseEvent } from "react";
import { SectionHeader } from "../home/SectionHeader";
import { TestCard } from "../HomeTests";
import type { products } from "@/lib/placeholder-data";

type Product = (typeof products)[number];

interface TestsGridProps {
  products: Product[];
  cartItems: Record<string, number>;
  addToCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: string, e: MouseEvent<HTMLButtonElement>) => void;
  handleSeeMore: () => void;
  hasMore: boolean;
}

export const TestsGrid = ({
  products,
  cartItems,
  addToCart,
  removeFromCart,
  handleSeeMore,
  hasMore
}: TestsGridProps) => {
  return (
    <div className="space-y-12">
      <SectionHeader
        title={
          <>
            Test Packages <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#F06C00]">for You</span>
          </>
        }
        subtitle="Industry-compliant multi-parameter testing panels for complete safety verification."
      />

      <div className="flex flex-wrap gap-6 justify-center lg:justify-start -mx-2">
        {products.map((p) => (
          <TestCard
            key={p.id}
            p={p}
            cartItems={cartItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </div>

      {/* See More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center py-5 gap-4">
          <button
            onClick={handleSeeMore}
            className="group relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-800 font-bold tracking-tight hover:border-[#D32F2F]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative text-sm z-10">Show More Packages</span>
            <div className="relative z-10 h-8 w-8 rounded-xl bg-gradient-to-br from-[#D32F2F] to-[#F06C00] flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
              <ArrowDown className="h-4 w-4 text-white" />
            </div>
            <div className="absolute inset-0 bg-slate-50 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 origin-center -z-0" />
          </button>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Discover more diagnostic capabilities</p>
        </div>
      )}
    </div>
  );
};
