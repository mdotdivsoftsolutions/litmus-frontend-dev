import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Flame, CheckCircle2, Upload, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const stepLabels = ["Business Info", "FSSAI & GST", "Set Password"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 items-center justify-center bg-gradient-to-br from-[#1C1C1E] via-[#2D1A0A] to-[#3D1F0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-flame-orange rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-flame-amber rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 px-12 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Flame className="h-12 w-12 text-flame-amber" />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-flame-amber">LITMUS</h1>
              <p className="text-xs tracking-[0.2em] text-white/50">FOOD ANALYTICS</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">Create Your Account</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Join thousands of food businesses ensuring FSSAI compliance through accredited laboratory testing.
          </p>
          <div className="mt-10 space-y-3 text-left text-white/60 text-sm">
            {["500+ FSSAI-aligned tests", "NABL accredited laboratories", "Transparent pricing & reports"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-litmus-emerald shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-8">
        <Card className="w-full max-w-lg shadow-lg border border-border">
          <CardHeader className="items-center pb-2">
            <Link to="/" className="flex items-center gap-2 mb-4 lg:hidden">
              <Flame className="h-8 w-8 text-flame-orange" />
              <span className="text-xl font-bold text-foreground">LITMUS</span>
            </Link>
            <h2 className="text-xl font-bold text-foreground">Register Your Business</h2>
            {/* Step indicator */}
            <div className="flex w-full items-center justify-between mt-4">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      i < step ? "bg-litmus-emerald text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className="text-[11px] text-muted-foreground hidden sm:block">{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && <div className={cn("mx-2 h-0.5 flex-1 rounded-full", i < step ? "bg-litmus-emerald" : "bg-muted")} />}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {step === 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-sm font-medium">Business Name</Label><Input placeholder="Kumar Dairy Foods" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">Owner Name</Label><Input placeholder="Rajesh Kumar" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-sm font-medium">Mobile Number</Label><Input placeholder="+91 98765 43210" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">Email</Label><Input type="email" placeholder="you@company.com" /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Business Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {["Manufacturer", "Trader", "Importer", "Retailer"].map((t) => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label className="text-sm font-medium">Address</Label><Input placeholder="123, Industrial Area" /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label className="text-sm font-medium">City</Label><Input placeholder="Chennai" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">State</Label><Input placeholder="Tamil Nadu" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">PIN Code</Label><Input placeholder="600001" /></div>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label className="text-sm font-medium">FSSAI License Number</Label><Input placeholder="10012345000123" /></div>
                  <div className="space-y-2"><Label className="text-sm font-medium">FSSAI Expiry Date</Label><Input type="date" /></div>
                </div>
                <div className="space-y-2"><Label className="text-sm font-medium">GST Number</Label><Input placeholder="33AABCU9603R1ZM" /></div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Upload FSSAI Certificate</Label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
                      <span className="text-xs text-muted-foreground/60">PDF, JPG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Upload GST Certificate</Label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Drag & drop or click to upload</span>
                      <span className="text-xs text-muted-foreground/60">PDF, JPG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2"><Label className="text-sm font-medium">Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    <div className="h-1.5 flex-1 rounded-full bg-status-rejected" />
                    <div className="h-1.5 flex-1 rounded-full bg-flame-amber" />
                    <div className="h-1.5 flex-1 rounded-full bg-litmus-emerald" />
                    <div className="h-1.5 flex-1 rounded-full bg-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground">Password strength: Good</p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm font-normal">I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a></Label>
                </div>
              </>
            )}
            <div className="flex gap-3 pt-2">
              {step > 0 && <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>}
              {step < 2 ? (
                <Button className="flex-1 bg-primary hover:bg-primary-deep" onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button className="flex-1 bg-primary hover:bg-primary-deep" asChild><Link to="/login">Create Account</Link></Button>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
