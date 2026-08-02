import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: string;
  badge?: string;
  action?: {
    label: string;
    href: string;
  };
  rightContent?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  rightContent,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end", className)}>
      <div className="flex-1">
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D32F2F]">
            {badge}
          </div>
        )}
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-800 lg:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-base font-medium text-slate-500 max-w-xl leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {action && (
          <Link
            to={action.href}
            className="group flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-red-100 bg-red-50 px-6 py-3 text-xs font-semibold text-[#D32F2F] shadow-sm transition-all hover:bg-white hover:shadow-md"
          >
            {action.label}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
        {rightContent}
      </div>
    </div>
  );
}
