import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";
import { PolicyHero } from "./components/policies/PolicyHero";
import { BLOG_CATEGORY_ORDER, blogsGrouped, type BlogPost } from "@/lib/company-blogs-data";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blogs/${post.slug}`}
      className="group flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-[#D32F2F]/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className="sm:w-48 md:w-56 shrink-0 aspect-[16/10] sm:aspect-auto sm:min-h-[140px] relative overflow-hidden">
        <img
          src={post.coverImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800";
          }}
        />
      </div>
      <div className="flex-1 p-6 pt-5 sm:py-6 flex flex-col justify-center min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">{post.category}</p>
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight group-hover:text-[#D32F2F] transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" aria-hidden />
            {post.author}
          </span>
          <span>{post.date}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {post.readMinutes} min read
          </span>
        </div>
        <span className="inline-flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-widest text-[#D32F2F]">
          Read article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogsPage() {
  const grouped = blogsGrouped();

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen">
      <PolicyHero
        icon={BookOpen}
        eyebrow="Insights · Blog"
        title={
          <>
            Notes on compliance,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">
              product, and lab science
            </span>
          </>
        }
        subtitle="Long-form perspectives from Litmus operators and advisors. Demo articles — replace with your editorial pipeline."
      />

      <section className="bg-white border-t border-slate-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {BLOG_CATEGORY_ORDER.map((category) => {
            const list = grouped[category];
            if (list.length === 0) return null;
            return (
              <div key={category}>
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mb-6">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {list.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
