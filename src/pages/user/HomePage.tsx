import { HomeHero } from "./components/HomeHero";
import { useState, type MouseEvent } from "react";
import { HomeTests } from "./components/HomeTests";
import { PartnerLabs } from "./components/home/PartnerLabs";
import { PromoBanner } from "./components/home/PromoBanner";
import { WhatsAppBanner } from "./components/home/WhatsAppBanner";
import { CustomerReviews } from "./components/home/CustomerReviews";
import { FeaturedPackages } from "./components/home/FeaturedPackages";
import { SpecialityCarousel } from "./components/home/SpecialityCarousel";
import { SafetyCheckupBanner } from "./components/home/SafetyCheckupBanner";
import { FooterSEO } from "@/components/layout/footer/FooterSEO";

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
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">

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
      <PromoBanner className="pb-20" />

      {/* ═══════════ CATEGORY GRIDS ═══════════ */}
      <FeaturedPackages />
      <SpecialityCarousel />

      {/* ═══════════ TRUSTED PARTNERS ═══════════ */}
      <PartnerLabs />

      {/* ═══════════ REVIEWS ═══════════ */}
      <CustomerReviews />

      {/* ═══════════ CALL TO ACTIONS ═══════════ */}
      <SafetyCheckupBanner />
      <WhatsAppBanner className="py-12 md:py-20" />

      {/* ═══════════ SEO CONTENT ═══════════ */}
      <FooterSEO />
    </div>
  );
}
