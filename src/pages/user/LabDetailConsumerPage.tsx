import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Phone, Mail, ShoppingCart, Shield, Clock, FileText, CheckCircle2, ChevronRight, Share2, Heart, Activity, ArrowRight, Microscope, FlaskConical, Award, Zap, Target, Quote, TrendingUp } from "lucide-react";
import { laboratories, tests as allTests } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

export default function LabDetailConsumerPage() {
   const { id } = useParams();
   const lab = laboratories.find((l) => l.id === id) || laboratories[0];

   return (
      <div className="animate-fade-in font-manrope min-h-screen bg-white pb-20">
         {/* 1. PROFESSIONAL LAB HERO */}
         <section className="relative pt-12 pb-12 bg-slate-50 border-b border-slate-100 overflow-hidden">
            {/* Cinematic Backdrop */}
            <div className="absolute top-0 right-0 w-[45%] h-full bg-white skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
               <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                  <div className="h-28 w-28 rounded-[2rem] bg-white shadow-xl border border-slate-100 flex items-center justify-center font-bold text-2xl text-[#D32F2F] shrink-0 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
                     {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>

                  <div className="flex-1 space-y-4">
                     <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-slate-900 border-0 text-[10px] uppercase font-semibold tracking-widest px-3 h-6">Verified Facility</Badge>
                        {lab.nabl && <Badge className="bg-[#D32F2F] border-0 text-[10px] uppercase font-semibold tracking-widest px-3 h-6">NABL Accredited</Badge>}
                        <div className="flex items-center gap-1.5 px-3 h-6 rounded-full bg-white border border-slate-200">
                           <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                           <span className="text-[10px] font-semibold text-slate-700">{lab.rating} Rating</span>
                        </div>
                     </div>

                     <h1 className="text-4xl lg:text-4xl font-semibold text-slate-800 tracking-tight leading-tight">
                        {lab.name}
                     </h1>

                     <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                           <MapPin className="h-4 w-4 text-[#D32F2F]" />
                           <span>{lab.city}, India</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="h-4 w-4 text-emerald-500" />
                           <span className="text-emerald-600 font-semibold tracking-tight">Open for Samples</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-[#D32F2F] shadow-sm">
                        <Share2 className="h-5 w-5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 shadow-sm">
                        <Heart className="h-5 w-5" />
                     </Button>
                  </div>
               </div>
            </div>
         </section>

         {/* 2. TABBED INFORMATION SYSTEM */}
         <div className="max-w-7xl mx-auto px-6 pt-10">
            <Tabs defaultValue="tests" className="space-y-5">
               <TabsList className="bg-white border-b border-slate-100 w-full justify-start h-auto p-0 gap-4 rounded-none sticky top-24 z-20">
                  {["Tests", "Overview", "Facility Info", "Reviews"].map((tab) => (
                     <TabsTrigger
                        key={tab}
                        value={tab.toLowerCase().split(' ')[0]}
                        className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-none border-b-2 border-transparent data-[state=active]:border-[#D32F2F] data-[state=active]:text-slate-800 text-slate-400 hover:text-slate-600 bg-transparent"
                     >
                        {tab}
                     </TabsTrigger>
                  ))}
               </TabsList>

               <div className="grid lg:grid-cols-3 gap-12 pt-4">
                  <div className="lg:col-span-2 space-y-12">
                     <TabsContent value="tests" className="space-y-6 mt-0 animate-slide-up">
                        <div className="flex flex-col md:flex-row md:items-end justify-between ">
                           <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
                              Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Panels & Pricing.</span>
                           </h2>
                           <Badge variant="outline" className="rounded-xl px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#D32F2F] border-[#D32F2F]/20 h-10 flex items-center justify-center">{allTests.length} Items Listed</Badge>
                        </div>

                        <div className="grid gap-4">
                           {allTests.map((test) => (
                              <div key={test.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-white border border-slate-100 hover:border-[#D32F2F]/20 hover:shadow-[0_24px_48px_rgba(0,0,0,0.03)] transition-all duration-300">
                                 <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#D32F2F]/5 group-hover:border-[#D32F2F]/10 transition-colors">
                                    <Activity className="h-6 w-6 text-slate-400 group-hover:text-[#D32F2F] transition-colors" />
                                 </div>
                                 <div className="flex-1 space-y-2">
                                    <p className="font-semibold text-slate-800 text-lg tracking-tight group-hover:text-[#D32F2F] transition-colors">{test.name}</p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                       <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Method: {test.method}</span>
                                       <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">TAT: 3-5 Working Days</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-8">
                                    <div className="text-right">
                                       <p className="text-xs text-slate-300 line-through font-bold">₹1,800</p>
                                       <p className="text-xl font-bold text-slate-800 tracking-tighter">₹1,200</p>
                                    </div>
                                    <Button className="bg-gradient-to-r from-[#D32F2F] to-[#feba50] hover:shadow-[0_12px_24px_rgba(211,47,47,0.25)] text-white font-semibold text-xs rounded-xl h-11 px-8 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 border-0">
                                       <ShoppingCart className="h-4 w-4" /> Book Now
                                    </Button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </TabsContent>

                     <TabsContent value="overview" className="mt-0 animate-slide-up space-y-10">
                        <div className="space-y-6 text-area-professional">
                           <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
                              Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Excellence.</span>
                           </h2>
                           <p className="text-slate-500 font-medium leading-relaxed text-lg">
                              {lab.name} stands as a cornerstone of diagnostic excellence in {lab.city}. With a legacy of precision testing spans over a decade, we provide critical nutritional and safety analytics to enterprise food brands and producers.
                           </p>
                           <div className="grid sm:grid-cols-3 gap-6 pt-6">
                              {[
                                 { label: "Tests Conducted", val: "1.2M+" },
                                 { label: "Accuracy Rate", val: "99.98%" },
                                 { label: "Scientists", val: "42+" },
                              ].map((stat, i) => (
                                 <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-800 tracking-tighter">{stat.val}</p>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-5 hover:border-[#D32F2F]/20 transition-all shadow-sm">
                              <div className="h-12 w-12 rounded-2xl bg-[#D32F2F]/5 flex items-center justify-center shrink-0">
                                 <Shield className="h-6 w-6 text-[#D32F2F]" />
                              </div>
                              <div className="space-y-2">
                                 <p className="text-lg font-semibold text-slate-800 tracking-tight">FSSAI Protocol Compliance</p>
                                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Our clinical workflows are strictly mapped to FSSAI 2024 revised testing standards.</p>
                              </div>
                           </div>
                           <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 flex items-start gap-5 hover:border-blue-200 transition-all shadow-sm">
                              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                 <Award className="h-6 w-6 text-blue-500" />
                              </div>
                              <div className="space-y-2">
                                 <p className="text-lg font-semibold text-slate-800 tracking-tight">ISO 17025 Accreditation</p>
                                 <p className="text-sm text-slate-500 font-medium leading-relaxed">Globally recognized quality management systems ensuring result legal validity.</p>
                              </div>
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="facility" className="mt-0 animate-slide-up space-y-12">
                        <div className="space-y-8">
                           <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
                              Infrastructure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">& Logistics.</span>
                           </h2>
                           <div className="grid sm:grid-cols-2 gap-6">
                              {[
                                 { icon: Microscope, title: "Advanced HPLC Systems", desc: "For high-precision chemical and nutritional profiling." },
                                 { icon: FlaskConical, title: "Microbial Incubators", desc: "State-of-the-art pathogen detection and shelf stability." },
                                 { icon: Clock, title: "Sub-Zero Storage", desc: "Certified cold-chain inventory for sensitive samples." },
                                 { icon: Shield, title: "Automated Reporting", desc: "Digital verification pipeline with zero manual entry errors." },
                              ].map((item, i) => (
                                 <div key={i} className="group p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all duration-500">
                                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#D32F2F] group-hover:scale-110 transition-transform">
                                       <item.icon className="h-6 w-6" />
                                    </div>
                                    <div className="mt-6 space-y-2">
                                       <p className="font-semibold text-slate-800 tracking-tight">{item.title}</p>
                                       <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="reviews" className="mt-0 animate-slide-up space-y-12">
                        <div className="space-y-10">
                           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                              <h2 className="text-3xl lg:text-2xl font-semibold text-slate-800 tracking-tight leading-tight">
                                 Institutional <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Reviews.</span>
                              </h2>
                              <div className="flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                                 <TrendingUp className="h-4 w-4 text-emerald-500" />
                                 <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Top Rated Safety Partner</span>
                              </div>
                           </div>

                           <div className="grid md:grid-cols-12 gap-8 items-stretch">
                              {/* Glowing Large Rating */}
                              <div className="md:col-span-4 relative rounded-[2.5rem] bg-slate-900 p-8 flex flex-col items-center justify-center text-center overflow-hidden group shadow-2xl">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#D32F2F]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                                 <div className="relative z-10 space-y-4">
                                    <p className="text-6xl font-bold text-white tracking-tighter">4.9</p>
                                    <div className="flex items-center justify-center gap-1.5">
                                       {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[#feba50] text-[#feba50]" />)}
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">1.2k Verified Audits</p>
                                       <p className="text-[10px] text-white/40 font-medium">Updated 2h ago</p>
                                    </div>
                                 </div>
                              </div>

                              {/* Detailed Bar Distribution */}
                              <div className="md:col-span-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 p-10 flex flex-col justify-center space-y-4 shadow-sm">
                                 {[85, 10, 3, 1, 1].map((p, i) => (
                                    <div key={i} className="flex items-center gap-6 group/bar">
                                       <span className="text-[10px] font-bold text-slate-400 min-w-[50px] uppercase tracking-widest">{5 - i} Stars</span>
                                       <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full group-hover/bar:from-[#D32F2F] group-hover/bar:to-[#feba50] transition-all duration-500" 
                                            style={{ width: `${p}%` }} 
                                          />
                                       </div>
                                       <span className="text-[10px] font-bold text-slate-500 min-w-[30px] text-right">{p}%</span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="grid sm:grid-cols-2 gap-6 pb-4">
                              {[
                                 { 
                                    name: "Rahul Srivastava", 
                                    role: "Dairy Quality Manager",
                                    rating: 5, 
                                    date: "2 days ago", 
                                    comment: "Remarkable turnaround for our export dairy samples. The depth of the FSSAI compliance report was beyond our internal laboratory's capability. Highly recommended for safety verification.",
                                    verified: true
                                 },
                                 { 
                                    name: "Ananya Mehtre", 
                                    role: "Organic Exports Lead",
                                    rating: 5, 
                                    date: "1 week ago", 
                                    comment: "The NABL e-reports were automatically imported into our compliance dashboard. Zero manual errors and clean digital trails. This lab is a true technical partner.",
                                    verified: true
                                 },
                                 { 
                                    name: "Vikram Panicker", 
                                    role: "Food Startup Founder",
                                    rating: 4, 
                                    date: "2 weeks ago", 
                                    comment: "Modern facility and transparent pricing. The shelf-life stability tests were conducted using the latest micro-analyzers. A few delays in logistics but results were sharp.",
                                    verified: false
                                 },
                                 { 
                                    name: "Sneha Reddy", 
                                    role: "HORECA Consultant",
                                    rating: 5, 
                                    date: "1 month ago", 
                                    comment: "Clinical-grade precision for pathogen screening. We use this lab for all our high-tier client audits across Bangalore.",
                                    verified: true
                                 }
                              ].map((rev, i) => (
                                 <Card key={i} className="group relative border border-slate-100 rounded-[2rem] shadow-sm hover:border-[#D32F2F]/20 hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                       <Quote className="h-20 w-20 text-[#D32F2F]" />
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                       <div className="flex items-start justify-between relative z-10">
                                          <div className="flex items-center gap-4">
                                             <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-[#D32F2F]/20 group-hover:bg-slate-100 transition-all">
                                                <img src={`https://i.pravatar.cc/150?u=${rev.name}`} className="h-full w-full object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500" alt={rev.name} />
                                             </div>
                                             <div>
                                                <div className="flex items-center gap-2">
                                                   <p className="font-bold text-slate-800 tracking-tight">{rev.name}</p>
                                                   {rev.verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 border-b border-slate-100 inline-block uppercase tracking-widest">{rev.role}</p>
                                             </div>
                                          </div>
                                          <div className="flex items-center gap-0.5">
                                             {[...Array(rev.rating)].map((_, j) => <Star key={j} className="h-3 w-3 fill-[#feba50] text-[#feba50]" />)}
                                          </div>
                                       </div>
                                       <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 italic">
                                          "{rev.comment}"
                                       </p>
                                       <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                                          <Badge className="bg-slate-50 border-0 text-[10px] font-bold text-slate-400 px-3 uppercase tracking-widest">NABL Verified</Badge>
                                          <p className="text-[10px] text-slate-300 font-bold">{rev.date}</p>
                                       </div>
                                    </CardContent>
                                 </Card>
                              ))}
                           </div>
                        </div>
                     </TabsContent>
                  </div>

                  {/* Sidebar Information */}
                  <div className="space-y-8">
                     <Card className="rounded-[2.5rem] border-2 border-slate-50 bg-white p-8 shadow-sm">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-[#D32F2F]/5 flex items-center justify-center">
                                 <MapPin className="h-5 w-5 text-[#D32F2F]" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Lab Location</p>
                                 <p className="text-sm font-semibold text-slate-800">{lab.city}, India</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                 <Phone className="h-5 w-5 text-emerald-500" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Direct Sample Support</p>
                                 <p className="text-sm font-semibold text-slate-800">+91 1800 248 8342</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                 <Mail className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Administrative Email</p>
                                 <p className="text-sm font-semibold text-slate-800">info@{lab.name.toLowerCase().replace(/\s+/g, "")}.ai</p>
                              </div>
                           </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50">
                           <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-widest mb-6">Service Area & Logistics</h4>
                           <div className="space-y-4">
                              {[
                                 "Standard Sample Pickup Available",
                                 "Express Courier Partnership",
                                 "Cold-Chain Logistics Support",
                                 "International Export Samples"
                              ].map((s, i) => (
                                 <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-semibold text-slate-500">{s}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <Button className="w-full mt-10 h-14 bg-gradient-to-r from-[#D32F2F] to-[#feba50] text-white font-semibold text-sm rounded-xl shadow-[0_24px_48px_rgba(211,47,47,0.3)] hover:shadow-[0_32px_64px_rgba(211,47,47,0.4)] transition-all flex items-center justify-center gap-3 group border-0">
                           Select Laboratory <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </Card>

                     {/* Quality Assurance Card */}
                     <div className="rounded-[2rem] bg-slate-900 p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                        <p className="text-[10px] font-semibold text-[#D32F2F] uppercase tracking-[0.3em]">Institutional Verification</p>
                        <p className="text-xs font-normal text-white leading-normal tracking-wide">Every diagnostic result from this facility is clinical-grade and legally valid for FSSAI audits.</p>
                        <Link to="/support" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest">
                           Learn about our standards <ChevronRight className="h-3 w-3" />
                        </Link>
                     </div>
                  </div>
               </div>
            </Tabs>
         </div>

         {/* 3. CINEMATIC PROMO BANNER (Advertisement Section) */}
         <section className="max-w-7xl mx-auto px-6 mt-24">
            <div className="relative rounded-[2rem] bg-slate-950 p-12 lg:p-20 overflow-hidden group shadow-[0_64px_128px_rgba(0,0,0,0.1)]">
               {/* Animated Accents */}
               <div className="absolute inset-x-0 top-0 h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
               <div className="absolute top-0 right-0 w-[600px] h-full bg-[#D32F2F]/10 blur-[120px] rounded-full translate-x-1/3 pointer-events-none" />

               <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-[#feba50] text-[10px] font-semibold uppercase tracking-[0.4em]">
                        <Zap className="h-4 w-4 fill-current" /> Limited Enterprise Offer
                     </div>
                     <h2 className="text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                        Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D32F2F] to-[#feba50]">Clinical Compliance</span> <br />
                        with Litmus Premium.
                     </h2>
                     <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
                        Get direct access to our most prestigious laboratories with 20% off on bulk testing packages and priority safety audits.
                     </p>

                     <div className="flex flex-wrap gap-6 pt-4">
                        <Button className="h-14 px-10 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-xl flex items-center gap-3">
                           Claim Offer <ArrowRight className="h-5 w-5" />
                        </Button>
                        <div className="flex -space-x-3">
                           {[1, 2, 3, 4].map(i => (
                              <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="h-12 w-12 rounded-full border-4 border-slate-950" />
                           ))}
                           <div className="h-12 w-12 rounded-full border-4 border-slate-950 bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white tracking-tighter">
                              +12k
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="hidden lg:block relative">
                     <div className="aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-4 relative group-hover:scale-105 transition-transform duration-700">
                        <img
                           src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800"
                           alt="Institutional Science"
                           className="w-full h-full object-cover rounded-[2rem] opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent rounded-[2rem]" />

                        {/* Floating Metric */}
                        <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 space-y-2">
                           <p className="text-[#feba50] text-3xl font-bold tracking-tighter">24/7</p>
                           <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Global Support Coverage</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
}
