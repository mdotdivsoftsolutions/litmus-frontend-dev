import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSkippable?: boolean;
}

export function AuthModal({ isOpen, onClose, isSkippable = true }: AuthModalProps) {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setStep("login");
      setLoading(false);
      setOtp(["", "", "", ""]);
      setIdentifier("");
      setPassword("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]  p-0 overflow-hidden border-none rounded-2xl shadow-2xl bg-white [&>button:first-child]:hidden">
        <div className="p-8 relative ">
          {/* {isSkippable && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )} */}

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Litmus" className="h-10 object-contain" />
            </div>
            <p className="text-slate-500 text-[15px]">
              {step === "login" ? "Introduce your information to sign in." : "Enter the 4-digit code sent to your mobile."}
            </p>
          </div>

          {step === "login" ? (
            <div className="space-y-6">

              <form onSubmit={handleContinue} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder="Email or phone number"
                    className="h-12 border-slate-200 ring-none focus:ring-none focus:border-none placeholder:text-slate-400"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="h-12 border-slate-200 focus:border-none focus:ring-none pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-start">
                  <button type="button" className="text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors">
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !identifier}
                  className={cn(
                    "w-full h-12 font-bold rounded-lg transition-all",
                    loading || !identifier ? "bg-slate-200 text-slate-400" : "bg-gradient-brand text-white hover:bg-brand-primary/90 shadow-md"
                  )}
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button className="text-brand-primary font-bold hover:underline">Register now</button>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="flex justify-between gap-3 px-4">
                {otp.map((digit, i) => (
                  <Input
                    key={i}
                    id={`otp-${i}`}
                    className="h-12 border-slate-200 focus:border-none focus:ring-none text-center text-2xl font-bold"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                <Button
                  type="submit"
                  disabled={loading || otp.some(d => !d)}
                  className="w-full h-12 bg-gradient-brand text-white font-bold rounded-lg shadow-lg  transition-all"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Proceed"}
                </Button>

                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <button type="button" className="text-brand-primary font-bold hover:underline">Resend OTP</button>
                </p>
              </div>
            </form>
          )}

          <div className="mt-8 text-center px-4">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By proceeding, you agree to our <button className="underline hover:text-slate-600">Terms of Service</button> & <button className="underline hover:text-slate-600">Privacy Policy</button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
