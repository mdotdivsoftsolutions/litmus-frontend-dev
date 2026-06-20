import { useState, useRef, type MouseEvent } from "react";
import { useDebounce } from "@/hooks/use-debounce";

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

  const { data: catRes, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await categoryApi.getCategories();
      return res.data;
    }
  });

  const rawData = catRes?.data?.data || catRes?.data || catRes || [];
  const categoriesData = Array.isArray(rawData) ? rawData : [];

  let selectedCategoryId = undefined;
  let activeCategoryName = selectedCategory;

  if (selectedCategory !== "All") {
    const isId = /^[0-9a-fA-F]{24}$/.test(selectedCategory);
    const matchedCategory = categoriesData.find((c: any) => isId ? c._id === selectedCategory : c.name === selectedCategory);
    
    if (matchedCategory) {
      selectedCategoryId = matchedCategory._id;
      activeCategoryName = matchedCategory.name;
    } else if (isId) {
      selectedCategoryId = selectedCategory; // Fallback to use the ID directly if category data hasn't loaded yet
    }
  }
  const debouncedSearch = useDebounce(search, 300);

  const { data: testsRes, isLoading: testsLoading } = useQuery({
    queryKey: ['tests', debouncedSearch, selectedCategoryId],
    queryFn: () => testApi.getTests({ search: debouncedSearch, category: selectedCategoryId })
  });

  const testsData = testsRes?.data || [];
  const filtered = testsData;

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

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">

      {/* 1. PANORAMIC HERO */}
      <TestsHero search={search} setSearch={setSearch} tests={testsData} onSearch={handleSearch} />

      {/* 2. STATS STRIP */}
      <TestsStatsStrip /> 

      {/* 3. CATEGORY STRIP — always at top for filtering */}
      <CategoryStrip
        selectedCategory={activeCategoryName}
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
      <div ref={resultsRef} className="scroll-mt-6">
        <MostBookedTests
          tests={formattedTests}
          discountPct={discountPct}
          selectedCategory={activeCategoryName}
          setSelectedCategory={handleCategoryChange}
          categories={categoriesData}
          iconMap={iconMap}
          cn={cn}
          isLoading={testsLoading}
        />
      </div>

      {/* TRUST & ORDERING SECTION (Customized for Litmus) */}
      <TrustAndOrdering />

      {/* PROMO BANNER CAROUSEL (From Home Page) */}
      <PromoBanner className="py-12 bg-slate-50 md:py-20" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Empty state is now handled inside MostBookedTests */}
      </div>
    </div>
  );
}
