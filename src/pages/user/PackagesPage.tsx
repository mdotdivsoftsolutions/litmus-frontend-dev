import { useState } from "react";
import { CategoryStrip } from "./components/tests-listing/CategoryStrip";
import { PackagesHero } from "./components/packages/PackagesHero";
import { PackagesGrid } from "./components/packages/PackagesGrid";
import { PackagesCTA } from "./components/packages/PackagesCTA";

export default function PackagesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const categories = ["All", "Compliance", "Clinical", "Labeling"];

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      {/* 1. VIBRANT PANORAMIC HERO */}
      <PackagesHero
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
      />

      {/* 2. PACKAGES GRID */}
      <section className="bg-slate-50 ">
        <PackagesGrid
          search={search}
          selectedCategory={selectedCategory}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
        />
      </section>

      {/* 3. CALL TO ACTION */}
      <section className="bg-white py-10 md:py-20">
        <PackagesCTA />
      </section>

      {/* 4. FOOD CATEGORY WISE PACKAGES */}
      <section className="bg-slate-50 ">
        <CategoryStrip selectedCategory="" setSelectedCategory={() => { }} />
      </section>
    </div>
  );
}
