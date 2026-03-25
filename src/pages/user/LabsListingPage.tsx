import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, ArrowRight } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";

const cities = ["All Cities", "Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"];

export default function LabsListingPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const filtered = laboratories.filter((l) => {
    if (selectedCity !== "All Cities" && l.city !== selectedCity) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Find a Lab</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search labs by city or name..." className="pl-12 h-12 rounded-xl text-base border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-44 h-12 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((lab) => (
          <Card key={lab.id} className="border border-border shadow-sm hover:border-accent hover:shadow-md transition-all rounded-2xl overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shrink-0">
                  {lab.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{lab.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lab.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {lab.nabl && <Badge className="bg-litmus-dark text-primary-foreground border-0 text-xs">NABL</Badge>}
                {lab.fssai && <Badge className="bg-litmus-teal text-primary-foreground border-0 text-xs">FSSAI</Badge>}
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-flame-amber text-flame-amber" />
                  <span className="font-medium">{lab.rating}</span>
                  <span className="text-muted-foreground">(42 reviews)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap text-sm">
                <Badge variant="outline" className="rounded-full text-xs">Dairy</Badge>
                <Badge variant="outline" className="rounded-full text-xs">Chemical</Badge>
                <Badge variant="outline" className="rounded-full text-xs">Microbiological</Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-primary">Tests from ₹{lab.priceFrom}</span>
                  <p className="text-xs text-muted-foreground">TAT: 3–5 days</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full border-accent text-accent hover:bg-flame-orange-tint gap-1" asChild>
                  <Link to={`/labs/${lab.id}`}>View Lab <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
