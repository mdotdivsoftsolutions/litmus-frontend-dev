import { HomeHero } from "./components/HomeHero";
import { useState, type MouseEvent } from "react";
import { HomeTests } from "./components/HomeTests";
import { PartnerLabs } from "./components/home/PartnerLabs";
import { PromoBanner } from "./components/home/PromoBanner";
import { WhatsAppBanner } from "./components/home/WhatsAppBanner";
import { CustomerReviews } from "./components/home/CustomerReviews";
import { FAQ } from "./components/home/FAQ";
import { SpecialityCarousel } from "./components/home/SpecialityCarousel";
import { HowToBookProcess } from "./components/home/HowToBookProcess";
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
    <div className="bg-[#F6FBFF] min-h-screen overflow-x-hidden">

      {/* ═══════════ HERO & METRICS ═══════════ */}
      <HomeHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ═══════════ POPULAR TESTS CAROUSEL ═══════════ */}
      <HomeTests
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />

      {/* ═══════════ POPULAR PACKAGES — "Popular Packages Near You" ═══════════ */}
      <PromoBanner className="pb-12 md:pb-16" />

      {/* ═══════════ TESTS BY FOOD CATEGORY (2 rows, 8 cards) ═══════════ */}
      <SpecialityCarousel />

      {/* ═══════════ HOW WE WORK (flow chart with icons) ═══════════ */}
      <HowToBookProcess className="bg-[#F6FBFF]" />

      {/* ═══════════ TRUSTED PARTNER LABORATORIES ═══════════ */}
      <PartnerLabs />

      {/* ═══════════ CUSTOMER REVIEWS (marquee ticker) ═══════════ */}
      <CustomerReviews />

      {/* ═══════════ SAFETY CHECKUP BANNER (4-slide carousel) ═══════════ */}
      <SafetyCheckupBanner />

      {/* ═══════════ FAQ ═══════════ */}
      <FAQ />

      {/* ═══════════ SEO CONTENT ═══════════ */}
      <FooterSEO />
    </div>
  );
}
