import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, CalendarDays, Sparkles, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
  { short: "Sun", full: "Sunday" },
];

const PRESETS = [
  { label: "Mon – Sat", start: "Mon", end: "Sat", desc: "6 Days (Standard)" },
  { label: "Mon – Fri", start: "Mon", end: "Fri", desc: "Weekdays" },
  { label: "Mon – Sun", start: "Mon", end: "Sun", desc: "All 7 Days" },
];

const HOURS_12 = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45", "05", "10", "20", "25", "35", "40", "50", "55"];
const TIMEZONES = ["IST", "UTC", "GMT", "EST", "PST"];

interface ScheduleState {
  startDay: string;
  endDay: string;
  startHour: string;
  startMinute: string;
  startPeriod: "AM" | "PM";
  endHour: string;
  endMinute: string;
  endPeriod: "AM" | "PM";
  timezone: string;
}

function parseWorkingHoursString(raw: string): ScheduleState {
  const fallback: ScheduleState = {
    startDay: "Mon",
    endDay: "Sat",
    startHour: "08",
    startMinute: "00",
    startPeriod: "AM",
    endHour: "08",
    endMinute: "00",
    endPeriod: "PM",
    timezone: "IST",
  };

  if (!raw) return fallback;

  try {
    // Expected patterns:
    // "Mon – Sat · 08:00 AM – 08:00 PM IST"
    // "Mon - Fri · 09:30 AM - 06:00 PM"
    const cleaned = raw.replace(/\u2013|\u2014/g, "-");
    const [daysPart, timePart] = cleaned.split("·").map(s => s.trim());

    if (daysPart) {
      const [dStart, dEnd] = daysPart.split("-").map(s => s.trim());
      if (dStart) {
        const foundStart = DAYS_OF_WEEK.find(d => d.short.toLowerCase() === dStart.toLowerCase() || d.full.toLowerCase() === dStart.toLowerCase());
        if (foundStart) fallback.startDay = foundStart.short;
      }
      if (dEnd) {
        const foundEnd = DAYS_OF_WEEK.find(d => d.short.toLowerCase() === dEnd.toLowerCase() || d.full.toLowerCase() === dEnd.toLowerCase());
        if (foundEnd) fallback.endDay = foundEnd.short;
      }
    }

    if (timePart) {
      // e.g. "08:00 AM - 08:00 PM IST"
      // Regex for time range
      const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)(?:\s+([A-Za-z]+))?/i;
      const match = timePart.match(timeRegex);
      if (match) {
        fallback.startHour = match[1].padStart(2, "0");
        fallback.startMinute = match[2];
        fallback.startPeriod = match[3].toUpperCase() as "AM" | "PM";
        fallback.endHour = match[4].padStart(2, "0");
        fallback.endMinute = match[5];
        fallback.endPeriod = match[6].toUpperCase() as "AM" | "PM";
        if (match[7]) fallback.timezone = match[7].toUpperCase();
      }
    }
  } catch (err) {
    console.error("Failed to parse working hours:", err);
  }

  return fallback;
}

function assembleWorkingHours(state: ScheduleState): string {
  const days = state.startDay === state.endDay 
    ? state.startDay 
    : `${state.startDay} – ${state.endDay}`;
  const start = `${state.startHour}:${state.startMinute} ${state.startPeriod}`;
  const end = `${state.endHour}:${state.endMinute} ${state.endPeriod}`;
  const tz = state.timezone ? ` ${state.timezone}` : " IST";
  return `${days} · ${start} – ${end}${tz}`;
}

/** Days + 12-hour time-range picker that produces e.g. "Mon – Sat · 08:00 AM – 08:00 PM IST". */
export function IntakeSchedulePicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [schedule, setSchedule] = useState<ScheduleState>(() => parseWorkingHoursString(value));
  const [isManualEdit, setIsManualEdit] = useState(false);

  // Sync internal state when external value changes
  useEffect(() => {
    setSchedule(parseWorkingHoursString(value));
  }, [value]);

  const updateField = <K extends keyof ScheduleState>(field: K, val: ScheduleState[K]) => {
    if (disabled) return;
    const updated = { ...schedule, [field]: val };
    setSchedule(updated);
    onChange(assembleWorkingHours(updated));
  };

  const applyPreset = (start: string, end: string) => {
    if (disabled) return;
    const updated = { ...schedule, startDay: start, endDay: end };
    setSchedule(updated);
    onChange(assembleWorkingHours(updated));
  };

  const activePreset = useMemo(() => {
    return PRESETS.find(p => p.start === schedule.startDay && p.end === schedule.endDay)?.label || null;
  }, [schedule.startDay, schedule.endDay]);

  if (isManualEdit) {
    return (
      <div className="space-y-2 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-slate-700">Raw Working Hours Text</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsManualEdit(false)}
            className="h-7 text-xs text-primary font-bold hover:bg-primary/10 gap-1"
          >
            <Sparkles className="h-3 w-3" /> Back to 12h Picker
          </Button>
        </div>
        <Input
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Mon – Sat · 08:00 AM – 08:00 PM IST"
          className="bg-white font-mono text-xs font-semibold disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "p-4 bg-gradient-to-b from-slate-50/90 to-slate-100/60 rounded-xl border border-slate-200 space-y-4 transition-opacity",
      disabled && "opacity-85 pointer-events-none"
    )}>
      {/* 1. Operating Days Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary" /> Operating Days
          </span>
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={disabled}
                onClick={() => applyPreset(p.start, p.end)}
                className={cn(
                  "px-2 py-1 rounded text-[11px] font-semibold transition-all border",
                  activePreset === p.label
                    ? "bg-primary text-white border-primary shadow-2xs font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                  disabled && "cursor-not-allowed"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] font-bold text-slate-500 uppercase">From Day</Label>
            <Select 
              value={schedule.startDay} 
              disabled={disabled}
              onValueChange={(val) => updateField("startDay", val)}
            >
              <SelectTrigger className="h-9 bg-white text-xs font-semibold border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed">
                <SelectValue placeholder="Start Day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d.short} value={d.short} className="text-xs">
                    {d.full} <span className="text-muted-foreground text-[10px]">({d.short})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold text-slate-500 uppercase">To Day</Label>
            <Select 
              value={schedule.endDay} 
              disabled={disabled}
              onValueChange={(val) => updateField("endDay", val)}
            >
              <SelectTrigger className="h-9 bg-white text-xs font-semibold border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed">
                <SelectValue placeholder="End Day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d.short} value={d.short} className="text-xs">
                    {d.full} <span className="text-muted-foreground text-[10px]">({d.short})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 2. 12-Hour Time Pickers Section */}
      <div className="grid sm:grid-cols-2 gap-4 pt-1 border-t border-slate-200/80">
        {/* Opening / Start Time */}
        <div className="space-y-1.5 p-2.5 bg-white/80 rounded-lg border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1">
            <Label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Opening Time
            </Label>
            <span className="text-[11px] font-mono font-bold text-amber-950 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
              {schedule.startHour}:{schedule.startMinute} {schedule.startPeriod}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 items-center pt-1">
            {/* Hour */}
            <div className="col-span-4">
              <Select
                value={schedule.startHour}
                disabled={disabled}
                onValueChange={(val) => updateField("startHour", val)}
              >
                <SelectTrigger className="h-8 bg-white font-mono text-xs font-bold border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {HOURS_12.map((h) => (
                    <SelectItem key={h} value={h} className="font-mono text-xs">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 text-center font-bold text-slate-400">:</div>

            {/* Minute */}
            <div className="col-span-4">
              <Select
                value={schedule.startMinute}
                disabled={disabled}
                onValueChange={(val) => updateField("startMinute", val)}
              >
                <SelectTrigger className="h-8 bg-white font-mono text-xs font-bold border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={m} className="font-mono text-xs">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AM/PM Switch */}
            <div className="col-span-3 flex rounded-md border border-slate-200 p-0.5 bg-slate-100">
              <button
                type="button"
                disabled={disabled}
                onClick={() => updateField("startPeriod", "AM")}
                className={cn(
                  "flex-1 py-1 rounded text-[10px] font-bold transition-all",
                  schedule.startPeriod === "AM"
                    ? "bg-amber-500 text-white shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900",
                  disabled && "cursor-not-allowed"
                )}
              >
                AM
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => updateField("startPeriod", "PM")}
                className={cn(
                  "flex-1 py-1 rounded text-[10px] font-bold transition-all",
                  schedule.startPeriod === "PM"
                    ? "bg-slate-800 text-white shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900",
                  disabled && "cursor-not-allowed"
                )}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Closing / End Time */}
        <div className="space-y-1.5 p-2.5 bg-white/80 rounded-lg border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-1">
            <Label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <Moon className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Closing Time
            </Label>
            <span className="text-[11px] font-mono font-bold text-indigo-950 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
              {schedule.endHour}:{schedule.endMinute} {schedule.endPeriod}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-1.5 items-center pt-1">
            {/* Hour */}
            <div className="col-span-4">
              <Select
                value={schedule.endHour}
                disabled={disabled}
                onValueChange={(val) => updateField("endHour", val)}
              >
                <SelectTrigger className="h-8 bg-white font-mono text-xs font-bold border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {HOURS_12.map((h) => (
                    <SelectItem key={h} value={h} className="font-mono text-xs">
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 text-center font-bold text-slate-400">:</div>

            {/* Minute */}
            <div className="col-span-4">
              <Select
                value={schedule.endMinute}
                disabled={disabled}
                onValueChange={(val) => updateField("endMinute", val)}
              >
                <SelectTrigger className="h-8 bg-white font-mono text-xs font-bold border-slate-200 disabled:bg-slate-50 disabled:text-slate-700 disabled:cursor-not-allowed">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {MINUTES.map((m) => (
                    <SelectItem key={m} value={m} className="font-mono text-xs">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AM/PM Switch */}
            <div className="col-span-3 flex rounded-md border border-slate-200 p-0.5 bg-slate-100">
              <button
                type="button"
                disabled={disabled}
                onClick={() => updateField("endPeriod", "AM")}
                className={cn(
                  "flex-1 py-1 rounded text-[10px] font-bold transition-all",
                  schedule.endPeriod === "AM"
                    ? "bg-amber-500 text-white shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900",
                  disabled && "cursor-not-allowed"
                )}
              >
                AM
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => updateField("endPeriod", "PM")}
                className={cn(
                  "flex-1 py-1 rounded text-[10px] font-bold transition-all",
                  schedule.endPeriod === "PM"
                    ? "bg-indigo-600 text-white shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900",
                  disabled && "cursor-not-allowed"
                )}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Timezone & Manual Toggle */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Timezone:</span>
          <div className="flex gap-1">
            {TIMEZONES.map((tz) => (
              <button
                key={tz}
                type="button"
                disabled={disabled}
                onClick={() => updateField("timezone", tz)}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-semibold border transition-all",
                  schedule.timezone === tz
                    ? "bg-slate-800 text-white border-slate-800 font-bold"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                  disabled && "cursor-not-allowed"
                )}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>

        {!disabled && (
          <button
            type="button"
            onClick={() => setIsManualEdit(true)}
            className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 hover:underline"
          >
            <Edit3 className="h-3 w-3" /> Custom text
          </button>
        )}
      </div>
    </div>
  );
}
