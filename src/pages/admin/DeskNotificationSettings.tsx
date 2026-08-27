import React from "react";
import { useAdminSocket } from "@/context/SocketContext";
import { Volume2, VolumeX, Bell, BellOff, ShieldAlert, CheckCircle2, Headphones, Radio } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DeskNotificationSettings() {
  const {
    presenceStatus,
    setPresenceStatus,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    isAudioUnlocked,
    unlockAudioContext,
  } = useAdminSocket();

  return (
    <div className="space-y-6 w-full font-sans">
      <div>
        <h3 className="text-sm font-bold text-slate-900">Live Support & Desk Notifications</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure real-time incoming chat chimes, desktop alerts, and default agent availability.
        </p>
      </div>

      <div className="space-y-4">
        {/* Availability & Presence Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-600" />
                <span>My Live Desk Presence</span>
              </Label>
              <p className="text-[11px] text-slate-500">
                Setting yourself to Offline stops incoming calls and removes you from the live routing queue.
              </p>
            </div>
            <Badge
              className={cn(
                "text-[10px] font-bold uppercase",
                presenceStatus === "ONLINE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : presenceStatus === "BUSY"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              )}
            >
              {presenceStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPresenceStatus("ONLINE")}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex flex-col gap-1",
                presenceStatus === "ONLINE"
                  ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400"
                  : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Online</span>
              </div>
              <span className="text-[10px] text-slate-500">Accepting live chats</span>
            </button>

            <button
              type="button"
              onClick={() => setPresenceStatus("BUSY")}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex flex-col gap-1",
                presenceStatus === "BUSY"
                  ? "bg-amber-50/70 border-amber-300 ring-1 ring-amber-400"
                  : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Busy</span>
              </div>
              <span className="text-[10px] text-slate-500">In consultation</span>
            </button>

            <button
              type="button"
              onClick={() => setPresenceStatus("OFFLINE")}
              className={cn(
                "p-3 rounded-xl border text-left transition-all flex flex-col gap-1",
                presenceStatus === "OFFLINE"
                  ? "bg-slate-100 border-slate-400 ring-1 ring-slate-400"
                  : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                <div className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Offline</span>
              </div>
              <span className="text-[10px] text-slate-500">No incoming calls</span>
            </button>
          </div>
        </div>

        {/* Audio Alerts Setting */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-0.5 pr-4">
            <Label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              {audioAlertsEnabled ? <Volume2 className="h-4 w-4 text-slate-700" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
              <span>Incoming Call Chime & Audio Alerts</span>
            </Label>
            <p className="text-[11px] text-slate-500">
              Plays an ambient harmonic chime when a customer or patient requests clinical support.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={unlockAudioContext}
              className="h-8 text-xs font-semibold rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Test Chime
            </Button>
            <Switch
              checked={audioAlertsEnabled}
              onCheckedChange={setAudioAlertsEnabled}
            />
          </div>
        </div>

        {/* Desktop Toast Notification Setting */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-0.5 pr-4">
            <Label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              {notificationsEnabled ? <Bell className="h-4 w-4 text-slate-700" /> : <BellOff className="h-4 w-4 text-slate-400" />}
              <span>In-App Popups & Live Request Toasters</span>
            </Label>
            <p className="text-[11px] text-slate-500">
              Displays the actionable side toaster with one-click Accept and Decline buttons across the admin panel.
            </p>
          </div>
          <div className="shrink-0">
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
