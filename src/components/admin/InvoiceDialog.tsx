import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { InvoiceUploadForm, InvoiceUploadValues } from "@/components/admin/InvoiceUploadForm";
import { formatBytes } from "@/lib/utils/fileSize";
import { invoiceApi, BookingInvoiceSummary } from "@/lib/api/invoice";
import { AlertCircle, Download, Eye, FileText, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface InvoiceDialogProps {
  bookingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const errorMessage = (err: any, fallback: string) => err?.response?.data?.message || fallback;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/**
 * Invoices are issued manually by the accounts team: upload, view, replace or remove
 * the tax invoice for a booking. The customer is emailed when an invoice is uploaded.
 */
export function InvoiceDialog({ bookingId, open, onOpenChange }: InvoiceDialogProps) {
  const queryClient = useQueryClient();
  const [isReplacing, setIsReplacing] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [busyAction, setBusyAction] = useState<"view" | "download" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryKey = ["bookingInvoice", bookingId];
  const { data: response, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => invoiceApi.getSummary(bookingId as string),
    enabled: !!bookingId && open,
  });
  const invoice: BookingInvoiceSummary | undefined = response?.data;

  // Release blob URLs so repeated previews don't leak memory.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
      setIsReplacing(false);
      setUploadProgress(0);
    }
  }, [open]);

  const onInvoiceChanged = (summary: BookingInvoiceSummary) => {
    queryClient.setQueryData(queryKey, { success: true, data: summary });
    queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
    setPreviewUrl(null);
    setIsReplacing(false);
  };

  const uploadMutation = useMutation({
    mutationFn: (values: InvoiceUploadValues) => invoiceApi.upload(bookingId as string, values, setUploadProgress),
    onMutate: () => setUploadProgress(0),
    onSuccess: (res) => {
      onInvoiceChanged(res.data);
      toast.success("Invoice uploaded. The customer has been notified.");
    },
    onError: (err: any) => toast.error(errorMessage(err, "Failed to upload the invoice.")),
  });

  const removeMutation = useMutation({
    mutationFn: () => invoiceApi.remove(bookingId as string),
    onSuccess: (res) => {
      onInvoiceChanged(res.data);
      setIsRemoveConfirmOpen(false);
      toast.success("Invoice removed.");
    },
    onError: (err: any) => toast.error(errorMessage(err, "Failed to remove the invoice.")),
  });

  const fetchBlobUrl = async () => URL.createObjectURL(await invoiceApi.download(bookingId as string));

  const handleView = async () => {
    try {
      setBusyAction("view");
      setPreviewUrl(await fetchBlobUrl());
    } catch {
      toast.error("Could not open the invoice.");
    } finally {
      setBusyAction(null);
    }
  };

  const handleDownload = async () => {
    if (!invoice) return;
    try {
      setBusyAction("download");
      const url = await fetchBlobUrl();
      const link = document.createElement("a");
      link.href = url;
      link.download = invoice.fileName || `Invoice-${invoice.invoiceNumber || (bookingId as string).slice(-6)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Failed to download the invoice.");
    } finally {
      setBusyAction(null);
    }
  };

  const isImage = invoice?.mimeType?.startsWith("image/");
  const showUploadForm = invoice && (!invoice.available || isReplacing);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={previewUrl ? "sm:max-w-4xl max-h-[92vh] flex flex-col" : "sm:max-w-lg"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#007799]" /> Tax Invoice
            </DialogTitle>
            <DialogDescription>
              Upload the invoice issued by the accounts team. The customer can view and download it from their orders.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage(error, "Failed to load invoice details.")}</span>
            </div>
          ) : showUploadForm ? (
            <div className="space-y-3">
              {!invoice.available && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  No invoice has been issued for this booking yet.
                </p>
              )}
              <InvoiceUploadForm
                defaultInvoiceNumber={invoice.invoiceNumber}
                defaultInvoiceDate={invoice.invoiceDate}
                submitLabel={invoice.available ? "Replace Invoice" : "Upload Invoice"}
                isSubmitting={uploadMutation.isPending}
                progress={uploadProgress}
                onSubmit={(values) => uploadMutation.mutate(values)}
                onCancel={invoice.available ? () => setIsReplacing(false) : undefined}
              />
            </div>
          ) : invoice ? (
            <div className="flex flex-col gap-4 min-h-0">
              <dl className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-xs">
                <div>
                  <dt className="text-slate-500">Invoice No.</dt>
                  <dd className="font-semibold text-slate-900 break-all">{invoice.invoiceNumber || "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Invoice Date</dt>
                  <dd className="font-semibold text-slate-900">{formatDate(invoice.invoiceDate)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-500">File</dt>
                  <dd className="font-medium text-slate-800 truncate" title={invoice.fileName || undefined}>
                    {invoice.fileName}{" "}
                    {invoice.size ? <span className="text-slate-400">({formatBytes(invoice.size)})</span> : null}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-500">Uploaded</dt>
                  <dd className="font-medium text-slate-800">{formatDate(invoice.uploadedAt)}</dd>
                </div>
              </dl>

              {previewUrl && (
                <div className="flex-1 min-h-[50vh] rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                  {isImage ? (
                    <img src={previewUrl} alt="Invoice preview" className="w-full h-full object-contain" />
                  ) : (
                    <iframe src={previewUrl} title="Invoice preview" className="w-full h-full min-h-[50vh]" />
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {!previewUrl && (
                  <Button variant="outline" className="flex-1 gap-2" onClick={handleView} disabled={busyAction !== null}>
                    {busyAction === "view" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                    View
                  </Button>
                )}
                <Button variant="outline" className="flex-1 gap-2" onClick={handleDownload} disabled={busyAction !== null}>
                  {busyAction === "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => setIsReplacing(true)}>
                  <RefreshCw className="h-4 w-4" /> Replace
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => setIsRemoveConfirmOpen(true)}
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isRemoveConfirmOpen}
        onOpenChange={setIsRemoveConfirmOpen}
        title="Remove invoice?"
        description="The customer will no longer be able to view or download this invoice. You can upload a new one at any time."
        confirmText="Remove"
        variant="destructive"
        loading={removeMutation.isPending}
        onConfirm={() => removeMutation.mutate()}
      />
    </>
  );
}
