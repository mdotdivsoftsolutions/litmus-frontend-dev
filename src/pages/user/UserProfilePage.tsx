import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function UserProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">RK</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="gap-2 mb-4"><Upload className="h-3.5 w-3.5" />Change Photo</Button>
            <h3 className="font-semibold text-foreground">Kumar Dairy Foods Pvt. Ltd.</h3>
            <p className="text-sm text-muted-foreground">rajesh@dairyfoods.in</p>
            <p className="text-xs text-muted-foreground mt-2">Member since January 2024</p>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Business Name</Label><Input defaultValue="Kumar Dairy Foods Pvt. Ltd." /></div>
              <div className="space-y-2"><Label>Contact Person</Label><Input defaultValue="Rajesh Kumar" /></div>
              <div className="space-y-2"><Label>Mobile</Label><Input defaultValue="+91 98765 43210" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="rajesh@dairyfoods.in" /></div>
              <div className="space-y-2 col-span-2"><Label>Address</Label><Input defaultValue="123, Industrial Area, Perungudi" /></div>
              <div className="space-y-2"><Label>City</Label><Input defaultValue="Chennai" /></div>
              <div className="space-y-2"><Label>State</Label><Input defaultValue="Tamil Nadu" /></div>
              <div className="space-y-2"><Label>PIN Code</Label><Input defaultValue="600096" /></div>
              <div className="space-y-2"><Label>FSSAI Number</Label><Input defaultValue="10012345000123" /></div>
              <div className="space-y-2"><Label>GST Number</Label><Input defaultValue="33AABCU9603R1ZM" /></div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
