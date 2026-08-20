import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  PackageCheck,
  FlaskConical,
  Truck,
  FileCheck2,
  ShoppingCart,
  Headphones,
  BellRing,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { settingsApi, INotificationWorkflows } from "@/lib/api/settings";
import { cn } from "@/lib/utils";

interface WorkflowItemConfig {
  key: keyof INotificationWorkflows;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badgeBg: string;
  emailDefault: boolean;
  whatsappDefault: boolean;
  sampleWhatsAppPreview: string;
  sampleEmailSubject: string;
}

const WORKFLOW_CONFIGS: WorkflowItemConfig[] = [
  {
    key: "supportRequestAdminAlert",
    title: "Support & Lead Alert (Admin WhatsApp)",
    category: "Admin Immediate Alert",
    description: "Sends an immediate WhatsApp alert directly to the admin whenever a customer requests clinical support or submits a contact inquiry.",

    icon: Headphones,
    color: "text-rose-600",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "🚨 New Customer Support & Callback Request Received",
    sampleWhatsAppPreview: `🚨 *LITMUS - NEW SUPPORT LEAD / CALLBACK*
━━━━━━━━━━━━━━━━━━━━━
👤 *Name:* John Doe
📞 *Phone:* +91 98765 43210
✉️ *Email:* john@example.com
🏢 *Company:* Fresh Organics Pvt Ltd
🔬 *Service:* Microbial Food Safety Suite
📝 *Message:* Need urgent turnaround on canned food batch testing.
🌐 *Source:* Web Support Portal
⏰ *Time:* Today, 12:30 PM
━━━━━━━━━━━━━━━━━━━━━
👉 _Please follow up within SLA guidelines._`,
  },
  {
    key: "orderConfirmation",
    title: "Order Confirmation",
    category: "Customer Lifecycle",
    description: "Notifies customer immediately after booking and payment confirmation with booking ID, tests selected, and collection instructions.",
    icon: PackageCheck,
    color: "text-emerald-600",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "Your Test Booking Has Been Confirmed - Litmus",
    sampleWhatsAppPreview: `🧪 *LITMUS FOOD ANALYTICS - BOOKING CONFIRMED*
━━━━━━━━━━━━━━━━━━━━━
Dear *John Doe*,
Thank you for choosing Litmus. Your diagnostic test booking has been confirmed.

🔖 *Booking ID:* #BKG-98421
📋 *Tests Selected:* Nutritional Profile & Heavy Metals
💰 *Total Amount:* ₹4,850
📅 *Date:* 19 Aug 2026

Our logistics team is coordinating your sample collection. Track your progress anytime on your Litmus dashboard.
━━━━━━━━━━━━━━━━━━━━━
_Litmus Quality Assurance Team_`,
  },
  {
    key: "orderProcessing",
    title: "Order Processing & Lab Testing",
    category: "Sample Journey",
    description: "Sent when the sample physically arrives at the accredited lab and is registered in the LIMS testing queue.",
    icon: FlaskConical,
    color: "text-amber-600",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "Sample Received & Under Testing Successfully",
    sampleWhatsAppPreview: `🔬 *LITMUS - SAMPLE UNDER TESTING*
━━━━━━━━━━━━━━━━━━━━━
Hello *John Doe*,
Your sample for Booking *#BKG-98421* has been received at our accredited laboratory and registered in the LIMS.

📊 *Status:* Chemical & Microbiological Analysis In Progress
🏢 *Lab Facility:* Litmus Central Analytical Lab

Our certified analysts are conducting the diagnostic procedures. You will be notified the moment your report is ready.
━━━━━━━━━━━━━━━━━━━━━
_Litmus Laboratory Operations_`,
  },
  {
    key: "shippingUpdates",
    title: "Shipping & Sample Collection Updates",
    category: "Logistics",
    description: "Dispatched when a sample collection executive is assigned or when courier tracking AWB details are updated.",
    icon: Truck,
    color: "text-blue-600",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "Sample Collection / Dispatch In Transit",
    sampleWhatsAppPreview: `🚚 *LITMUS - SAMPLE DISPATCH UPDATE*
━━━━━━━━━━━━━━━━━━━━━
Hello *John Doe*,
Your sample parcel for Booking *#BKG-98421* is currently in transit to our testing center.

📦 *Courier Partner:* BlueDart Express
🔖 *Tracking AWB:* BLUEDART-8823910

We will notify you immediately once the laboratory confirms physical receipt and integrity verification.
━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    key: "deliveryUpdates",
    title: "Delivery & Report Ready Updates",
    category: "Fulfillment",
    description: "Sent the moment a lab report is verified by admin, complete with a direct secure link to the customer dashboard.",
    icon: FileCheck2,
    color: "text-teal-600",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "Your Official Laboratory Report Is Ready",
    sampleWhatsAppPreview: `📑 *LITMUS - OFFICIAL TEST REPORT PUBLISHED*
━━━━━━━━━━━━━━━━━━━━━
Great news *John Doe*!
The clinical testing and quality certification for Booking *#BKG-98421* has been completed.

Your verified laboratory report is now available for viewing and digital download.

🔗 *View Report:* https://app.litmus.ai/dashboard/reports
━━━━━━━━━━━━━━━━━━━━━
Thank you for trusting Litmus Food Analytics for your testing requirements.`,
  },
  {
    key: "abandonedCart",
    title: "Abandoned Cart Reminders",
    category: "Conversion Recovery",
    description: "Automated recovery notification sent to customers who left diagnostic packages in their cart without checking out.",
    icon: ShoppingCart,
    color: "text-purple-600",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "Complete Your Lab Test Booking - Items Waiting in Cart",
    sampleWhatsAppPreview: `🛒 *LITMUS - COMPLETE YOUR TEST BOOKING*
━━━━━━━━━━━━━━━━━━━━━
Hello *John Doe*,
We noticed you have *2 diagnostic test(s)* waiting in your cart.

💰 *Cart Total:* ₹3,200

Complete your order today to secure your testing slot and priority sample processing.
👉 *Proceed to Checkout:* https://app.litmus.ai/cart
━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    key: "customerNotifications",
    title: "Important Customer Notifications",
    category: "General Communications",
    description: "General compliance bulletins, regulatory updates, and platform announcements dispatched to active users.",
    icon: BellRing,
    color: "text-slate-700",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    emailDefault: true,
    whatsappDefault: true,
    sampleEmailSubject: "Important Diagnostic & Regulatory Update - Litmus",
    sampleWhatsAppPreview: `📢 *LITMUS FOOD ANALYTICS - PLATFORM NOTICE*
━━━━━━━━━━━━━━━━━━━━━
Dear Valued Partner,
Please note our updated FSSAI regulatory compliance matrix and holiday laboratory operating hours.

Visit your customer portal for full guidance.
━━━━━━━━━━━━━━━━━━━━━`,
  },
];

export function NotificationWorkflowsSettings() {
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["adminPlatformSettings"],
    queryFn: settingsApi.getSettings,
  });

  const [adminPhone, setAdminPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [workflows, setWorkflows] = useState<Partial<INotificationWorkflows>>({});
  const [abandonedCartDelay, setAbandonedCartDelay] = useState<number>(2);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);
  const [testPhoneInput, setTestPhoneInput] = useState("");

  const isConfiguredInEnv = settingsData?.meta?.isWhatsAppConfigured ?? false;

  useEffect(() => {
    if (settingsData?.data) {
      const data = settingsData.data;
      setAdminPhone(data.adminWhatsAppNumber || "+919876543210");
      setAdminEmail(data.adminEmailRecipient || "admin@litmus.ai");
      setTestPhoneInput(data.adminWhatsAppNumber || "+919876543210");
      if (data.notificationWorkflows) {
        setWorkflows(data.notificationWorkflows);
        if (data.notificationWorkflows.abandonedCart?.delayHours) {
          setAbandonedCartDelay(data.notificationWorkflows.abandonedCart.delayHours);
        }
      }
    }
  }, [settingsData]);

  // Mutation to save settings
  const updateSettingsMutation = useMutation({
    mutationFn: (payload: any) => settingsApi.updateSettings(payload),
    onSuccess: () => {
      toast.success("Notification workflows & WhatsApp settings saved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminPlatformSettings"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update notification settings");
    },
  });

  // Mutation to send a test WhatsApp alert
  const testWhatsAppMutation = useMutation({
    mutationFn: (phone: string) => settingsApi.testWhatsApp({ phoneNumber: phone }),
    onSuccess: (res: any) => {
      toast.success(res.message || "Test WhatsApp notification sent successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send test WhatsApp message");
    },
  });

  // Mutation to manually trigger abandoned cart scan
  const triggerCartScanMutation = useMutation({
    mutationFn: () => settingsApi.triggerAbandonedCartScan(),
    onSuccess: (res: any) => {
      toast.success(res.message || "Abandoned cart scan executed successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to trigger abandoned cart scan");
    },
  });

  const handleToggleChannel = (workflowKey: keyof INotificationWorkflows, channel: "email" | "whatsapp", value: boolean) => {
    setWorkflows((prev) => {
      const current = prev[workflowKey] || { email: true, whatsapp: true };
      return {
        ...prev,
        [workflowKey]: {
          ...current,
          [channel]: value,
        },
      };
    });
  };

  const handleSaveAll = () => {
    const updatedWorkflows = { ...workflows };
    if (updatedWorkflows.abandonedCart) {
      updatedWorkflows.abandonedCart.delayHours = abandonedCartDelay;
    }

    updateSettingsMutation.mutate({
      adminWhatsAppNumber: adminPhone.trim(),
      adminEmailRecipient: adminEmail.trim(),
      notificationWorkflows: updatedWorkflows as INotificationWorkflows,
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-slate-500">Loading Notification Workflows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Top Banner / Gateway Status */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#25D366]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-semibold tracking-wide uppercase text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              Meta WhatsApp Business Cloud API &amp; Email Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Automated Notification Workflows
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Configure real-time automated communications for customer lifecycle milestones, order fulfillment stages, abandoned cart recoveries, and instant WhatsApp support lead alerts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">WhatsApp Gateway Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    isConfiguredInEnv ? "bg-[#25D366] animate-pulse" : "bg-amber-400"
                  )}
                />
                <span className="text-xs font-bold text-white">
                  {isConfiguredInEnv ? "Meta Cloud API Connected" : "Dev / Mock Mode Active"}
                </span>
              </div>
            </div>
            {!isConfiguredInEnv && (
              <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-300 border-amber-500/30">
                Mock Logs in Dev
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: ADMIN SUPPORT NOTIFICATION WHATSAPP */}
      <Card className="border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-rose-50/70 to-orange-50/50 p-5 border-b border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Admin Support WhatsApp Notification</h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Whenever a user submits a support or consultation request from the frontend, the admin will immediately receive this WhatsApp alert.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Phone Configuration */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-phone-input" className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-emerald-600" />
                  Admin WhatsApp Recipient Number
                </Label>
                <p className="text-[11px] text-slate-500">
                  Include country code (e.g., <span className="font-mono text-slate-700 font-semibold">+91 9876543210</span> or <span className="font-mono text-slate-700 font-semibold">919876543210</span>).
                </p>
                <div className="flex gap-2">
                  <Input
                    id="admin-phone-input"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="font-mono text-sm h-10 border-slate-300"
                  />
                  <Button
                    onClick={handleSaveAll}
                    disabled={updateSettingsMutation.isPending || !adminPhone.trim()}
                    className="h-10 px-4 font-semibold text-xs bg-slate-900 hover:bg-slate-800 shrink-0"
                  >
                    {updateSettingsMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Phone"}
                  </Button>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Instant Trigger Points
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>User Frontend Support Page ("Request a Callback" form)</li>
                  <li>User Frontend Contact Page ("Send a Message" corporate enquiry)</li>
                  <li>Live Chat Consultation / Expert Advice Bookings</li>
                </ul>
              </div>
            </div>

            {/* Test WhatsApp Alert Trigger */}
            <div className="space-y-4 p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Send className="h-3.5 w-3.5 text-emerald-600" />
                  Test Live WhatsApp Notification Dispatch
                </h4>
                <p className="text-[11px] text-emerald-800/80">
                  Send a live test message to verify your Meta Cloud API connection and phone number formatting.
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  value={testPhoneInput}
                  onChange={(e) => setTestPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="font-mono text-xs h-9 bg-white border-emerald-200"
                />
                <Button
                  onClick={() => testWhatsAppMutation.mutate(testPhoneInput || adminPhone)}
                  disabled={testWhatsAppMutation.isPending || (!testPhoneInput && !adminPhone)}
                  size="sm"
                  className="h-9 text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xs shrink-0"
                >
                  {testWhatsAppMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  )}
                  Send Alert
                </Button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  Testing outside 24h window? Use approved template:
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => settingsApi.testWhatsApp({ phoneNumber: testPhoneInput || adminPhone, useTemplate: true }).then((res) => toast.success(res.message)).catch((err) => toast.error(err.response?.data?.message || "Failed to send template"))}
                  className="h-7 text-[10px] font-bold border-emerald-300 text-emerald-800 hover:bg-emerald-100/60"
                >
                  Send "hello_world" Template
                </Button>
              </div>

              <p className="text-[10px] text-slate-500">
                Note: In development or test mode without live Meta tokens, notifications will be safely simulated and printed to backend logs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: NOTIFICATION WORKFLOWS MATRIX */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Email &amp; WhatsApp Notification Workflows</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle channels and configure automated messaging triggers for all customer and operational milestones.
            </p>
          </div>


          <Button
            onClick={handleSaveAll}
            disabled={updateSettingsMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-xs h-9 px-5 shadow-xs shrink-0"
          >
            {updateSettingsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                Saving Changes...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Save All Workflows
              </>
            )}
          </Button>
        </div>

        {/* Abandoned Cart Special Bar */}
        <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-950">Abandoned Cart Scanner &amp; Recovery Timer</p>
              <p className="text-[11px] text-purple-800/80">
                Trigger recovery reminders to users who left test packages in their cart without checking out.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-bold text-purple-900 shrink-0">Delay Window:</Label>
              <select
                value={abandonedCartDelay}
                onChange={(e) => setAbandonedCartDelay(Number(e.target.value))}
                className="h-8 text-xs font-bold bg-white border border-purple-200 rounded-lg px-2 text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value={1}>After 1 Hour</option>
                <option value={2}>After 2 Hours (Standard)</option>
                <option value={4}>After 4 Hours</option>
                <option value={6}>After 6 Hours</option>
                <option value={12}>After 12 Hours</option>
                <option value={24}>After 24 Hours</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => triggerCartScanMutation.mutate()}
              disabled={triggerCartScanMutation.isPending}
              className="h-8 text-xs font-bold bg-white border-purple-300 text-purple-900 hover:bg-purple-100/60 shrink-0"
            >
              {triggerCartScanMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
              )}
              Run Scan Now
            </Button>
          </div>
        </div>

        {/* Workflow Cards Grid */}
        <div className="grid gap-4">
          {WORKFLOW_CONFIGS.map((item) => {
            const Icon = item.icon;
            const currentWorkflow = workflows[item.key] || {
              email: item.emailDefault,
              whatsapp: item.whatsappDefault,
            };
            const isEmailOn = currentWorkflow.email ?? item.emailDefault;
            const isWhatsAppOn = currentWorkflow.whatsapp ?? item.whatsappDefault;
            const isPreviewOpen = expandedPreview === item.key;

            return (
              <div
                key={item.key}
                className={cn(
                  "rounded-2xl border transition-all duration-200 bg-white shadow-xs overflow-hidden",
                  isPreviewOpen ? "border-slate-300 shadow-md ring-1 ring-slate-200" : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-3.5">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100", item.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <Badge variant="outline" className={cn("text-[9px] font-bold uppercase", item.badgeBg)}>
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Right: Channel Toggles & Preview Toggle */}
                  <div className="flex items-center gap-5 shrink-0 self-end md:self-center">
                    {/* Email Switch */}
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                      <Mail className={cn("h-4 w-4", isEmailOn ? "text-blue-600" : "text-slate-400")} />
                      <Label htmlFor={`email-${item.key}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                        Email
                      </Label>
                      <Switch
                        id={`email-${item.key}`}
                        checked={isEmailOn}
                        onCheckedChange={(checked) => handleToggleChannel(item.key, "email", checked)}
                      />
                    </div>

                    {/* WhatsApp Switch */}
                    <div className="flex items-center gap-2 bg-emerald-50/70 px-3 py-2 rounded-xl border border-emerald-200/80">
                      <MessageSquare className={cn("h-4 w-4", isWhatsAppOn ? "text-[#25D366]" : "text-slate-400")} />
                      <Label htmlFor={`wa-${item.key}`} className="text-xs font-bold text-slate-700 cursor-pointer">
                        WhatsApp
                      </Label>
                      <Switch
                        id={`wa-${item.key}`}
                        checked={isWhatsAppOn}
                        onCheckedChange={(checked) => handleToggleChannel(item.key, "whatsapp", checked)}
                      />
                    </div>

                    {/* Preview Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedPreview(isPreviewOpen ? null : item.key)}
                      className="h-9 px-2.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      {isPreviewOpen ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" /> Hide Preview
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" /> Template Preview
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Collapsible Message Preview Drawer */}
                {isPreviewOpen && (
                  <div className="bg-slate-50 border-t border-slate-200/80 p-5 grid md:grid-cols-2 gap-4">
                    {/* WhatsApp Preview Bubble */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span className="flex items-center gap-1.5 text-emerald-800">
                          <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                          WhatsApp Message Preview
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">Real-Time Chat Bubble</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-slate-200 relative shadow-inner">
                        <div className="max-w-md bg-white rounded-2xl p-4 shadow-sm text-xs font-sans text-slate-900 whitespace-pre-wrap leading-relaxed border border-slate-100">
                          {item.sampleWhatsAppPreview}
                          <div className="text-[9px] text-slate-400 text-right mt-2 font-mono">12:30 PM ✓✓</div>
                        </div>
                      </div>
                    </div>

                    {/* Email Preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span className="flex items-center gap-1.5 text-blue-800">
                          <Mail className="h-3.5 w-3.5 text-blue-600" />
                          Email Subject &amp; Dispatch Preview
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">HTML Transactional Template</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                        <div className="border-b border-slate-100 pb-2">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Subject Line</p>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{item.sampleEmailSubject}</p>
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="font-semibold text-slate-800">Litmus Official Food Testing Portal</p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Dispatched from verified Litmus SMTP Server with branded HTML header, live tracking links, and official laboratory seals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
