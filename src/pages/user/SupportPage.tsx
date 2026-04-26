import { SupportHero } from "./components/support/SupportHero";
import { SupportContact } from "./components/support/SupportContact";
import { HowToBookProcess } from "./components/home/HowToBookProcess";
import { TrustedPartner } from "./components/consultation/TrustedPartner";

export default function SupportPage() {
   return (
      <div className="animate-fade-in bg-slate-50 min-h-screen">
         <SupportHero />
         <HowToBookProcess className="bg-white" />
         <SupportContact />
         <TrustedPartner/>
      </div>
   );
}
