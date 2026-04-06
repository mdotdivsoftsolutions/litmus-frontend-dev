import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles, Phone, HeadphonesIcon, HelpCircle, Activity, Heart, ShieldCheck, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FloatingSupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Clinical assistance active. How can I help you with your diagnostic requirements today?", sender: "bot", time: "10:02 AM" }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newUserMsg = { id: Date.now(), text: message, sender: "user", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newUserMsg]);
    setMessage("");

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Analyzing query. A certified Litmus pathologist will connect with you within 2 minutes for professional consultation.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-manrope">
      {/* 1. CINEMATIC GLOWING TRIGGER */}
      <div className="relative">
        {/* Animated Rings */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 bg-[#D32F2F] rounded-full animate-ping opacity-20 scale-150 pointer-events-none" />
            <div className="absolute inset-0 bg-[#feba50] rounded-full animate-pulse opacity-10 scale-125 pointer-events-none" />
          </>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-12 w-12 rounded-full shadow-[0_20px_50px_rgba(211,47,47,0.4)] flex items-center justify-center transition-all duration-700 hover:scale-105 active:scale-95 group relative border-0 overflow-hidden",
            isOpen ? "bg-slate-950 rotate-180" : "bg-gradient-to-br from-[#D32F2F] to-[#feba50]"
          )}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isOpen ? (
            <X className="h-7 w-7 text-white" />
          ) : (
            <div className="relative">
               <MessageSquare className="h-5 w-5 text-white fill-white/20" />
               <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* 2. PREMIUM CHAT WINDOW (Glassmorphism) */}
      <div 
        className={cn(
          "absolute bottom-20 right-0 w-[360px] sm:w-[400px] transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform origin-bottom-right z-50",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-20 pointer-events-none"
        )}
      >
        <Card className="rounded-3xl border border-slate-200/50 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[500px] max-h-[75vh]">
          {/* Clinical Header */}
          <CardHeader className="bg-slate-950 p-8 relative overflow-hidden shrink-0">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#D32F2F]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-xl group-hover:bg-white/20 transition-all">
                      <HeadphonesIcon className="h-7 w-7 text-[#feba50]" />
                   </div>
                   <div className="space-y-0.5">
                      <CardTitle className="text-white text-xl font-bold tracking-tighter">Clinical Intelligence</CardTitle>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse outline outline-4 outline-emerald-500/20" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Safety Desk Live</span>
                      </div>
                   </div>
                </div>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/40">
                   <ShieldCheck className="h-5 w-5" />
                </div>
             </div>
          </CardHeader>

          {/* Diagnostic Messages */}
          <CardContent 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 bg-transparent scrollbar-hide"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-2",
                  msg.sender === "user" ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "flex items-center gap-2 px-2",
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                   <div className={cn(
                     "h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold",
                     msg.sender === "user" ? "bg-slate-900 text-white" : "bg-[#D32F2F]/10 text-[#D32F2F]"
                   )}>
                      {msg.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Activity className="h-3.5 w-3.5" />}
                   </div>
                   <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{msg.sender === "user" ? "Client" : "Pathologist AI"}</span>
                </div>
                
                <div className={cn(
                  "p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm relative group/msg",
                  msg.sender === "user" 
                    ? "bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-tr-none border border-slate-700" 
                    : "bg-white text-slate-600 rounded-tl-none border border-slate-100"
                )}>
                  {msg.text}
                  {msg.sender === "bot" && (
                     <div className="absolute -right-2 top-0 h-4 w-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
                  )}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4">{msg.time}</p>
              </div>
            ))}
          </CardContent>

          {/* Professional Input Section */}
          <CardFooter className="p-5 bg-slate-50/80 border-t border-slate-100 backdrop-blur-xl shrink-0">
            <form onSubmit={handleSend} className="w-full space-y-4">
              <div className="flex items-center gap-3">
                 <div className="flex-1 relative">
                    <Input
                      placeholder="Consult with our experts..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-14 rounded-2xl border-slate-100 bg-white/80 focus-visible:ring-[#D32F2F] text-sm font-medium pr-12 shadow-inner"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Waves className="h-4 w-4 text-slate-200 animate-pulse" />
                    </div>
                 </div>
                 <Button 
                   type="submit" 
                   className="h-14 px-6 rounded-2xl bg-gradient-to-br from-[#D32F2F] to-[#feba50] shadow-[0_12px_24px_rgba(211,47,47,0.3)] hover:shadow-[#D32F2F]/40 transition-all active:scale-95 border-0 text-white font-bold"
                 >
                   <Send className="h-5 w-5" />
                 </Button>
              </div>
              <div className="flex items-center justify-center gap-6">
                 {[
                   { icon: Phone, label: "Call Lab" },
                   { icon: HelpCircle, label: "Safety Docs" },
                   { icon: Heart, label: "Symptom Check" }
                 ].map((act, i) => (
                    <button key={i} className="flex items-center gap-1.5 text-slate-400 hover:text-[#D32F2F] transition-colors group/act">
                       <act.icon className="h-3.5 w-3.5 group-hover/act:scale-110 transition-transform" />
                       <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{act.label}</span>
                    </button>
                 ))}
              </div>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
