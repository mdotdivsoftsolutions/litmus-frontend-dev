import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCareerBySlug } from "@/lib/company-careers-data";

export default function CareerDetailPage() {
  const { slug } = useParams();
  const opening = slug ? getCareerBySlug(slug) : undefined;

  if (!opening) {
    return <Navigate to="/careers" replace />;
  }

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-16">
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[55%] h-full bg-slate-50 skew-x-[-12deg] translate-x-1/4 pointer-events-none border-l border-slate-100/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-12 md:pt-12 md:pb-14">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#D32F2F] transition-colors mb-8 mr-2 md:mr-5"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All openings
          </Link>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#D32F2F] text-[10px] font-semibold uppercase tracking-[0.35em] mb-5">
            <Briefcase className="h-4 w-4 shrink-0" aria-hidden />
            {opening.category}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-[2rem] font-semibold text-slate-800 tracking-tight leading-tight mb-4">
            {opening.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
              {opening.type}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
              {opening.location}
            </span>
            <span className="text-slate-400">Posted {opening.posted}</span>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 pt-10 md:pt-12 space-y-10">
        <p className="text-[15px] md:text-lg text-slate-600 leading-relaxed">{opening.summary}</p>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">What you will do</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] md:text-base text-slate-600 leading-relaxed marker:text-slate-300">
            {opening.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Requirements</h2>
          <ul className="list-disc pl-5 space-y-2 text-[15px] md:text-base text-slate-600 leading-relaxed marker:text-slate-300">
            {opening.requirements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {opening.niceToHave && opening.niceToHave.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Nice to have</h2>
            <ul className="list-disc pl-5 space-y-2 text-[15px] md:text-base text-slate-600 leading-relaxed marker:text-slate-300">
              {opening.niceToHave.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Ready to apply?</p>
            <p className="text-sm text-slate-500 mt-1">Demo CTA — wire to ATS or careers inbox.</p>
          </div>
          <Button
            asChild
            className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm shrink-0"
          >
            <a href={`mailto:careers@litmus.ai?subject=${encodeURIComponent(`Application: ${opening.title}`)}`}>Apply by email</a>
          </Button>
        </div>
      </article>
    </div>
  );
}
