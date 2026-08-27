import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Building2, MapPin, Phone, Mail, Clock, Loader2, Save, 
  RotateCcw, CheckCircle2, ShieldAlert, Sun, Moon, CalendarDays, 
  Sparkles, Check, Edit3, X, Copy
} from "lucide-react";
import { toast } from "sonner";
import { settingsApi, ICourierAddress } from "@/lib/api/settings";
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

function IntakeSchedulePicker({
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

const defaultAddress: ICourierAddress = {
  facilityName: "Litmus Sample Central Intake & Diagnostics Hub",
  attention: "Sample Logistics & Ingestion Desk",
  street: "Tower B, Innovation Corridor, Old Mahabalipuram Road (OMR)",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600097",
  phone: "+91 98765 43210",
  email: "samples@litmustest.com",
  workingHours: "Mon – Sat · 08:00 AM – 08:00 PM IST",
};

export function CourierAddressSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ICourierAddress>(defaultAddress);
  const [isEditing, setIsEditing] = useState(false);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["adminPlatformSettings"],
    queryFn: settingsApi.getSettings,
  });

  useEffect(() => {
    if (settingsData?.data?.courierAddress) {
      setFormData({
        facilityName: settingsData.data.courierAddress.facilityName || defaultAddress.facilityName,
        attention: settingsData.data.courierAddress.attention || defaultAddress.attention,
        street: settingsData.data.courierAddress.street || defaultAddress.street,
        city: settingsData.data.courierAddress.city || defaultAddress.city,
        state: settingsData.data.courierAddress.state || defaultAddress.state,
        pincode: settingsData.data.courierAddress.pincode || defaultAddress.pincode,
        phone: settingsData.data.courierAddress.phone || defaultAddress.phone,
        email: settingsData.data.courierAddress.email || defaultAddress.email,
        workingHours: settingsData.data.courierAddress.workingHours || defaultAddress.workingHours,
      });
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: (courierAddress: ICourierAddress) => settingsApi.updateSettings({ courierAddress }),
    onSuccess: () => {
      toast.success("Litmus courier intake address updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update courier address");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.facilityName || !formData.street || !formData.city || !formData.pincode) {
      toast.error("Please fill in all mandatory address fields (Facility, Street, City, Pincode)");
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (settingsData?.data?.courierAddress) {
      setFormData({
        facilityName: settingsData.data.courierAddress.facilityName || defaultAddress.facilityName,
        attention: settingsData.data.courierAddress.attention || defaultAddress.attention,
        street: settingsData.data.courierAddress.street || defaultAddress.street,
        city: settingsData.data.courierAddress.city || defaultAddress.city,
        state: settingsData.data.courierAddress.state || defaultAddress.state,
        pincode: settingsData.data.courierAddress.pincode || defaultAddress.pincode,
        phone: settingsData.data.courierAddress.phone || defaultAddress.phone,
        email: settingsData.data.courierAddress.email || defaultAddress.email,
        workingHours: settingsData.data.courierAddress.workingHours || defaultAddress.workingHours,
      });
    } else {
      setFormData(defaultAddress);
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    setFormData(defaultAddress);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading courier settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Litmus Central Courier &amp; Dispatch Hub
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the common sample intake address displayed to customers during checkout and order tracking when shipping via courier.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isEditing ? (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 shadow-sm text-xs h-8 px-4"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Address
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="gap-1.5 text-xs h-8"
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={updateMutation.isPending}
                className="gap-1.5 text-xs h-8"
              >
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" /> Reset
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5 shadow-sm text-xs h-8 px-4"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" /> Save Address
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        {/* Form Inputs */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-4">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Facility & Location Details</CardTitle>
              <CardDescription>Official physical destination for receiving parcels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="facilityName" className="text-xs font-semibold">
                  Facility / Hub Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="facilityName"
                  name="facilityName"
                  value={formData.facilityName}
                  disabled={!isEditing}
                  onChange={handleChange}
                  placeholder="e.g. Litmus Sample Central Intake & Diagnostics Hub"
                  className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="attention" className="text-xs font-semibold">
                  Attention / Department Desk <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="attention"
                  name="attention"
                  value={formData.attention}
                  disabled={!isEditing}
                  onChange={handleChange}
                  placeholder="e.g. Sample Logistics & Ingestion Desk"
                  className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="street" className="text-xs font-semibold">
                  Street Address / Building <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  disabled={!isEditing}
                  onChange={handleChange}
                  placeholder="e.g. Tower B, Innovation Corridor, Old Mahabalipuram Road (OMR)"
                  className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="Chennai"
                    className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="Tamil Nadu"
                    className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pincode" className="text-xs font-semibold">
                    PIN Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="600097"
                    className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Helpline & Operating Hours</CardTitle>
              <CardDescription>Contact info printed on shipping instructions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Facility Helpline Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Logistics Desk Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="samples@litmustest.com"
                    className="disabled:opacity-85 disabled:cursor-not-allowed disabled:bg-slate-50/70"
                  />
                </div>
              </div>

              {/* Intake Hours & Days Picker (12-hour format) */}
              <div className="space-y-3 pt-1 border-t border-border/60">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Receiving / Intake Hours & Days
                  </Label>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[11px] font-mono font-bold px-2 py-0.5">
                    {formData.workingHours}
                  </Badge>
                </div>

                <IntakeSchedulePicker
                  value={formData.workingHours}
                  disabled={!isEditing}
                  onChange={(val) => setFormData((prev) => ({ ...prev, workingHours: val }))}
                />
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Live Customer Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-foreground">Live Customer Portal Preview</h4>
          </div>

          <div className="rounded-xl border-2 border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-slate-50 p-5 shadow-xs space-y-4">
            <div className="border-b border-emerald-100 pb-3">
              <div className="flex items-start gap-3">
                <div className="h-8.5 w-8.5 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-snug">
                    Litmus Sample Dispatch Address
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                      Courier Destination
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const fullText = [
                          formData.facilityName,
                          formData.attention ? `Attn: ${formData.attention}` : "",
                          formData.street,
                          `${formData.city}, ${formData.state} - ${formData.pincode}`,
                          formData.phone ? `Phone: ${formData.phone}` : "",
                          formData.email ? `Email: ${formData.email}` : "",
                        ].filter(Boolean).join("\n");
                        navigator.clipboard.writeText(fullText);
                        toast.success("Courier address copied to clipboard!");
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-2.5 py-1 rounded-md shadow-xs shrink-0 whitespace-nowrap transition-all cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Address</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-white/90 p-3 rounded-lg border border-emerald-100/80 shadow-2xs">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                {formData.facilityName || "Litmus Sample Central Intake Hub"}
              </p>
              <p className="text-slate-800 font-semibold pl-5 text-[11px]">
                Attn: {formData.attention || "Sample Logistics Desk"}
              </p>
              <p className="text-slate-600 leading-relaxed pl-5 text-[11px]">
                {formData.street || "Innovation Corridor, OMR"}
              </p>
              <p className="font-bold text-slate-900 pl-5 text-[11px]">
                {formData.city || "Chennai"}, {formData.state || "Tamil Nadu"} —{" "}
                <span className="text-emerald-700">{formData.pincode || "600097"}</span>
              </p>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 bg-white/90 p-3 rounded-lg border border-emerald-100/80">
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>Phone: <strong className="text-slate-900">{formData.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>Email: <strong className="text-slate-900">{formData.email}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>Intake: <span className="font-medium text-slate-800">{formData.workingHours}</span></span>
              </div>
            </div>

            <div className="rounded-lg bg-amber-50/80 border border-amber-200/70 p-2.5 text-[11px] text-amber-900">
              <p className="font-bold flex items-center gap-1 text-amber-950">
                <ShieldAlert className="h-3 w-3 text-amber-600 shrink-0" />
                Packaging Reminder:
              </p>
              <p className="mt-0.5 text-amber-800 leading-normal">
                Customers will be instructed to label their package with their Order ID and provide the AWB tracking code after shipment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
