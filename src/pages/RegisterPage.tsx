import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Beaker, CheckCircle2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const stepLabels = ["Business Info", "FSSAI & GST", "Set Password"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardHeader className="items-center pb-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Beaker className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold text-primary">FoodLab</span>
          </Link>
          {/* Step indicator */}
          <div className="flex w-full items-center justify-between">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    i < step ? "bg-status-approved text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:block">{label}</span>
                </div>
                {i < stepLabels.length - 1 && <div className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-status-approved" : "bg-muted")} />}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Business Name</Label><Input placeholder="Kumar Dairy Foods" /></div>
                <div className="space-y-2"><Label>Owner Name</Label><Input placeholder="Rajesh Kumar" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Mobile Number</Label><Input placeholder="+91 98765 43210" /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@company.com" /></div>
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {["Manufacturer", "Trader", "Importer", "Retailer"].map((t) => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Address</Label><Input placeholder="123, Industrial Area" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>City</Label><Input placeholder="Chennai" /></div>
                <div className="space-y-2"><Label>State</Label><Input placeholder="Tamil Nadu" /></div>
                <div className="space-y-2"><Label>PIN Code</Label><Input placeholder="600001" /></div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>FSSAI License Number</Label><Input placeholder="10012345000123" /></div>
                <div className="space-y-2"><Label>FSSAI Expiry Date</Label><Input type="date" /></div>
              </div>
              <div className="space-y-2"><Label>GST Number</Label><Input placeholder="33AABCU9603R1ZM" /></div>
              <div className="space-y-2">
                <Label>Upload FSSAI Certificate</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Upload GST Certificate</Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
                  </div>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-1">
                <div className="flex gap-1">
                  <div className="h-1.5 flex-1 rounded-full bg-status-rejected" />
                  <div className="h-1.5 flex-1 rounded-full bg-status-pending" />
                  <div className="h-1.5 flex-1 rounded-full bg-status-approved" />
                  <div className="h-1.5 flex-1 rounded-full bg-muted" />
                </div>
                <p className="text-xs text-muted-foreground">Password strength: Good</p>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm font-normal">I agree to the <a href="#" className="text-secondary underline">Terms & Conditions</a></Label>
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2">
            {step > 0 && <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>}
            {step < 2 ? (
              <Button className="flex-1" onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button className="flex-1" asChild><Link to="/login">Create Account</Link></Button>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-secondary hover:underline">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
