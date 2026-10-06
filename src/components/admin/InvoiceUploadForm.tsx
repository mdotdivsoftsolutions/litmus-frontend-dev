import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { INVOICE_ACCEPT, INVOICE_MAX_BYTES, INVOICE_NUMBER_PATTERN } from "@/lib/api/invoice";
import { formatBytes } from "@/lib/utils/fileSize";
import { Loader2, Upload, FileUp, X } from "lucide-react";

export interface InvoiceUploadValues {
  file: File;
  invoiceNumber?: string;
  invoiceDate?: string;
}

interface InvoiceUploadFormProps {
  /** Pre-fills the fields when replacing an existing invoice. */
  defaultInvoiceNumber?: string | null;
  defaultInvoiceDate?: string | null;
  submitLabel: string;
  isSubmitting: boolean;
  progress: number;
  onSubmit: (values: InvoiceUploadValues) => void;
  onCancel?: () => void;
}

const ACCEPTED_TYPES = INVOICE_ACCEPT.split(",");
const todayIso = () => new Date().toISOString().slice(0, 10);

/** File picker + invoice number/date fields for issuing a booking invoice manually. */
export function InvoiceUploadForm({
  defaultInvoiceNumber,
  defaultInvoiceDate,
  submitLabel,
  isSubmitting,
  progress,
  onSubmit,
  onCancel,
}: InvoiceUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoiceNumber || "");
  const [invoiceDate, setInvoiceDate] = useState(defaultInvoiceDate ? defaultInvoiceDate.slice(0, 10) : todayIso());
  const [error, setError] = useState<string | null>(null);

  const pickFile = (selected?: File | null) => {
    setError(null);
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Only PDF, PNG, JPG or WebP files are allowed.");
      return;
    }
    if (selected.size > INVOICE_MAX_BYTES) {
      setError("Invoice file must be 10 MB or smaller.");
      return;
    }
    setFile(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Choose the invoice file to upload.");
      return;
    }
    const trimmedNumber = invoiceNumber.trim();
    if (trimmedNumber && !INVOICE_NUMBER_PATTERN.test(trimmedNumber)) {
      setError("Invoice number may only contain letters, numbers and / _ - . # (max 50).");
      return;
    }
    onSubmit({ file, invoiceNumber: trimmedNumber || undefined, invoiceDate: invoiceDate || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pickFile(e.dataTransfer.files?.[0]);
        }}
        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center cursor-pointer hover:border-[#007799]/50 hover:bg-[#007799]/5 transition-colors"
      >
        <FileUp className="h-7 w-7 text-[#007799]" />
        {file ? (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <span className="truncate max-w-[260px]" title={file.name}>{file.name}</span>
            <span className="text-xs text-slate-400">({formatBytes(file.size)})</span>
            <button
              type="button"
              aria-label="Remove selected file"
              className="rounded p-0.5 hover:bg-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800">Click or drop the invoice here</p>
            <p className="text-xs text-slate-500">PDF, PNG, JPG or WebP · max 10 MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={INVOICE_ACCEPT}
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="invoiceNumber" className="text-xs">Invoice No. (optional)</Label>
          <Input
            id="invoiceNumber"
            value={invoiceNumber}
            maxLength={50}
            placeholder="e.g. LFA/2026/0142"
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="invoiceDate" className="text-xs">Invoice Date</Label>
          <Input id="invoiceDate" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
        </div>
      </div>

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      {isSubmitting && <Progress value={progress} className="h-1.5" />}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="gap-2 bg-[#007799] hover:bg-[#00607c] text-white">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
