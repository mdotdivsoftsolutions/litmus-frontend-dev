import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Beaker } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="items-center pb-2">
          <Beaker className="h-8 w-8 text-secondary mb-2" />
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
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@company.com" /></div>
              <Button className="w-full" onClick={() => setStep(1)}>Send OTP</Button>
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
              <Button className="w-full" onClick={() => setStep(2)}>Verify OTP</Button>
              <p className="text-center text-xs text-muted-foreground">Didn't receive code? <button className="text-secondary hover:underline">Resend</button></p>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
              <Button className="w-full" asChild><Link to="/login">Reset Password</Link></Button>
            </>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-secondary hover:underline">Back to Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
