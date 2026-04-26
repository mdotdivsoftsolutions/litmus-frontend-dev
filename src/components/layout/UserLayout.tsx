import { useState, useEffect } from "react";
import { Header } from "./header/Header";
import { AuthModal } from "../auth/AuthModal";
import { MainFooter } from "./footer/MainFooter";
import { Outlet, useLocation } from "react-router-dom";
import { FloatingSupportChat } from "./FloatingSupportChat";
import { MobileTabNavigation } from "./MobileTabNavigation";
import { FooterSearchLinks } from "./footer/FooterSearchLinks";

export function UserLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [city, setCity] = useState("Chennai");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement] = useState(true);
  const [cartCount] = useState(2);
  const [showSearch, setShowSearch] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  // Handle auto-opening of the modal on first load
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("has-seen-auth-modal");
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsAuthModalOpen(true);
        sessionStorage.setItem("has-seen-auth-modal", "true");
      }, 2000); // 2 second delay for better UX
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
        onLoginClick={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <FooterSearchLinks />

      <MainFooter />

      <FloatingSupportChat />
      <MobileTabNavigation cartCount={cartCount} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isSkippable={true}
      />
    </div>
  );
}
