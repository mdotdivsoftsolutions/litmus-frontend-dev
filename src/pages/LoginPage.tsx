import { LoginSection } from "@/components/auth/LoginSection";
import { Flame } from "lucide-react";
import loginLabImg from "@/assets/login-lab.jpg";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — clean light image panel matching Litmus brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden bg-white">
        {/* Top branding */}
        <div className="relative z-10 px-10 pt-8 flex items-center gap-2.5">
          <Flame className="h-7 w-7 text-primary" />
          <div>
            <span className="text-lg font-bold text-secondary tracking-tight">litmus</span>
            <span className="block text-[9px] tracking-[0.2em] text-primary font-medium -mt-0.5">Food Analytics</span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 px-10 pt-12 pb-6">
          <h2 className="text-3xl font-light text-secondary/80 leading-snug">
            Safer, Smarter, and<br />
            Compliant <span className="text-primary font-semibold">Food Solutions</span>
          </h2>
        </div>

        {/* Image fills remaining space */}
        <div className="relative flex-1 mx-6 mb-6 rounded-2xl overflow-hidden">
          <img src={loginLabImg} alt="Food testing laboratory" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex flex-1 items-center justify-center bg-background px-6">
        <LoginSection showLogo />
      </div>
    </div>
  );
}

