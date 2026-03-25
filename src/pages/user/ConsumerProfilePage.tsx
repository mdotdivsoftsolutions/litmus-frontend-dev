import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, FileText, Check, Clock } from "lucide-react";

export default function ConsumerProfilePage() {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = ["Profile Info", "Documents", "Settings"];
  const tabKeys = ["info", "documents", "settings"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <Avatar className="mx-auto h-20 w-20 ring-4 ring-primary/20">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">RK</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold text-foreground">Kumar Dairy Foods Pvt. Ltd.</h1>
          <p className="text-sm text-muted-foreground">FSSAI: 10012345000123</p>
        </div>
        <Button variant="outline" className="rounded-full" size="sm">Edit Profile</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(tabKeys[i])}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tabKeys[i]
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-accent"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Info */}
      {activeTab === "info" && (
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Rajesh Kumar" className="rounded-lg" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="rajesh@dairyfoods.in" className="rounded-lg" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" className="rounded-lg" /></div>
              <div className="space-y-2"><Label>Business Name</Label><Input defaultValue="Kumar Dairy Foods Pvt. Ltd." className="rounded-lg" /></div>
              <div className="space-y-2"><Label>FSSAI License No.</Label><Input defaultValue="10012345000123" className="rounded-lg" /></div>
              <div className="space-y-2"><Label>City</Label><Input defaultValue="Chennai" className="rounded-lg" /></div>
            </div>
            <Button className="bg-primary hover:bg-primary-deep rounded-lg">Save Changes</Button>
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-accent rounded-2xl p-8 text-center space-y-3 bg-flame-orange-tint/30">
            <Upload className="mx-auto h-10 w-10 text-accent" />
            <p className="font-medium text-foreground">Drop files here or click to upload</p>
            <p className="text-sm text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
            <Button variant="outline" className="rounded-full border-accent text-accent">Choose File</Button>
          </div>

          <div className="space-y-2">
            {[
              { name: "FSSAI License.pdf", type: "License", status: "Verified" },
              { name: "GST Certificate.pdf", type: "Certificate", status: "Verified" },
              { name: "Business PAN.jpg", type: "Identity", status: "Pending" },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <FileText className="h-5 w-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{doc.name}</p>
                  <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                </div>
                <Badge className={doc.status === "Verified" ? "bg-litmus-mint text-litmus-dark border-0 gap-1" : "bg-flame-amber-tint text-accent border-0 gap-1"}>
                  {doc.status === "Verified" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {doc.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <Card className="border border-border rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Notification Preferences</h3>
            <div className="space-y-3 text-sm">
              {["Email notifications", "WhatsApp updates", "SMS alerts"].map((pref) => (
                <label key={pref} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border text-primary" />
                  <span className="text-foreground">{pref}</span>
                </label>
              ))}
            </div>
            <Button className="bg-primary hover:bg-primary-deep rounded-lg mt-4">Save Preferences</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
