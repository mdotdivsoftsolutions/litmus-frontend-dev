import { cn } from "@/lib/utils";

const LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

interface AlphabetFilterBarProps {
  /** Selected letter (A-Z or "#"), or null for all. */
  value: string | null;
  onChange: (letter: string | null) => void;
  /** Item counts per starting letter; letters with 0 are disabled. */
  counts?: Record<string, number>;
}

/** A–Z quick filter: shows only items whose name starts with the chosen letter. */
export function AlphabetFilterBar({ value, onChange, counts }: AlphabetFilterBarProps) {
  const total = counts ? Object.values(counts).reduce((sum, n) => sum + n, 0) : undefined;

  const chip = (key: string | null, label: string, count?: number) => {
    const active = value === key;
    const empty = key !== null && counts !== undefined && !count;
    return (
      <button
        key={label}
        type="button"
        disabled={empty && !active}
        onClick={() => onChange(active ? null : key)}
        title={count !== undefined ? `${count} item(s)` : undefined}
        aria-pressed={active}
        className={cn(
          "h-7 min-w-[28px] px-1.5 rounded-md text-[11px] font-bold border transition-colors",
          active
            ? "bg-primary text-white border-primary shadow-xs"
            : "bg-white text-slate-700 border-slate-200 hover:border-primary/50 hover:text-primary",
          empty && !active && "opacity-35 cursor-not-allowed hover:border-slate-200 hover:text-slate-700"
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Filter by first letter">
      {chip(null, total !== undefined ? `All (${total})` : "All", total)}
      {LETTERS.map((letter) => chip(letter, letter, counts?.[letter]))}
    </div>
  );
}
