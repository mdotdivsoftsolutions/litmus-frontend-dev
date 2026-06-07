import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft, User, Mail, Phone, Lock, KeyRound, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Step = "login" | "register" | "otp" | "forgot" | "forgot-otp" | "reset-password" | "reset-success";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSkippable?: boolean;
}

export function AuthModal({ isOpen, onClose, isSkippable = true }: AuthModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirm, setShowNewConfirm] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Forgot password fields
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  // ── API Mutations ──────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success("Welcome back!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  });

  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: () => {
      toast.success("OTP sent to your email!");
      setStep("otp");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  });

  // ── Handlers ──────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email: identifier, password });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) return;

    // Split full name into first and last name
    const nameParts = regName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    sendOtpMutation.mutate({ email: regEmail });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) return;
    
    // Split full name into first and last name
    const nameParts = regName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    registerMutation.mutate({
      firstName,
      lastName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: "USER" as any,
      otp: otpCode
    });
  };

  const handleForgotSend = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("forgot-otp"); }, 1200);
  };

  const handleForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("reset-password"); }, 1200);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newConfirmPassword) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("reset-success"); }, 1200);
  };

  const handleOtpChange = (index: number, value: string, prefix = "otp") => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`${prefix}-${index + 1}`)?.focus();
  };

  // Reset all state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep("login");
      setLoading(false);
      setOtp(["", "", "", "", "", ""]);
      setIdentifier(""); setPassword("");
      setRegName(""); setRegEmail(""); setRegPhone("");
      setRegPassword(""); setRegConfirmPassword("");
      setForgotIdentifier(""); setNewPassword(""); setNewConfirmPassword("");
      setShowPassword(false); setShowConfirmPassword(false);
      setShowNewPassword(false); setShowNewConfirm(false);
    }
  }, [isOpen]);

  // ── Subtitle per step ────────────────────────────────────────
  const subtitles: Record<Step, string> = {
    login: "Welcome back! Sign in to continue.",
    register: "Create your account to get started.",
    otp: "Enter the 6-digit code sent to your email.",
    forgot: "Enter your registered email or phone number.",
    "forgot-otp": "Enter the 6-digit code sent to your account.",
    "reset-password": "Set a new strong password for your account.",
    "reset-success": "",
  };

  // ── Back arrow target per step ───────────────────────────────
  const backTarget: Partial<Record<Step, Step>> = {
    register: "login",
    otp: "login",
    forgot: "login",
    "forgot-otp": "forgot",
    "reset-password": "forgot",
  };

  const showBack = step !== "login" && step !== "reset-success";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl bg-white [&>button:first-child]:hidden">
        <div className="p-8 relative">

          {/* Back arrow */}
          {showBack && (
            <button
              onClick={() => setStep(backTarget[step] ?? "login")}
              className="absolute top-5 left-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          {/* Logo + subtitle */}
          {step !== "reset-success" && (
            <div className="flex flex-col items-center mb-7">
              <img src="/logo.png" alt="Litmus" className="h-10 object-contain mb-5" />
              <p className="text-slate-500 text-[14px] text-center">{subtitles[step]}</p>
            </div>
          )}

          {/* ══════════ LOGIN ══════════ */}
          {step === "login" && (
            <div className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="text" placeholder="Email or phone number"
                    className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
                    value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter password"
                    className="h-12 pl-10 pr-10 border-slate-200"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setStep("forgot")}
                    className="text-xs font-semibold text-slate-500 hover:text-brand-primary transition-colors">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" disabled={loginMutation.isPending || !identifier || !password}
                  className={cn("w-full h-12 font-bold rounded-lg transition-all",
                    loginMutation.isPending || !identifier || !password
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-brand text-white hover:opacity-90 shadow-md")}>
                  {loginMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <button onClick={() => setStep("register")} className="text-brand-primary font-bold hover:underline">
                  Register now
                </button>
              </p>
            </div>
          )}

          {/* ══════════ REGISTER ══════════ */}
          {step === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="text" placeholder="Full name"
                  className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
                  value={regName} onChange={(e) => setRegName(e.target.value)} required />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="email" placeholder="Email address"
                  className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
                  value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="tel" placeholder="Mobile number"
                  className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
                  value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type={showPassword ? "text" : "password"} placeholder="Create password"
                  className="h-12 pl-10 pr-10 border-slate-200"
                  value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password"
                  className={cn("h-12 pl-10 pr-10 border-slate-200",
                    regConfirmPassword && regPassword !== regConfirmPassword && "border-red-400")}
                  value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {regConfirmPassword && regPassword !== regConfirmPassword && (
                <p className="text-xs text-red-500 -mt-2">Passwords do not match</p>
              )}

              <Button type="submit"
                disabled={sendOtpMutation.isPending || !regName || !regEmail || !regPhone || !regPassword || regPassword !== regConfirmPassword}
                className={cn("w-full h-12 font-bold rounded-lg transition-all",
                  sendOtpMutation.isPending || !regName || !regEmail || !regPhone || !regPassword || regPassword !== regConfirmPassword
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-brand text-white hover:opacity-90 shadow-md")}>
                {sendOtpMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <button type="button" onClick={() => setStep("login")} className="text-brand-primary font-bold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ══════════ OTP (login / register) ══════════ */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-8">
              <div className="flex justify-between gap-3 px-4">
                {otp.map((digit, i) => (
                  <Input key={i} id={`otp-${i}`}
                    className="h-12 border-slate-200 text-center text-2xl font-bold"
                    value={digit} maxLength={1}
                    onChange={(e) => handleOtpChange(i, e.target.value, "otp")}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !digit && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }} />
                ))}
              </div>
              <div className="text-center space-y-4">
                <Button type="submit" disabled={registerMutation.isPending || otp.some((d) => !d)}
                  className="w-full h-12 bg-gradient-brand text-white font-bold rounded-lg shadow-lg transition-all">
                  {registerMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Proceed"}
                </Button>
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <button type="button" onClick={() => sendOtpMutation.mutate({ email: regEmail })} className="text-brand-primary font-bold hover:underline">Resend OTP</button>
                </p>
              </div>
            </form>
          )}

          {/* ══════════ FORGOT PASSWORD — Enter email/phone ══════════ */}
          {step === "forgot" && (
            <form onSubmit={handleForgotSend} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type="text" placeholder="Email or phone number"
                  className="h-12 pl-10 border-slate-200 placeholder:text-slate-400"
                  value={forgotIdentifier} onChange={(e) => setForgotIdentifier(e.target.value)} required />
              </div>

              <Button type="submit" disabled={loading || !forgotIdentifier}
                className={cn("w-full h-12 font-bold rounded-lg transition-all",
                  loading || !forgotIdentifier
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-brand text-white hover:opacity-90 shadow-md")}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Code"}
              </Button>

              <p className="text-center text-sm text-slate-500">
                Remember your password?{" "}
                <button type="button" onClick={() => setStep("login")} className="text-brand-primary font-bold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ══════════ FORGOT OTP ══════════ */}
          {step === "forgot-otp" && (
            <form onSubmit={handleForgotOtp} className="space-y-8">
              <div className="flex justify-between gap-3 px-4">
                {otp.map((digit, i) => (
                  <Input key={i} id={`fotp-${i}`}
                    className="h-12 border-slate-200 text-center text-2xl font-bold"
                    value={digit} maxLength={1}
                    onChange={(e) => handleOtpChange(i, e.target.value, "fotp")}
                    onKeyDown={(e) => { if (e.key === "Backspace" && !digit && i > 0) document.getElementById(`fotp-${i - 1}`)?.focus(); }} />
                ))}
              </div>
              <div className="text-center space-y-4">
                <Button type="submit" disabled={loading || otp.some((d) => !d)}
                  className="w-full h-12 bg-gradient-brand text-white font-bold rounded-lg shadow-lg transition-all">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Code"}
                </Button>
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <button type="button" className="text-brand-primary font-bold hover:underline">Resend OTP</button>
                </p>
              </div>
            </form>
          )}

          {/* ══════════ RESET PASSWORD ══════════ */}
          {step === "reset-password" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type={showNewPassword ? "text" : "password"} placeholder="New password"
                  className="h-12 pl-10 pr-10 border-slate-200"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input type={showNewConfirm ? "text" : "password"} placeholder="Confirm new password"
                  className={cn("h-12 pl-10 pr-10 border-slate-200",
                    newConfirmPassword && newPassword !== newConfirmPassword && "border-red-400")}
                  value={newConfirmPassword} onChange={(e) => setNewConfirmPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowNewConfirm(!showNewConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showNewConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {newConfirmPassword && newPassword !== newConfirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}

              <Button type="submit"
                disabled={loading || !newPassword || newPassword !== newConfirmPassword}
                className={cn("w-full h-12 font-bold rounded-lg transition-all",
                  loading || !newPassword || newPassword !== newConfirmPassword
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-brand text-white hover:opacity-90 shadow-md")}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
              </Button>
            </form>
          )}

          {/* ══════════ RESET SUCCESS ══════════ */}
          {step === "reset-success" && (
            <div className="flex flex-col items-center text-center py-6 gap-5">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9 text-green-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">Password Reset!</h3>
                <p className="text-sm text-slate-500">Your password has been updated successfully.</p>
              </div>
              <Button onClick={() => setStep("login")}
                className="w-full h-12 bg-gradient-brand text-white font-bold rounded-lg shadow-md hover:opacity-90 transition-all">
                Back to Sign In
              </Button>
            </div>
          )}

          {/* Footer T&C — hide on success */}
          {step !== "reset-success" && (
            <div className="mt-7 text-center px-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                By proceeding, you agree to our{" "}
                <button className="underline hover:text-slate-600">Terms of Service</button>{" "}
                &{" "}
                <button className="underline hover:text-slate-600">Privacy Policy</button>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
