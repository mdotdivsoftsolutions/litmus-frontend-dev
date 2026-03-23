import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Eye, EyeOff } from "lucide-react";
import loginLabImg from "@/assets/login-lab.jpg";

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roleRedirects: Record<string, string> = { user: "/dashboard", admin: "/admin/dashboard", lab: "/lab/dashboard" };

  return (
    <div className="flex min-h-screen bg-[#0D0D0D]">
      {/* Left Panel — image with dark overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginLabImg} alt="Food testing laboratory" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0D0D]/80" />
        <div className="relative z-10 flex flex-col justify-end p-14 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-flame-orange/20 backdrop-blur-sm border border-flame-orange/20">
              <Flame className="h-8 w-8 text-flame-amber" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">LITMUS</h1>
              <p className="text-[10px] tracking-[0.3em] text-flame-amber/80 font-medium">FOOD ANALYTICS</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 leading-tight text-white">
            India's Trusted<br />Food Testing Platform
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            NABL-accredited laboratories. Fast results, transparent pricing, certified reports.
          </p>
          <div className="mt-10 flex gap-10 text-xs">
            <div>
              <span className="block text-3xl font-bold text-flame-amber">500+</span>
              <span className="text-white/40 mt-1 block">Tests</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-flame-amber">50+</span>
              <span className="text-white/40 mt-1 block">Labs</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-flame-amber">10K+</span>
              <span className="text-white/40 mt-1 block">Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — dark form */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden justify-center">
            <Flame className="h-8 w-8 text-flame-orange" />
            <span className="text-xl font-bold text-white">LITMUS</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-white/40">Sign in to your account to continue</p>
          </div>

          <Tabs value={role} onValueChange={setRole} className="w-full mb-8">
            <TabsList className="w-full bg-white/5 border border-white/10 h-11">
              <TabsTrigger value="user" className="flex-1 text-white/50 data-[state=active]:bg-flame-orange data-[state=active]:text-white data-[state=active]:shadow-lg">User</TabsTrigger>
              <TabsTrigger value="admin" className="flex-1 text-white/50 data-[state=active]:bg-flame-orange data-[state=active]:text-white data-[state=active]:shadow-lg">Admin</TabsTrigger>
              <TabsTrigger value="lab" className="flex-1 text-white/50 data-[state=active]:bg-flame-orange data-[state=active]:text-white data-[state=active]:shadow-lg">Lab</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/70">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-11 focus:ring-2 focus:ring-flame-orange/30 focus:border-flame-orange/50"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-white/70">Password</Label>
                <Link to="/forgot-password" className="text-xs text-flame-amber hover:text-flame-orange font-medium transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 h-11 focus:ring-2 focus:ring-flame-orange/30 focus:border-flame-orange/50"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full h-11 bg-flame-orange hover:bg-flame-red text-white font-semibold shadow-lg shadow-flame-orange/20 transition-all" asChild>
              <Link to={roleRedirects[role]}>Sign In</Link>
            </Button>
            <p className="text-center text-sm text-white/40">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-flame-amber hover:text-flame-orange transition-colors">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
