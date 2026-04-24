import { useState, type MouseEvent } from "react";

import { useSearchParams } from "react-router-dom";
import { Package, Milk, Coffee, Wheat, Flame, Drumstick, Droplets, Cookie } from "lucide-react";
import { products, categories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

// Sub-components
import { TestsHero } from "./components/tests-listing/TestsHero";
import { TestsStatsStrip } from "./components/tests-listing/TestsStatsStrip";
import { FilterNavigation } from "./components/tests-listing/FilterNavigation";
import { MostBookedTests } from "./components/tests-listing/MostBookedTests";
import { CategoryStrip } from "./components/tests-listing/CategoryStrip";
import { TestsGrid } from "./components/tests-listing/TestsGrid";
import { WhyLitmusTests } from "./components/tests-listing/WhyLitmusTests";
import { TestsReviewsGrid } from "./components/tests-listing/TestsReviewsGrid";
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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [selectedType, setSelectedType] = useState("");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [visibleItems, setVisibleItems] = useState(6);

  const featuredTests = [
    { id: "1", name: "Fat Content Test", method: "FSSAI IS:1479", price: 1200, mrp: 2100, tat: "3 days", type: "Chemical", tests: 8 },
    { id: "2", name: "Protein Analysis", method: "FSSAI IS:7219", price: 1500, mrp: 2500, tat: "4 days", type: "Chemical", tests: 12 },
    { id: "3", name: "Microbial Count Test", method: "FSSAI IS:5402", price: 850, mrp: 1400, tat: "5 days", type: "Microbiological", tests: 6 },
    { id: "4", name: "Moisture Content", method: "FSSAI IS:1165", price: 650, mrp: 1000, tat: "2 days", type: "Physical", tests: 4 },
    { id: "5", name: "Adulteration Check", method: "FSSAI IS:1479", price: 950, mrp: 1500, tat: "3 days", type: "Chemical", tests: 5 },
    { id: "6", name: "Shelf Life Study", method: "FSSAI IS:7219", price: 3500, mrp: 5000, tat: "14 days", type: "Chemical", tests: 20 },
    { id: "7", name: "Heavy Metals Test", method: "FSSAI IS:5402", price: 2200, mrp: 3500, tat: "5 days", type: "Microbiological", tests: 7 },
    { id: "8", name: "Pesticide Residue", method: "FSSAI IS:1165", price: 2800, mrp: 4000, tat: "4 days", type: "Physical", tests: 10 },
    { id: "9", name: "Aflatoxin Screen", method: "FSSAI IS:1479", price: 1800, mrp: 2800, tat: "3 days", type: "Chemical", tests: 4 },
    { id: "10", name: "Allergen Testing", method: "FSSAI IS:7219", price: 2500, mrp: 4000, tat: "4 days", type: "Chemical", tests: 8 },
    { id: "11", name: "pH Analysis", method: "FSSAI IS:5402", price: 450, mrp: 800, tat: "2 days", type: "Microbiological", tests: 2 },
    { id: "12", name: "Sensory Eval", method: "FSSAI IS:1165", price: 1100, mrp: 1800, tat: "3 days", type: "Physical", tests: 6 },
  ];

  const filtered = products.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const hasMore = visibleItems < filtered.length;
  const paginatedProducts = filtered.slice(0, visibleItems);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleItems(6);
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
      />

      {/* 4. TEST PACKAGES GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6 my-16">
        <TestsGrid
          products={paginatedProducts}
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          handleSeeMore={handleSeeMore}
          hasMore={hasMore}
        />
      </div>

      {/* 5. MOST BOOKED DIAGNOSTICS */}
      <MostBookedTests
        tests={featuredTests}
        discountPct={discountPct}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        categories={categories}
        iconMap={iconMap}
        cn={cn}
      />

      {/* TRUST & ORDERING SECTION (Customized for Litmus) */}
      <TrustAndOrdering />

      {/* PROMO BANNER CAROUSEL (From Home Page) */}
      <PromoBanner className="py-10 bg-white md:pt-24" />

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
