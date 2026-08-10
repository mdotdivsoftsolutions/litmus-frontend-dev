import { useState } from "react";
import { Flame, Loader2, Eye, EyeOff } from "lucide-react";
import loginLabImg from "@/assets/login-lab.jpg";
import { authApi } from "@/lib/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface LoginPageProps {
  role?: "admin" | "lab";
}

export default function LoginPage({ role }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<"login" | "forgot" | "reset">("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const userRole = response.data?.user?.role;
      if (userRole === "ADMIN") {
        toast.success("Login successful");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        navigate("/admin/dashboard");
      } else {
        toast.error("Unauthorized access: This portal is for administrators only.");
        // Log them out from backend if necessary, or just don't navigate
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success("Password reset OTP sent to your email");
      setView("reset");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("Please fill all fields");
    
    setIsLoading(true);
    try {
      await authApi.resetPassword({ email, otp, newPassword });
      toast.success("Password reset successful. Please login.");
      setView("login");
      setPassword("");
      setOtp("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — clean light image panel matching Litmus brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden bg-white border-r border-slate-100">
        {/* Top branding */}
        <div className="relative z-10 px-10 pt-8 flex items-center">
          <img src="/logo.png" alt="Litmus Food Analytics" className="h-10 object-contain" />
        </div>

        {/* Headline */}
        <div className="relative z-10 px-10 pt-12 pb-6">
          <h2 className="text-3xl font-light text-secondary/80 leading-snug">
            {role === "admin" ? "Internal Administrator Portal" : role === "lab" ? "Laboratory Partner Portal" : "Safer, Smarter, and Compliant"}
            <br />
            <span className="text-primary font-semibold">{role ? "Access Management" : "Food Solutions"}</span>
          </h2>
          <p className="mt-4 text-slate-500 text-sm max-w-sm">
            Please enter your credentials to access the 
            {role === "admin" ? " specialized management tools." : role === "lab" ? " testing and reports dashboard." : " Litmus food safety platform."}
          </p>
        </div>

        {/* Image fills remaining space */}
        <div className="relative flex-1 mx-6 mb-6 rounded-2xl overflow-hidden shadow-sm">
          <img src={loginLabImg} alt="Food testing laboratory" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex flex-col flex-1 bg-slate-50 px-6 relative h-screen overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center pb-12 pt-12">
          
          {/* Mobile Logo & Title */}
          <div className="lg:hidden flex flex-col items-center mb-8 w-full text-center">
            <img src="/logo.png" alt="Litmus Food Analytics" className="h-10 object-contain mb-6" />
            <h2 className="text-2xl font-light text-secondary/80 leading-snug">
              {role === "admin" ? "Internal Administrator Portal" : role === "lab" ? "Laboratory Partner Portal" : "Safer, Smarter, and Compliant"}
              <br />
              <span className="text-primary font-semibold">{role ? "Access Management" : "Food Solutions"}</span>
            </h2>
          </div>

          <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {view === "login" ? "Sign in to your account" : view === "forgot" ? "Reset your password" : "Create new password"}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {view === "login" ? `Welcome back to the ${role} portal` : view === "forgot" ? "Enter your email to receive a reset OTP" : "Enter the OTP sent to your email and a new password"}
            </p>
          </div>
          
          {view === "login" && (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm ml-auto">
                  <button type="button" onClick={() => setView("forgot")} className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                </button>
              </div>
            </form>
          )}

          {view === "forgot" && (
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="reset-email" className="sr-only">Email address</label>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Enter your registered email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          {view === "reset" && (
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="otp" className="sr-only">OTP</label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="new-password" className="sr-only">New Password</label>
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    placeholder="New Password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-20"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !otp || !newPassword}
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </div>
        </div>

        {/* Footer at the bottom of the right panel */}
        <div className="w-full pb-4 lg:px-8 flex flex-col xl:flex-row items-center justify-between text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Litmus Food Analytics. All rights reserved.</div>
          <div className="flex items-center gap-4 mt-4 xl:mt-0">
            {/* <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a> */}
            <a href="https://www.litmus.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">www.litmus.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
