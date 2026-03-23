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
    <div className="flex min-h-screen">
      {/* Left Panel — image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginLabImg} alt="Food testing laboratory" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-secondary/20" />
        <div className="relative z-10 flex flex-col justify-end p-14 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-flame-orange/20 backdrop-blur-sm border border-flame-orange/20">
              <Flame className="h-8 w-8 text-flame-amber" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">LITMUS</h1>
              <p className="text-[10px] tracking-[0.3em] text-flame-amber/80 font-medium">FOOD ANALYTICS</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">
            India's Trusted<br />Food Testing Platform
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            NABL-accredited laboratories. Fast results, transparent pricing, certified reports.
          </p>
          <div className="mt-10 flex gap-10 text-xs">
            <div>
              <span className="block text-3xl font-bold text-flame-amber">500+</span>
              <span className="text-white/50 mt-1 block">Tests</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-flame-amber">50+</span>
              <span className="text-white/50 mt-1 block">Labs</span>
            </div>
            <div>
              <span className="block text-3xl font-bold text-flame-amber">10K+</span>
              <span className="text-white/50 mt-1 block">Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6">
        <Card className="w-full max-w-md shadow-lg border border-border">
          <CardHeader className="items-center pb-2">
            <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
              <Flame className="h-8 w-8 text-flame-orange" />
              <span className="text-xl font-bold text-foreground">LITMUS</span>
            </Link>
            <h2 className="text-xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
            <Tabs value={role} onValueChange={setRole} className="w-full mt-4">
              <TabsList className="w-full bg-muted">
                <TabsTrigger value="user" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User</TabsTrigger>
                <TabsTrigger value="admin" className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">Admin</TabsTrigger>
                <TabsTrigger value="lab" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Lab</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="focus:ring-2 focus:ring-primary/15 focus:border-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10 focus:ring-2 focus:ring-primary/15 focus:border-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary-deep text-primary-foreground" asChild>
              <Link to={roleRedirects[role]}>Sign In</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
