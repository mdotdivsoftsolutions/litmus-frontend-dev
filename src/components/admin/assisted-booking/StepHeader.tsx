import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "./useAssistedBooking";

export function StepHeader({ step, onStepClick }: { step: number; onStepClick: (s: number) => void }) {
  return (
    <ol className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onStepClick(i)}
            className={cn("flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold", i === step ? "text-primary" : "text-slate-500 hover:text-slate-700")}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold border",
                i < step && "bg-primary border-primary text-white",
                i === step && "border-primary text-primary bg-primary/10",
                i > step && "border-slate-300 text-slate-500"
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
          {i < STEPS.length - 1 && <span className="w-4 sm:w-6 h-px bg-slate-300" />}
        </li>
      ))}
    </ol>
  );
}
