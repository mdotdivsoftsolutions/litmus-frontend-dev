import { Mail } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { ContactExpectations } from "./components/contact/ContactExpectations";
import { ContactReachSection } from "./components/contact/ContactReachSection";
import { ContactMapSection } from "./components/contact/ContactMapSection";
import { TrustedPartner } from "./components/consultation/TrustedPartner";

export default function ContactPage() {
  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        wide
        icon={Mail}
        eyebrow="Company · Contact"
        title={
          <>
            Talk to the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              Litmus team
            </span>
          </>
        }
        subtitle="Partnerships, press, procurement, and HQ visits — routed like support: clear expectations first, then direct channels and a secure enquiry form."
      />

      <ContactExpectations />
      <ContactReachSection />
      <ContactMapSection />
      <TrustedPartner />
    </div>
  );
}
