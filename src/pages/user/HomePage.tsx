import { useState, type MouseEvent } from "react";
import { HomeHero } from "./components/HomeHero";
import { HomeTests } from "./components/HomeTests";
import { FeaturedPackages } from "./components/home/FeaturedPackages";
import { SpecialityCarousel } from "./components/home/SpecialityCarousel";
import { PromoBanner } from "./components/home/PromoBanner";
import { PartnerLabs } from "./components/home/PartnerLabs";
import { CustomerReviews } from "./components/home/CustomerReviews";
import { SafetyCheckupBanner } from "./components/home/SafetyCheckupBanner";
import { WhatsAppBanner } from "./components/home/WhatsAppBanner";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("tests");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCartItems(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 overflow-x-hidden">
      
      {/* ═══════════ HERO & METRICS ═══════════ */}
      <HomeHero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* ═══════════ TESTS & PACKAGES CAROUSELS ═══════════ */}
      <HomeTests 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartItems={cartItems} 
        addToCart={addToCart} 
        removeFromCart={removeFromCart} 
      />


      {/* ═══════════ CATEGORY GRIDS ═══════════ */}
      <FeaturedPackages />
      <SpecialityCarousel />

      {/* ═══════════ TRUSTED PARTNERS ═══════════ */}
      {/* <PromoBanner className="py-10 md:py-24 bg-white " /> */}
      <PartnerLabs />

      {/* ═══════════ REVIEWS ═══════════ */}
      <CustomerReviews />

      {/* ═══════════ CALL TO ACTIONS ═══════════ */}
      <SafetyCheckupBanner />
      <WhatsAppBanner />

    </div>
  );
}
