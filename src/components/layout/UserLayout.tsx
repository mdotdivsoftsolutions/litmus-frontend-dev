import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./header/Header";
import { FooterSEO } from "./footer/FooterSEO";
import { MainFooter } from "./footer/MainFooter";
import { MobileTabNavigation } from "./MobileTabNavigation";
import { FloatingSupportChat } from "./FloatingSupportChat";

export function UserLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [city, setCity] = useState("Chennai");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement] = useState(true);
  const [cartCount] = useState(2);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { 
    setMobileMenuOpen(false); 
    setShowSearch(false); 
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        scrolled={scrolled}
        city={city}
        setCity={setCity}
        cartCount={cartCount}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        showAnnouncement={showAnnouncement}
      />

      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <FooterSEO />
      <MainFooter />

      <FloatingSupportChat />
      <MobileTabNavigation cartCount={cartCount} />
    </div>
  );
}
