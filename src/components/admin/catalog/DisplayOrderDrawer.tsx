import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { catalogOrderApi, CatalogEntity, DisplayOrderImportResult } from "@/lib/api/catalogOrder";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface DisplayOrderDrawerProps {
  entity: CatalogEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Query keys to refresh after a successful import. */
  invalidateKeys: string[];
}

const LABELS: Record<CatalogEntity, { singular: string; plural: string; nameColumn: string; fileName: string }> = {
  tests: { singular: "test", plural: "Tests", nameColumn: "Test Name", fileName: "Litmus_Tests_Display_Order.xlsx" },
  packages: { singular: "package", plural: "Packages", nameColumn: "Package Name", fileName: "Litmus_Packages_Display_Order.xlsx" },
};

const SHEET_MAX_BYTES = 5 * 1024 * 1024;

/** Excel round-trip for storefront priority: export current order, edit, import back. */
export function DisplayOrderDrawer({ entity, open, onOpenChange, invalidateKeys }: DisplayOrderDrawerProps) {
  const labels = LABELS[entity];
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<DisplayOrderImportResult | null>(null);

  const importMutation = useMutation({
    mutationFn: (file: File) => catalogOrderApi.importSheet(entity, file),
    onSuccess: (res) => {
      setResult(res.data);
      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
      if (res.data.failed.length === 0) toast.success(res.message || "Display order imported");
      else toast.warning(`Imported with ${res.data.failed.length} row(s) skipped`);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to import the sheet"),
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const url = URL.createObjectURL(await catalogOrderApi.exportSheet(entity));
      const link = document.createElement("a");
      link.href = url;
      link.download = labels.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      toast.error("Failed to download the sheet");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFile = (file?: File) => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      toast.error("Upload an .xlsx, .xls or .csv file");
      return;
    }
    if (file.size > SHEET_MAX_BYTES) {
      toast.error("Sheet must be 5 MB or smaller");
      return;
    }
    setResult(null);
    importMutation.mutate(file);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setResult(null);
        onOpenChange(next);
      }}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> {labels.plural} Display Order
          </SheetTitle>
          <SheetDescription>
            Set the order {labels.plural.toLowerCase()} appear in on the website. Priority 1 is shown first; items without a
            priority follow in the default order.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 text-sm">
          <ol className="space-y-2 text-xs text-slate-600 list-decimal pl-4">
            <li>Download the sheet. It lists every active {labels.singular} with its ID and current priority.</li>
            <li>
              Fill in the <b>Display Order</b> column (1, 2, 3…). Leave it empty to remove a priority. Keep the <b>ID</b> column
              as it is, or use <b>{labels.nameColumn}</b> if you build your own sheet.
            </li>
            <li>Upload the sheet. Only rows you include are changed.</li>
          </ol>

          <Button variant="outline" className="w-full gap-2" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download current order (.xlsx)
          </Button>

          <Button
            className="w-full gap-2 bg-primary text-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload updated sheet
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {result && (
            <div className="space-y-3 rounded-xl border border-slate-200 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {result.applied} of {result.totalRows} row(s) applied
              </p>
              <p className="text-xs text-slate-500">
                {result.prioritised} prioritised · {result.cleared} cleared · {result.modified} changed
              </p>
              {result.failed.length > 0 && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                    <AlertTriangle className="h-4 w-4" /> {result.failed.length} row(s) skipped
                  </p>
                  <ul className="max-h-48 overflow-y-auto space-y-1 text-[11px] text-slate-600">
                    {result.failed.map((row) => (
                      <li key={row.rowNumber} className="rounded bg-amber-50 px-2 py-1">
                        Row {row.rowNumber}: {row.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
