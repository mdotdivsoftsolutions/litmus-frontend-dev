import { Star } from "lucide-react";

export const TestsReviewsGrid = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="bg-card rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center text-center space-y-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-flame-amber text-flame-amber" />)}
        </div>
        <span className="text-4xl font-bold text-foreground">4.8</span>
        <p className="text-sm text-muted-foreground font-medium">Google Rating</p>
        <p className="text-xs text-muted-foreground">Based on 500+ reviews</p>
      </div>
      <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.07)] space-y-3">
        <h3 className="font-bold text-foreground">What businesses say</h3>
        {[
          { name: "Suresh M.", text: "Fast and reliable. FSSAI reports came within 4 days.", rating: 5 },
          { name: "Anita J.", text: "Excellent lab network. Very professional service.", rating: 5 },
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-t border-border first:border-0 first:pt-0">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {r.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground text-sm">{r.name}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-flame-amber text-flame-amber" />)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
