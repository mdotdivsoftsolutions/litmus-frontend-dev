import { ExternalLink, Navigation } from "lucide-react";

const HQ_LAT = 12.938;
const HQ_LNG = 80.221;
/** Share-style embed centred on Chennai / OMR corridor — replace query with your exact Maps embed when ready. */
const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${HQ_LAT},${HQ_LNG}&z=14&output=embed`;

export function ContactMapSection() {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${HQ_LAT},${HQ_LNG}`;

  return (
    <section className="bg-slate-50 border-t border-slate-100 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 md:mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D32F2F] mb-3">Visit</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight">
            Find us on the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">map</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-500 font-medium max-w-2xl leading-relaxed">
            HQ visits are by appointment so our lab liaison team can greet you. Use directions below or sync with your calendar invite.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-8 min-h-[280px] md:min-h-[380px] rounded-[1.5rem] overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)] bg-slate-200 ring-1 ring-slate-900/5">
            <iframe
              title="Litmus Chennai HQ — map"
              src={MAP_EMBED_SRC}
              className="w-full h-full min-h-[280px] md:min-h-[380px] border-0 grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm flex-1">
              <h3 className="text-lg font-semibold text-slate-800 tracking-tight mb-4">Chennai headquarters</h3>
              <address className="text-sm text-slate-600 leading-relaxed not-italic mb-6">
                Tower B, Innovation Corridor
                <br />
                Old Mahabalipuram Road (OMR)
                <br />
                Tamil Nadu — 600097
                <br />
                <span className="text-slate-400">(demo pin near Chennai tech corridor)</span>
              </address>
              <div className="space-y-3 text-sm text-slate-500 mb-8">
                <p>
                  <span className="font-semibold text-slate-700">Reception hours</span>
                  <br />
                  Mon–Sat · 08:00–20:00 IST
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Parking</span>
                  <br />
                  Basement B1–B2 · visitor passes at lobby
                </p>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                <Navigation className="h-4 w-4" aria-hidden />
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
