import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { categories, products } from "@/lib/placeholder-data";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Products & Tests</h1>

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            className={`rounded-lg border p-4 text-center transition-all hover:shadow-sm ${selectedCategory === cat.name ? "border-secondary bg-secondary/5 shadow-sm" : "border-border bg-card"}`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <p className="mt-1 text-sm font-medium text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{cat.count} products</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select>
          <SelectTrigger className="w-48"><SelectValue placeholder="Test Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="chemical">Chemical</SelectItem>
            <SelectItem value="microbiological">Microbiological</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <Badge variant="secondary">{p.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{p.testCount} tests available</p>
              <Button className="w-full" size="sm" asChild>
                <Link to={`/dashboard/products/${p.id}`}>Select Tests</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
