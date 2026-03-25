import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Phone, Mail, ShoppingCart } from "lucide-react";
import { laboratories, tests as allTests } from "@/lib/placeholder-data";

export default function LabDetailConsumerPage() {
  const { id } = useParams();
  const lab = laboratories.find((l) => l.id === id) || laboratories[0];

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="bg-gradient-to-r from-secondary to-[hsl(24,30%,15%)] px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shrink-0">
              {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">{lab.name}</h1>
              <p className="text-primary-foreground/70 flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" />{lab.city}</p>
              <div className="flex items-center gap-3 mt-2">
                {lab.nabl && <Badge className="bg-litmus-dark text-primary-foreground border-0">NABL</Badge>}
                {lab.fssai && <Badge className="bg-litmus-teal text-primary-foreground border-0">FSSAI</Badge>}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-flame-amber text-flame-amber" />
                  <span className="text-primary-foreground font-medium">{lab.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="bg-muted rounded-full p-1">
            <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
            <TabsTrigger value="tests" className="rounded-full">Tests & Pricing</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-full">Reviews</TabsTrigger>
            <TabsTrigger value="contact" className="rounded-full">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border border-border rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground">About this Lab</h3>
                <p className="text-sm text-muted-foreground">
                  {lab.name} is a state-of-the-art food testing laboratory located in {lab.city}. 
                  With {lab.testsCount}+ tests available, we provide comprehensive food safety analysis 
                  meeting NABL and FSSAI standards. Our team of experienced analysts ensures accurate 
                  and timely results.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div><p className="text-xs text-muted-foreground">Tests Available</p><p className="font-bold text-foreground">{lab.testsCount}+</p></div>
                  <div><p className="text-xs text-muted-foreground">Starting From</p><p className="font-bold text-primary">₹{lab.priceFrom}</p></div>
                  <div><p className="text-xs text-muted-foreground">Turnaround Time</p><p className="font-bold text-foreground">3–5 days</p></div>
                  <div><p className="text-xs text-muted-foreground">Rating</p><p className="font-bold text-foreground">{lab.rating} ⭐</p></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="space-y-3">
            {allTests.map((test) => (
              <div key={test.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{test.name}</p>
                  <p className="text-xs text-muted-foreground">Method: FSSAI {test.method} • TAT: 3 days</p>
                </div>
                <Badge variant="outline" className="shrink-0">{test.type}</Badge>
                <span className="font-bold text-primary shrink-0">₹1,200</span>
                <Button size="sm" className="bg-primary hover:bg-primary-deep rounded-lg shrink-0 gap-1">
                  <ShoppingCart className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {[
              { name: "Rajesh K.", rating: 5, comment: "Excellent turnaround and accurate results. Highly recommended for dairy testing.", date: "2 weeks ago" },
              { name: "Priya S.", rating: 4, comment: "Good lab with professional staff. Reports were detailed and on time.", date: "1 month ago" },
              { name: "Amit P.", rating: 5, comment: "Best food testing lab in the city. NABL accreditation gives confidence.", date: "1 month ago" },
            ].map((review, i) => (
              <Card key={i} className="border border-border rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">{review.name.split(" ").map(w => w[0]).join("")}</div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="contact">
            <Card className="border border-border rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{lab.city}, India</span></div>
                  <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">+91 44 2345 6789</span></div>
                  <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">info@{lab.name.toLowerCase().replace(/\s+/g, "")}.in</span></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile CTA */}
      <div className="fixed bottom-14 inset-x-0 z-40 lg:hidden px-4 pb-2">
        <Button className="w-full bg-primary hover:bg-primary-deep rounded-xl h-12 text-base font-semibold shadow-lg" asChild>
          <Link to="/cart">Select This Lab — Start Booking →</Link>
        </Button>
      </div>
    </div>
  );
}
