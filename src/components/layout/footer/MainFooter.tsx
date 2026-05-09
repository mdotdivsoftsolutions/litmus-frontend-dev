import { FooterBrandInfo } from "./FooterBrandInfo";
import { FooterNavColumn } from "./FooterNavColumn";
import { FooterBottom } from "./FooterBottom";

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact Us", href: "/contact" },
];

const SERVICE_LINKS = [
  { label: "Tests", href: "/tests" },
  { label: "Packages", href: "/packages" },
  { label: "Labs", href: "/labs" },
  { label: "Book Consultation", href: "/consultation" },
  { label: "Support", href: "/support" },
];

const QUICK_LINKS = [
  { label: "Cart", href: "/cart" },
  { label: "Help Center", href: "/help" },
  { label: "FAQs", href: "/faqs" },
  { label: "Track Order", href: "/orders" },
];

const POLICY_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "NABL Data", href: "/nabl" },
];

export function MainFooter() {
  return (
    <footer className="hidden lg:block bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-6 mb-12">
          <FooterBrandInfo />
          <FooterNavColumn title="Company" links={COMPANY_LINKS} />
          <FooterNavColumn title="Services" links={SERVICE_LINKS} />
          <FooterNavColumn title="Quick Links" links={QUICK_LINKS} />
          <FooterNavColumn title="Policies" links={POLICY_LINKS} />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
