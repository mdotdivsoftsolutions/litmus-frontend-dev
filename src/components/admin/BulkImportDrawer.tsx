import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  RotateCcw,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { bulkImportApi, ImportSummary, BulkImportResponse } from "@/lib/api/bulkImport";

export type EntityImportType = "categories" | "tests" | "packages" | "laboratories" | "master";

interface BulkImportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: EntityImportType;
  title: string;
  description?: string;
  templateFileName: string;
  templateDisplayName: string;
  onSuccess?: () => void;
}

export function BulkImportDrawer({
  open,
  onOpenChange,
  entityType,
  title,
  description,
  templateFileName,
  templateDisplayName,
  onSuccess,
}: BulkImportDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [totalParsedRows, setTotalParsedRows] = useState<number>(0);
  const [detectedSheet, setDetectedSheet] = useState<string>("");

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [importResult, setImportResult] = useState<BulkImportResponse | null>(null);

  const resetState = () => {
    setSelectedFile(null);
    setPreviewRows([]);
    setPreviewHeaders([]);
    setTotalParsedRows(0);
    setDetectedSheet("");
    setIsUploading(false);
    setUploadProgress(0);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  // Handle Excel file selection & client-side preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Please upload a valid Excel (.xlsx, .xls) or CSV file");
      return;
    }

    setSelectedFile(file);
    setImportResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      setDetectedSheet(sheetName);

      const sheet = workbook.Sheets[sheetName];
      const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      if (rawRows.length > 0) {
        // Find header row
        let headerIdx = 0;
        for (let i = 0; i < rawRows.length; i++) {
          const rowValues = rawRows[i].map((c) => String(c).trim());
          if (rowValues.some((v) => v.length > 0 && !v.toLowerCase().includes("instruction"))) {
            headerIdx = i;
            break;
          }
        }

        const headers = rawRows[headerIdx].map((h) => String(h).trim()).filter(Boolean);
        setPreviewHeaders(headers);

        const contentRows = rawRows.slice(headerIdx + 1).filter((r) => {
          const joined = r.join(" ").toUpperCase();
          return !joined.includes("REQUIRED") && !joined.includes("OPTIONAL") && r.some((c: any) => String(c).trim() !== "");
        });

        setTotalParsedRows(contentRows.length);
        // Show first 4 rows for preview
        setPreviewRows(
          contentRows.slice(0, 4).map((row) => {
            const rowObj: any = {};
            headers.forEach((h, colIdx) => {
              rowObj[h] = row[colIdx] !== undefined ? String(row[colIdx]) : "";
            });
            return rowObj;
          })
        );
      }
    } catch (err: any) {
      console.error("Preview parse error", err);
      toast.error("Unable to preview file. You can still proceed with upload.");
    }
  };

  // Perform upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file to upload");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(15);

      let response: BulkImportResponse;
      const progressCallback = (p: number) => setUploadProgress(p);

      switch (entityType) {
        case "categories":
          response = await bulkImportApi.importCategories(selectedFile, progressCallback);
          break;
        case "tests":
          response = await bulkImportApi.importTests(selectedFile, progressCallback);
          break;
        case "packages":
          response = await bulkImportApi.importPackages(selectedFile, progressCallback);
          break;
        case "laboratories":
          response = await bulkImportApi.importLaboratories(selectedFile, progressCallback);
          break;
        case "master":
          response = await bulkImportApi.importMaster(selectedFile, progressCallback);
          break;
        default:
          throw new Error("Unknown import entity");
      }

      setImportResult(response);
      setUploadProgress(100);

      const summary = response.summary;
      if (summary) {
        if (summary.failed === 0) {
          toast.success(
            `Import successful! ${summary.created} created, ${summary.updated} updated.`
          );
        } else if (summary.created > 0 || summary.updated > 0) {
          toast.warning(
            `Import partially completed. ${summary.created} created, ${summary.failed} failed.`
          );
        } else {
          toast.error(`Import failed: ${summary.failed} errors encountered.`);
        }
      } else if (response.results) {
        toast.success("Master workbook processed successfully!");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to process bulk import");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleDrawerClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto flex flex-col p-0 bg-slate-50">
        {/* Header */}
        <div className="p-6 bg-white border-b border-border/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-slate-900">{title}</SheetTitle>
              <SheetDescription className="text-xs text-slate-500 mt-0.5">
                {description || "Upload standardized Excel sheet to bulk create or update catalog entries."}
              </SheetDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* STEP 1: Download Template */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
                  Download Official Template
                </h4>
                <p className="text-xs text-slate-500">
                  Includes required column headers, instructions, and sample rows.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2 border-primary/30 text-primary hover:bg-primary/5 font-medium shrink-0"
              >
                <a href={`/templates/${templateFileName}`} download={templateFileName}>
                  <Download className="h-4 w-4" />
                  Download Excel Template
                </a>
              </Button>
            </div>
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
              <span className="font-medium text-slate-700">Template File:</span>
              <code className="text-primary font-semibold">{templateDisplayName}</code>
            </div>
          </div>

          {/* STEP 2: Upload Excel File */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
                Upload Completed File
              </h4>
              <p className="text-xs text-slate-500">
                Drag and drop or select your filled Excel (.xlsx / .csv) file.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag & drop your Excel file here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports .xlsx, .xls, and .csv files up to 20MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[280px]">
                      {selectedFile.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                      {totalParsedRows > 0 && (
                        <Badge variant="outline" className="text-[10px] bg-white h-4 px-1.5 text-slate-600">
                          {totalParsedRows} data rows detected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetState}
                  disabled={isUploading}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  Change File
                </Button>
              </div>
            )}
          </div>

          {/* STEP 3: Live Preview Table */}
          {selectedFile && previewRows.length > 0 && !importResult && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
                  Pre-Upload Preview
                </h4>
                <span className="text-xs text-slate-400">
                  Showing top {previewRows.length} of {totalParsedRows} rows
                </span>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden text-xs">
                <ScrollArea className="w-full max-h-48 overflow-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        {previewHeaders.slice(0, 5).map((h, i) => (
                          <TableHead key={i} className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.map((row, idx) => (
                        <TableRow key={idx}>
                          {previewHeaders.slice(0, 5).map((h, cIdx) => (
                            <TableCell key={cIdx} className="text-[11px] text-slate-600 truncate max-w-[150px]">
                              {row[h] || <span className="text-slate-300 italic">—</span>}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* STEP 4: Progress Bar when uploading */}
          {isUploading && (
            <div className="bg-white p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing & validating Excel data...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-[11px] text-slate-500">
                Please wait while the server parses parameter pricing, links references, and commits records.
              </p>
            </div>
          )}

          {/* STEP 5: Results & Detailed Summary */}
          {importResult && (
            <div className="space-y-4 animate-fade-in">
              {importResult.summary && (
                <div
                  className={`p-4 rounded-xl border ${
                    importResult.summary.failed === 0
                      ? "bg-emerald-50/70 border-emerald-200"
                      : importResult.summary.created > 0 || importResult.summary.updated > 0
                      ? "bg-amber-50/70 border-amber-200"
                      : "bg-rose-50/70 border-rose-200"
                  } space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {importResult.summary.failed === 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      )}
                      <h4 className="text-sm font-bold text-slate-900">
                        {importResult.summary.failed === 0
                          ? "Import Completed Successfully"
                          : "Import Completed with Warnings"}
                      </h4>
                    </div>
                    <Badge variant="outline" className="bg-white text-xs">
                      {importResult.summary.totalRows} Total Rows
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Created</p>
                      <p className="text-lg font-bold text-emerald-600 mt-0.5">{importResult.summary.created}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Updated</p>
                      <p className="text-lg font-bold text-blue-600 mt-0.5">{importResult.summary.updated}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Failed</p>
                      <p className="text-lg font-bold text-rose-600 mt-0.5">{importResult.summary.failed}</p>
                    </div>
                  </div>

                  {/* Errors list */}
                  {importResult.summary.errors && importResult.summary.errors.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      <p className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <XCircle className="h-3.5 w-3.5" /> Issues Encountered ({importResult.summary.errors.length}):
                      </p>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                        {importResult.summary.errors.map((err, i) => (
                          <div key={i} className="text-[11px] p-2 bg-white rounded border border-rose-100 flex items-start gap-2">
                            <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4 shrink-0">
                              Row {err.row}
                            </Badge>
                            <span className="text-slate-700 flex-1">
                              {err.item ? <strong>{err.item}: </strong> : null}
                              {err.reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Master Results Breakdown */}
              {importResult.results && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Master Import Summary by Sheet:
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(importResult.results).map(([sheetKey, summary]) => (
                      <div key={sheetKey} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 capitalize">{sheetKey}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600 font-medium">+{summary.created} new</span>
                          <span className="text-blue-600 font-medium">~{summary.updated} updated</span>
                          {summary.failed > 0 && (
                            <span className="text-rose-600 font-bold">!{summary.failed} failed</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDrawerClose(false)}
            disabled={isUploading}
          >
            {importResult ? "Close" : "Cancel"}
          </Button>

          <div className="flex items-center gap-2">
            {importResult && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetState}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Upload Another
              </Button>
            )}

            {!importResult && (
              <Button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-primary hover:bg-primary/90 text-white font-semibold text-xs h-9 px-4 gap-2 shadow-sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Start Bulk Import
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
