import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

export default function LabProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Lab Profile</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Lab Name</Label><Input defaultValue="Chennai Food Testing Laboratory" /></div>
            <div className="space-y-2"><Label>Address</Label><Input defaultValue="45, Anna Salai, Guindy" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Contact</Label><Input defaultValue="+91 44 2345 6789" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="info@chennailab.in" /></div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Accreditation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>NABL Number</Label><Input defaultValue="TC-5678" /></div>
                <div className="space-y-2"><Label>Expiry Date</Label><Input type="date" defaultValue="2026-12-31" /></div>
              </div>
              <div className="space-y-2">
                <Label>Upload NABL Certificate</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-6 hover:border-secondary transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><Label>Auto-Booking</Label><p className="text-xs text-muted-foreground">Automatically accept new bookings</p></div><Switch /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Daily Limit</Label><Input type="number" defaultValue="15" /></div>
                <div className="space-y-2"><Label>Weekly Limit</Label><Input type="number" defaultValue="75" /></div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
