import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, ArrowLeft } from "lucide-react";
import { tests as allTests, bookings } from "@/lib/placeholder-data";

export default function UploadResultsPage() {
  const { id } = useParams();
  const booking = bookings.find(b => b.id === id) || bookings[1];
  const selectedTests = allTests.slice(0, booking.testsCount || 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/lab/bookings"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Results</h1>
          <p className="text-sm text-muted-foreground">{booking.id} · {booking.product} · {booking.user}</p>
        </div>
      </div>

      {/* Booking summary */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><p className="text-muted-foreground text-xs">Product</p><p className="font-medium">{booking.product}</p></div>
            <div><p className="text-muted-foreground text-xs">User</p><p className="font-medium">{booking.user}</p></div>
            <div><p className="text-muted-foreground text-xs">Tests</p><p className="font-medium">{booking.testsCount} tests</p></div>
            <div><p className="text-muted-foreground text-xs">Amount</p><p className="font-medium text-primary">₹{booking.amount.toLocaleString()}</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader><CardTitle className="text-base">Test Results</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {selectedTests.map((t) => (
            <div key={t.id} className="rounded-lg border border-border p-4 space-y-3">
              <p className="font-medium text-sm">{t.name} <span className="text-xs text-muted-foreground ml-1">FSSAI {t.method} · {t.type}</span></p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs font-medium">Result Value</Label><Input placeholder="0.00" /></div>
                <div className="space-y-1"><Label className="text-xs font-medium">Unit</Label><Input defaultValue="% w/w" readOnly className="bg-muted/50" /></div>
                <div className="space-y-1"><Label className="text-xs font-medium">Pass/Fail</Label>
                  <Select><SelectTrigger className="text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="pass">Pass ✓</SelectItem><SelectItem value="fail">Fail ✗</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs font-medium">Notes</Label><Input placeholder="Optional notes" /></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader><CardTitle className="text-base">Upload Report PDF</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-10 hover:border-primary transition-colors cursor-pointer bg-muted/20">
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium text-foreground">Drag & drop report PDF here</p>
              <p className="text-sm text-muted-foreground">or click to browse · Max 10MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button size="lg" className="bg-primary hover:bg-primary-deep">Submit Results</Button>
    </div>
  );
}
