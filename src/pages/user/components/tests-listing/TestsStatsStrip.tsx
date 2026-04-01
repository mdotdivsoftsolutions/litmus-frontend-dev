import { CheckCircle2, Clock, Shield, Star } from "lucide-react";

export const TestsStatsStrip = () => {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto text-xs sm:text-sm text-muted-foreground">
        <span className="shrink-0 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-litmus-teal" />NABL Accredited</span>
        <span className="shrink-0 text-border">|</span>
        <span className="shrink-0 flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />3–5 Day Reports</span>
        <span className="shrink-0 text-border">|</span>
        <span className="shrink-0 flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" />FSSAI Certified</span>
        <span className="shrink-0 text-border">|</span>
        <span className="shrink-0 flex items-center gap-1.5"><Star className="h-4 w-4 text-flame-amber" />4.8 Rating</span>
      </div>
    </div>
  );
};
