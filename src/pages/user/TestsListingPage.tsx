import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { products, categories } from "@/lib/placeholder-data";

const testTypes = ["Physical", "Chemical", "Microbiological"];

export default function TestsListingPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const filters = [
    ...(selectedCategory ? [{ label: selectedCategory, clear: () => setSelectedCategory("") }] : []),
    ...(selectedType ? [{ label: selectedType, clear: () => setSelectedType("") }] : []),
  ];

  const filtered = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Products & Tests</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search for a product or test..." className="pl-12 h-12 rounded-xl text-base border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder="Test Type" /></SelectTrigger>
          <SelectContent>
            {testTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-52 rounded-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Sort by: Relevance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Booked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <Badge key={f.label} className="bg-primary text-primary-foreground gap-1 px-3 py-1 rounded-full cursor-pointer" onClick={f.clear}>
              {f.label} <X className="h-3 w-3" />
            </Badge>
          ))}
          <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => { setSelectedCategory(""); setSelectedType(""); }}>
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="border border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <Badge className="bg-flame-amber-tint text-accent border-0 text-xs">{p.category}</Badge>
              <h3 className="font-semibold text-foreground">{p.name} Test Panel</h3>
              <p className="text-sm text-muted-foreground">{p.testCount} tests included</p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">₹{(p.testCount * 150).toLocaleString()}</span>
                <span className="text-xs text-muted-foreground line-through">₹{(p.testCount * 260).toLocaleString()}</span>
              </div>
              <Badge variant="outline" className="text-litmus-teal border-litmus-teal/30 bg-litmus-mint/30 text-xs">Reports in 3 days</Badge>
              <Button asChild className="w-full bg-primary hover:bg-primary-deep rounded-lg" size="sm">
                <Link to={`/tests/${p.id}`}>View & Add to Cart</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
