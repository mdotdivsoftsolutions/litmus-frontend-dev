import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, User } from "lucide-react";
import { getBlogBySlug, getRelatedPosts, type BlogContentBlock } from "@/lib/company-blogs-data";

const FIGURE_FALLBACK =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1400";

function BlogBlocks({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="flex flex-col gap-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="text-[15px] md:text-[17px] text-slate-600 leading-[1.75]">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight pb-3 border-b border-slate-200 scroll-mt-28"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight">
                {block.text}
              </h3>
            );
          case "figure":
            return (
              <figure key={i} className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.04]">
                  <img
                    src={block.src}
                    alt={block.alt}
                    className="w-full aspect-[16/10] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FIGURE_FALLBACK;
                    }}
                  />
                </div>
                {block.caption ? (
                  <figcaption className="text-sm text-slate-500 leading-relaxed max-w-2xl">{block.caption}</figcaption>
                ) : null}
              </figure>
            );
          default: {
            const _never: never = block;
            return _never;
          }
        }
      })}
    </div>
  );
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = slug ? getBlogBySlug(slug) : undefined;
  const related = slug ? getRelatedPosts(slug, 5) : [];

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-16 md:pb-24">
      {/* Banner */}
      <div className="relative h-[38vh] min-h-[220px] max-h-[420px] overflow-hidden bg-slate-900">
        <img
          src={post.coverImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10 pt-24">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All articles
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#feba50] mb-3">{post.category}</p>
          <h1 className="text-2xl sm:text-3xl md:text-[2.35rem] font-semibold text-white tracking-tight leading-tight max-w-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden />
              {post.author}
            </span>
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {post.readMinutes} min read
            </span>
          </div>
        </div>
      </div>

      {/* Body + sidebar */}
      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-14 pb-4">
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          <article className="lg:col-span-7 xl:col-span-8">
            <BlogBlocks blocks={post.blocks} />
          </article>

          <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 lg:self-start space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400 mb-4">Suggested reads</p>
              <ul className="space-y-5">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/blogs/${item.slug}`}
                      className="group flex gap-4 rounded-xl border border-transparent p-1 -m-1 hover:border-slate-100 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={item.coverImage}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1 line-clamp-1">
                          {item.category}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                          {item.title}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium text-slate-400">
                          <Clock className="h-3 w-3" aria-hidden />
                          {item.readMinutes} min
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/blogs"
              className="group flex items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-white/60 px-5 py-4 text-sm font-semibold text-slate-700 hover:border-[#D32F2F]/30 hover:text-[#D32F2F] transition-colors"
            >
              Browse all articles
              <ArrowRight className="h-4 w-4 shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
