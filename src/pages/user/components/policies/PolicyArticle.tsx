import type { ReactNode } from "react";

interface PolicyArticleProps {
  lastUpdated: string;
  children: ReactNode;
}

export function PolicyArticle({ lastUpdated, children }: PolicyArticleProps) {
  return (
    <article className="bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Last updated · {lastUpdated}
        </p>
        <div className="space-y-8 text-[15px] md:text-base text-slate-600 leading-relaxed [&_strong]:font-semibold [&_strong]:text-slate-800 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-800 [&_h2]:tracking-tight [&_h2]:pt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:marker:text-slate-300">
          {children}
        </div>
      </div>
    </article>
  );
}
