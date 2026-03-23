import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Beaker } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleRedirects: Record<string, string> = { user: "/dashboard", admin: "/admin/dashboard", lab: "/lab/dashboard" };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="items-center pb-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Beaker className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold text-primary">FoodLab</span>
          </Link>
          <Tabs value={role} onValueChange={setRole} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="user" className="flex-1">User</TabsTrigger>
              <TabsTrigger value="admin" className="flex-1">Admin</TabsTrigger>
              <TabsTrigger value="lab" className="flex-1">Lab</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-secondary hover:underline">Forgot Password?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" asChild>
            <Link to={roleRedirects[role]}>Login</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-secondary hover:underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
