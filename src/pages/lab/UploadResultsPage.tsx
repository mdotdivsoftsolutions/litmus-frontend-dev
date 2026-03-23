import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { tests as allTests } from "@/lib/placeholder-data";

export default function UploadResultsPage() {
  const { id } = useParams();
  const selectedTests = allTests.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/lab/bookings" className="hover:text-foreground">Bookings</Link><span>/</span>
        <span className="text-foreground font-medium">{id || "BK-2024-002"}</span><span>/</span>
        <span className="text-foreground font-medium">Upload Results</span>
      </div>
      <h1 className="text-2xl font-bold text-foreground">Upload Results — {id || "BK-2024-002"}</h1>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Test Results</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {selectedTests.map((t) => (
            <div key={t.id} className="rounded-lg border p-4 space-y-3">
              <p className="font-medium">{t.name} <span className="text-xs text-muted-foreground ml-1">FSSAI {t.method}</span></p>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Result Value</Label><Input placeholder="0.00" /></div>
                <div className="space-y-1"><Label className="text-xs">Unit</Label><Input defaultValue="% w/w" readOnly className="bg-muted" /></div>
                <div className="space-y-1"><Label className="text-xs">Pass/Fail</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="pass">Pass</SelectItem><SelectItem value="fail">Fail</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Notes</Label><Input placeholder="Optional" /></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">Upload Report PDF</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-10 hover:border-secondary transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium text-foreground">Drag & drop report PDF here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button size="lg">Submit Results</Button>
    </div>
  );
}
