import { useState, type MouseEvent } from "react";

import { useSearchParams } from "react-router-dom";
import { Package, Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { testApi } from "@/lib/api/test";
import { categoryApi } from "@/lib/api/category";
import { Skeleton } from "@/components/ui/skeleton";

// Sub-components
import { TestsHero } from "./components/tests-listing/TestsHero";
import { TestsStatsStrip } from "./components/tests-listing/TestsStatsStrip";
import { MostBookedTests } from "./components/tests-listing/MostBookedTests";
import { CategoryStrip } from "./components/tests-listing/CategoryStrip";
import { TestsGrid } from "./components/tests-listing/TestsGrid";
import { PromoBanner } from "./components/home/PromoBanner";
import { TrustAndOrdering } from "./components/tests-listing/TrustAndOrdering";

const testTypes = ["Physical", "Chemical", "Microbiological"];
const categoryPills = ["All", "Dairy", "Beverages", "Grains & Cereals", "Spices", "Meat & Poultry", "Oils & Fats", "Processed Foods", "Snacks"];

const iconMap: Record<string, React.ElementType> = {
  milk: Milk, coffee: Coffee, wheat: Wheat, flame: Flame,
  drumstick: Drumstick, droplets: Droplets, package: Package, cookie: Cookie,
};

export default function TestsListingPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [selectedType, setSelectedType] = useState("");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [visibleItems, setVisibleItems] = useState(12);

  const { data: testsRes, isLoading: testsLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: () => testApi.getTests()
  });

  const { data: catRes, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryApi.getCategories();
      return res.data;
    }
  });

  const testsData = testsRes?.data || [];
  const categoriesData = catRes?.data || [];

  const filtered = Array.isArray(testsData) ? testsData.filter((t: any) => {
    // Category filter
    if (selectedCategory !== "All") {
      const isAppToAll = t.isApplicableToAll;
      const hasCat = t.applicableCategories?.some((c: any) => c.name === selectedCategory);
      if (!isAppToAll && !hasCat) return false;
    }
    // Search filter
    if (search && !t.testName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) : [];

  const formattedTests = filtered.slice(0, visibleItems).map((t: any) => ({
    id: t._id,
    name: t.testName,
    price: t.offerPrice || t.price,
    mrp: t.price || t.offerPrice,
    tat: t.turnAroundTime || "3 days",
    tests: t.metadata?.parameters?.length || 0,
  }));

  const hasMore = visibleItems < filtered.length;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleItems(12);
  };

  const handleSeeMore = () => setVisibleItems(prev => prev + 6);

  const discountPct = (price: number, mrp: number) => Math.round(((mrp - price) / mrp) * 100);
  const addToCart = (id: string, e?: MouseEvent<HTMLButtonElement>) => { e?.preventDefault(); setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 })); };
  const removeFromCart = (id: string, e?: MouseEvent<HTMLButtonElement>) => { e?.preventDefault(); setCartItems(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  }); };

  const filters = [
    ...(selectedCategory && selectedCategory !== "All" ? [{ label: selectedCategory, clear: () => setSelectedCategory("All") }] : []),
    ...(selectedType ? [{ label: selectedType, clear: () => setSelectedType("") }] : []),
  ];

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">

      {/* 1. PANORAMIC HERO */}
      <TestsHero search={search} setSearch={setSearch} />

      {/* 2. STATS STRIP */}
      <TestsStatsStrip /> 

      {/* 3. CATEGORY STRIP — always at top for filtering */}
      <CategoryStrip
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        categories={categoriesData}
        isLoading={catLoading}
      />

      {/* 4. TEST PACKAGES GRID */}
      {/* <div className="max-w-7xl mx-auto px-4 py-6 my-16">
        <TestsGrid
          ...
        />
      </div> */}

      {/* 5. MOST BOOKED DIAGNOSTICS */}
      <MostBookedTests
        tests={formattedTests}
        discountPct={discountPct}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        categories={categoriesData}
        iconMap={iconMap}
        cn={cn}
        isLoading={testsLoading}
      />

      {/* TRUST & ORDERING SECTION (Customized for Litmus) */}
      <TrustAndOrdering />

      {/* PROMO BANNER CAROUSEL (From Home Page) */}
      <PromoBanner className="py-12 bg-slate-50 md:py-20" />

      <div className="max-w-7xl mx-auto px-4">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
