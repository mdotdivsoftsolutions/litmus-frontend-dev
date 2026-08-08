import { useState } from "react";
import { Flame, Loader2 } from "lucide-react";
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

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — clean light image panel matching Litmus brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden bg-white border-r border-slate-100">
        {/* Top branding */}
        <div className="relative z-10 px-10 pt-8 flex items-center gap-2.5">
          <Flame className="h-7 w-7 text-primary" />
          <div>
            <span className="text-lg font-bold text-secondary tracking-tight">litmus</span>
            <span className="block text-[9px] tracking-[0.2em] text-primary font-medium -mt-0.5 uppercase">Food Analytics</span>
          </div>
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
      <div className="flex flex-1 items-center justify-center bg-background px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back to the {role} portal
            </p>
          </div>
          
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
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  placeholder="Password"
                />
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
        </div>
      </div>
    </div>
  );
}
