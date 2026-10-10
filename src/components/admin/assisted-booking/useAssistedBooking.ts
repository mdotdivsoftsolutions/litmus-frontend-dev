import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { settingsApi } from "@/lib/api/settings";
import { linePrice, lineMrp, summarize } from "./pricing";
import {
  newSample,
  type Customer,
  type DiscountDraft,
  type LineDraft,
  type LogisticsDraft,
  type PaymentDraft,
} from "./types";

export const STEPS = ["Select Customer", "Tests & Packages", "Samples & Logistics", "Discount & Payment", "Review & Confirm"];

const today = () => new Date().toISOString().slice(0, 10);

const emptyLogistics: LogisticsDraft = {
  collectionMethod: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  pickupDate: "",
  pickupTime: "",
  gstNumber: "",
  labId: "admin",
};

/** Address saved on the customer profile (mirrors the customer checkout prefill). */
function profileAddress(c: Customer) {
  const a = typeof c.address === "object" && c.address ? c.address : {};
  const s = c.shippingAddress || {};
  return {
    address: s.street || a.street || "",
    city: s.city || a.city || "",
    state: s.state || a.state || "",
    pincode: s.pincode || a.pincode || a.pinCode || "",
  };
}

export function useAssistedBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [logistics, setLogistics] = useState<LogisticsDraft>(emptyLogistics);
  const [discount, setDiscount] = useState<DiscountDraft>({ discountType: "FLAT", value: "" });
  const [payment, setPayment] = useState<PaymentDraft>({ status: "PAID", method: "", platform: "", transactionId: "", paidOn: today() });
  const [adminComment, setAdminComment] = useState("");

  const { data: settingsRes } = useQuery({ queryKey: ["adminPlatformSettings"], queryFn: settingsApi.getSettings, staleTime: 60_000 });
  const settings = settingsRes?.data || {};
  const maxDiscountPercent: number = settings.maxSpecialDiscountPercent ?? 100;
  const pickupCities: string[] = settings.pickupCities || [];

  const pricing = useMemo(() => summarize(lines, discount, maxDiscountPercent), [lines, discount, maxDiscountPercent]);

  const selectCustomer = (c: Customer | null) => {
    setCustomer(c);
    if (!c) return;
    const addr = profileAddress(c);
    setLogistics((prev) => ({
      ...prev,
      name: `${c.firstName || ""} ${c.lastName || ""}`.trim(),
      email: c.email || "",
      phone: c.phone || "",
      ...addr,
      gstNumber: (c.gstNumber || "").toUpperCase().slice(0, 15),
    }));
  };

  const addLine = (line: Omit<LineDraft, "samples" | "key">) => {
    if (lines.some((l) => l.refId === line.refId)) {
      toast.info(`${line.name} is already added`);
      return;
    }
    const defaults = line.itemType === "TEST" ? line.parameters.map((p) => p.name) : line.packageTests;
    setLines((prev) => [...prev, { ...line, key: line.refId, samples: [newSample(defaults)] }]);
  };
  const removeLine = (key: string) => setLines((prev) => prev.filter((l) => l.key !== key));
  const updateLine = (key: string, fn: (l: LineDraft) => LineDraft) =>
    setLines((prev) => prev.map((l) => (l.key === key ? fn(l) : l)));

  const isPickupCovered =
    !pickupCities.length || pickupCities.some((c) => c.trim().toLowerCase() === logistics.city.trim().toLowerCase());
  const gst = logistics.gstNumber.trim();

  const stepError = (s: number): string | null => {
    if (s === 0 && !customer) return "Select or create the customer first";
    if (s === 1 && lines.length === 0) return "Add at least one test or package";
    if (s === 2) {
      if (lines.some((l) => !l.samples.some((x) => x.productName.trim()))) return "Enter a product name for every test / package";
      if (lines.some((l) => l.itemType === "TEST" && l.parameters.length > 0 && l.samples.some((x) => x.productName.trim() && x.selectedParameters.length === 0))) {
        return "Select at least one parameter for every test sample";
      }
      if (!logistics.collectionMethod) return "Choose pickup or courier";
      if (!logistics.address.trim() || !logistics.city.trim() || !logistics.pincode.trim()) return "Address, city and pincode are required";
      if (logistics.collectionMethod === "PICKUP" && !isPickupCovered) return `Pickup is not available in ${logistics.city}`;
      if (gst && (gst.length < 12 || gst.length > 15)) return "GST number must be 12–15 characters";
    }
    if (s === 3) {
      if (pricing.error) return pricing.error;
      if (payment.status === "PAID") {
        if (!payment.method) return "Select how the customer paid";
        if (payment.method !== "CASH" && !payment.transactionId.trim()) return "Enter the transaction / UTR / reference number";
        if (!payment.paidOn) return "Enter the payment date";
      }
    }
    return null;
  };

  const next = () => {
    const err = stepError(step);
    if (err) return toast.error(err);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const goTo = (s: number) => {
    for (let i = 0; i < s; i++) {
      const err = stepError(i);
      if (err) {
        setStep(i);
        return toast.error(err);
      }
    }
    setStep(s);
  };

  const mutation = useMutation({
    mutationFn: adminApi.createAssistedBooking,
    onSuccess: (res) => {
      toast.success(`Booking ${res?.data?.orderCode || ""} created`.trim());
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      queryClient.invalidateQueries({ queryKey: ["adminPayments"] });
      navigate(res?.data?._id ? `/admin/bookings/${res.data._id}` : "/admin/bookings");
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create booking"),
  });

  const submit = () => {
    for (let i = 0; i < STEPS.length - 1; i++) {
      const err = stepError(i);
      if (err) {
        setStep(i);
        return toast.error(err);
      }
    }
    const { labId, collectionMethod, gstNumber, ...details } = logistics;
    mutation.mutate({
      userId: customer!._id,
      labId,
      items: lines.map((l) => ({
        itemType: l.itemType,
        testId: l.itemType === "TEST" ? l.refId : undefined,
        packageId: l.itemType === "PACKAGE" ? l.refId : undefined,
        price: linePrice(l),
        mrp: lineMrp(l),
        samples: l.samples
          .filter((s) => s.productName.trim())
          .map((s) => ({
            productName: s.productName.trim(),
            quantity: s.quantity,
            batchNumber: s.batchNumber,
            sku: s.sku,
            specifics: s.specifics,
            selectedParameters: l.itemType === "TEST" ? s.selectedParameters : undefined,
            selectedTests: l.itemType === "PACKAGE" ? s.selectedParameters : undefined,
          })),
      })),
      collectionMethod,
      collectionDetails: details,
      gstNumber: gstNumber.trim().toUpperCase() || undefined,
      discount: Number(discount.value) > 0 ? { discountType: discount.discountType, value: Number(discount.value) } : undefined,
      payment:
        payment.status === "PAID"
          ? { status: "PAID", method: payment.method, platform: payment.platform, transactionId: payment.transactionId.trim(), paidOn: payment.paidOn }
          : { status: "PENDING" },
      adminComment: adminComment.trim(),
    });
  };

  return {
    step, next, back, goTo, submit, isSubmitting: mutation.isPending,
    customer, selectCustomer,
    lines, addLine, removeLine, updateLine,
    logistics, setLogistics, pickupCities, isPickupCovered,
    discount, setDiscount, maxDiscountPercent, pricing,
    payment, setPayment,
    adminComment, setAdminComment,
  };
}

export type AssistedBookingState = ReturnType<typeof useAssistedBooking>;
