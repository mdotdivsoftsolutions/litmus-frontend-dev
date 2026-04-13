import { useState } from "react";
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
  const [sortBy, setSortBy] = useState("relevance");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [visibleItems, setVisibleItems] = useState(6);

  const featuredTests = [
    { id: "1", name: "Fat Content Test", method: "FSSAI IS:1479", price: 1200, mrp: 2100, tat: "3 days", type: "Chemical", tests: 8 },
    { id: "2", name: "Protein Analysis", method: "FSSAI IS:7219", price: 1500, mrp: 2500, tat: "4 days", type: "Chemical", tests: 12 },
    { id: "3", name: "Microbial Count Test", method: "FSSAI IS:5402", price: 850, mrp: 1400, tat: "5 days", type: "Microbiological", tests: 6 },
    { id: "4", name: "Moisture Content", method: "FSSAI IS:1165", price: 650, mrp: 1000, tat: "2 days", type: "Physical", tests: 4 },
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
  const addToCart = (id: string) => setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCartItems(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id]--;
    else delete next[id];
    return next;
  });

  const filters = [
    ...(selectedCategory && selectedCategory !== "All" ? [{ label: selectedCategory, clear: () => setSelectedCategory("All") }] : []),
    ...(selectedType ? [{ label: selectedType, clear: () => setSelectedType("") }] : []),
  ];

  return (
    <div className="animate-fade-in font-manrope bg-white min-h-screen">

      {/* 1. PANORAMIC HERO */}
      <TestsHero search={search} setSearch={setSearch} />

      {/* 2. STATS STRIP */}
      <TestsStatsStrip />
      
      {/* 4. MOST BOOKED TESTS */}
      <MostBookedTests
        tests={featuredTests}
        discountPct={discountPct}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        categories={categories}
        iconMap={iconMap}
        cn={cn}
      />


      <div className="max-w-7xl mx-auto px-4 py-6 space-y-12 py-24">

        {/* 3. CATEGORY NAVIGATION & SEARCH FILTERS (Now Modular) */}
        {/* <FilterNavigation 
          categoryPills={categoryPills}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          search={search}
          setSearch={setSearch}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          testTypes={testTypes}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filters={filters}
          cn={cn}
        /> */}


        {/* 5. COMPREHENSIVE PRODUCT GRID */}
        <TestsGrid 
          products={paginatedProducts} 
          cartItems={cartItems} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart} 
          handleSeeMore={handleSeeMore}
          hasMore={hasMore}
        />
      </div>

      {/* PROMO BANNER CAROUSEL (From Home Page) */}
      <PromoBanner className="pt-24"  />

      {/* TRUST & ORDERING SECTION (Customized for Litmus) */}
      <TrustAndOrdering />

      {/* 6. WHY LITMUS STORYTELLING (Panoramic Section) */}
      <WhyLitmusTests />

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
