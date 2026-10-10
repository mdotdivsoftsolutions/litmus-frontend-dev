export type ItemType = "TEST" | "PACKAGE";
export type DiscountType = "FLAT" | "PERCENTAGE";
export type OfflineMethod = "UPI" | "BANK_TRANSFER" | "CASH" | "CARD" | "CHEQUE";

export interface Customer {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: { street?: string; city?: string; state?: string; pincode?: string; pinCode?: string } | string;
  shippingAddress?: { street?: string; city?: string; state?: string; pincode?: string };
  gstNumber?: string;
}

export interface CatalogParam {
  name: string;
  price?: number;
  isCustom?: boolean;
}

export interface SampleDraft {
  id: string;
  productName: string;
  quantity: string;
  batchNumber: string;
  sku: string;
  specifics: string;
  selectedParameters: string[];
}

/** One selected test or package with its samples. */
export interface LineDraft {
  key: string;
  itemType: ItemType;
  refId: string;
  name: string;
  /** Catalog price for one sample (packages, or tests without parameter pricing). */
  unitPrice: number;
  unitMrp: number;
  /** Test parameters (priced per sample) — empty for packages. */
  parameters: CatalogParam[];
  /** Test names included in a package. */
  packageTests: string[];
  catalogDiscountType?: string;
  catalogDiscountValue?: number;
  samples: SampleDraft[];
}

export interface LogisticsDraft {
  collectionMethod: "" | "PICKUP" | "COURIER";
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pickupDate: string;
  pickupTime: string;
  gstNumber: string;
  /** "admin" = Litmus Smart Allocation */
  labId: string;
}

export interface DiscountDraft {
  discountType: DiscountType;
  value: string;
}

export interface PaymentDraft {
  status: "PAID" | "PENDING";
  method: "" | OfflineMethod;
  platform: string;
  transactionId: string;
  paidOn: string;
}

export const OFFLINE_METHODS: { value: OfflineMethod; label: string; platforms: string[] }[] = [
  { value: "UPI", label: "UPI", platforms: ["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"] },
  { value: "BANK_TRANSFER", label: "Bank Transfer (NEFT / RTGS / IMPS)", platforms: ["HDFC", "SBI", "ICICI", "Axis", "Kotak"] },
  { value: "CASH", label: "Cash", platforms: [] },
  { value: "CARD", label: "Card / POS", platforms: ["Razorpay POS", "Pine Labs", "HDFC POS"] },
  { value: "CHEQUE", label: "Cheque", platforms: ["HDFC", "SBI", "ICICI", "Axis", "Kotak"] },
];

export const PICKUP_TIMES = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

export const newSample = (selectedParameters: string[] = []): SampleDraft => ({
  id: Math.random().toString(36).slice(2),
  productName: "",
  quantity: "",
  batchNumber: "",
  sku: "",
  specifics: "",
  selectedParameters,
});
