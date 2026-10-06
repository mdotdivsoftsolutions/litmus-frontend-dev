import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Edit, Tag, Beaker, FileText, IndianRupee, Clock, Layers, FolderTree } from "lucide-react";

interface TestDetailSheetProps {
  test: any | null;
  onClose: () => void;
}

/** Read-only side panel with a test protocol's mapping, pricing, specs and parameters. */
export function TestDetailSheet({ test, onClose }: TestDetailSheetProps) {
  return (
    <Sheet open={!!test} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="flex flex-col sm:max-w-lg w-full p-0 bg-white">
        {test && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border bg-slate-50/70">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl border border-slate-200/90 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                  {test.imageUrl || test.icon ? (
                    <img
                      src={test.imageUrl || test.icon}
                      alt={test.testName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Beaker className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={test.creatorType === 'LAB' ? "secondary" : "default"} className="text-[10px] h-5">
                      {test.creatorType === 'LAB' ? "Personalized (Lab)" : "Platform (Admin)"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`capitalize text-[10px] font-bold px-2 h-5 ${
                        test.metadata?.type?.toLowerCase() === "chemical"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : test.metadata?.type?.toLowerCase() === "microbiological"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : test.metadata?.type?.toLowerCase() === "nutritional"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {test.metadata?.type || 'Standard'}
                    </Badge>
                    {test.isPopular && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] h-5">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <SheetTitle className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    {test.testName}
                  </SheetTitle>
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* 1. Category & Subcategory Card */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <FolderTree className="h-3.5 w-3.5 text-primary" />
                  <span>Category & Subcategory Mapping</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {test.isApplicableToAll ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      <Layers className="h-3.5 w-3.5 text-slate-500" />
                      Applicable to All Categories
                    </span>
                  ) : test.applicableCategories && test.applicableCategories.length > 0 ? (
                    test.applicableCategories.map((c: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                      >
                        <Layers className="h-3.5 w-3.5" />
                        {typeof c === 'string' ? c : c.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">General Category</span>
                  )}

                  {test.applicableSubcategories && test.applicableSubcategories.length > 0 && (
                    test.applicableSubcategories.map((sub: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-xs font-medium text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                      >
                        ↳ {sub}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* 2. Pricing Overview Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                  <p className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5 text-slate-400" /> Base Price
                  </p>
                  <p className="font-extrabold text-xl text-slate-900">
                    ₹{test.price?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 shadow-2xs">
                  <p className="text-emerald-700 text-xs font-medium mb-1 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" /> Offer Price
                  </p>
                  <p className="font-extrabold text-xl text-emerald-600">
                    {test.offerPrice ? `₹${test.offerPrice.toLocaleString()}` : "Standard Rate"}
                  </p>
                </div>
              </div>

              {/* 3. Details & Metadata Specifications */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" /> Test Specifications
                </h4>
                <div className="rounded-xl border border-slate-200/80 bg-white divide-y divide-slate-100 overflow-hidden shadow-2xs text-xs">
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500 font-medium">Classification</span>
                    <span className="font-bold text-slate-900 capitalize">{test.metadata?.type || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500 font-medium">FSSAI / Reference Method</span>
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] max-w-[240px] truncate" title={test.metadata?.method}>
                      {test.metadata?.method || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-slate-500 font-medium">Turn Around Time (TAT)</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {test.turnAroundTime || '24-48 Hours'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Description */}
              {test.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Description & Scope
                  </h4>
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    {test.description}
                  </div>
                </div>
              )}

              {/* 5. Parameters Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Beaker className="h-3.5 w-3.5 text-primary" />
                    Parameters ({test.metadata?.parameters?.length || 0})
                  </h4>
                </div>

                {test.metadata?.parameters?.length > 0 ? (
                  <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200/80">
                        <tr>
                          <th className="px-3.5 py-2.5">Parameter</th>
                          <th className="px-3.5 py-2.5">Unit</th>
                          <th className="px-3.5 py-2.5">Acceptable Limit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {test.metadata.parameters.map((p: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3.5 py-2.5 font-bold text-slate-800">{p.name}</td>
                            <td className="px-3.5 py-2.5 text-slate-600">{p.unit || '-'}</td>
                            <td className="px-3.5 py-2.5 font-mono text-slate-700">{p.acceptableLimit || p.maxLimit || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-xl border border-border border-dashed text-xs text-muted-foreground">
                    No parameters defined.
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-border bg-white shadow-lg flex items-center justify-between gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                className="border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs h-10 px-4"
              >
                Close
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-10 text-xs sm:text-sm gap-2 shadow-sm" asChild>
                <Link to={`/admin/tests/${test._id}/edit`}>
                  <Edit className="h-4 w-4" /> Edit Test Protocol
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
