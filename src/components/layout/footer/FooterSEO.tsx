import { FooterIntroGrid } from "./FooterIntroGrid";
import { FooterSteps } from "./FooterSteps";
import { FooterTrustPoints } from "./FooterTrustPoints";
import { FooterFAQGrid } from "./FooterFAQGrid";
import { FooterSearchLinks } from "./FooterSearchLinks";

export function FooterSEO() {
  return (
    <section className="bg-white border-t border-slate-100 pt-20 pb-16 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4">
        <FooterIntroGrid />
        <FooterSteps />
        <FooterTrustPoints />
        <FooterFAQGrid />
        <FooterSearchLinks />
      </div>
    </section>
  );
}
