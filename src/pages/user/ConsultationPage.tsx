import { ConsultationHero } from "./components/consultation/ConsultationHero";
import { ConsultationServices } from "./components/consultation/ConsultationServices";
import { PromoBanner } from "./components/home/PromoBanner";

export default function ConsultationPage() {
  return (
    <div className="animate-fade-in min-h-screen bg-slate-50">
      <ConsultationHero />
      <ConsultationServices />
      <PromoBanner className="pb-20" />
    </div>
  );
}
