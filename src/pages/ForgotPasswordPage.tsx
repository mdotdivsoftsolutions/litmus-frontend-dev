import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Flame, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader className="items-center pb-2">
          <Flame className="h-8 w-8 text-flame-orange mb-2" />
          <h2 className="text-xl font-bold text-foreground">
            {step === 0 ? "Forgot Password" : step === 1 ? "Enter OTP" : "Reset Password"}
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            {step === 0 ? "Enter your email to receive an OTP" : step === 1 ? "We sent a 6-digit code to your email" : "Set your new password"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {step === 0 && (
            <>
              <div className="space-y-2"><Label className="text-sm font-medium">Email</Label><Input type="email" placeholder="you@company.com" className="focus:border-primary focus:ring-2 focus:ring-primary/15" /></div>
              <Button className="w-full bg-primary hover:bg-primary-deep" onClick={() => setStep(1)}>Send OTP</Button>
            </>
          )}
          {step === 1 && (
            <>
              <div className="flex justify-center">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button className="w-full bg-primary hover:bg-primary-deep" onClick={() => setStep(2)}>Verify OTP</Button>
              <p className="text-center text-xs text-muted-foreground">Didn't receive code? <button className="text-primary hover:underline font-medium">Resend</button></p>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-2"><Label className="text-sm font-medium">New Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-2"><Label className="text-sm font-medium">Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
              <Button className="w-full bg-primary hover:bg-primary-deep" asChild><Link to="/login">Reset Password</Link></Button>
            </>
          )}
          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
              <ArrowLeft className="h-3.5 w-3.5" />Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
