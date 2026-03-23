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
      {/* Left Panel — image with minimal branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary">
        <img src={loginLabImg} alt="Food testing laboratory" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-transparent to-secondary/80" />

        {/* Top logo */}
        <div className="absolute top-8 left-8 z-10 flex items-center gap-2.5">
          <Flame className="h-7 w-7 text-flame-amber" />
          <div>
            <span className="text-lg font-bold text-white tracking-tight">LITMUS</span>
            <span className="block text-[9px] tracking-[0.25em] text-flame-amber/70 font-medium -mt-0.5">FOOD ANALYTICS</span>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-8 py-6 bg-secondary/80 backdrop-blur-sm border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <span className="block text-xl font-bold text-flame-amber">500+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Tests</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="block text-xl font-bold text-flame-amber">50+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Labs</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="block text-xl font-bold text-flame-amber">10K+</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Reports</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <span className="block text-xl font-bold text-flame-amber">NABL</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Certified</span>
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
