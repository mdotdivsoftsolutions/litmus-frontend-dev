import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Star, MapPin, LayoutGrid, List } from "lucide-react";
import { laboratories } from "@/lib/placeholder-data";

export default function LaboratoriesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = laboratories.filter((l) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Laboratories</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search labs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>
            {["Chennai", "Mumbai", "New Delhi", "Bangalore", "Hyderabad", "Kolkata"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select><SelectTrigger className="w-48"><SelectValue placeholder="Accreditation" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="nabl">NABL Accredited</SelectItem>
            <SelectItem value="fssai">FSSAI Approved</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((lab) => (
            <Card key={lab.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-foreground">{lab.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />{lab.city}
                </div>
                <div className="flex items-center gap-2">
                  {lab.nabl && <Badge variant="approved">NABL</Badge>}
                  {lab.fssai && <Badge variant="completed">FSSAI</Badge>}
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-status-pending text-status-pending" />
                    <span className="text-sm font-medium">{lab.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Starting ₹{lab.priceFrom}</span>
                  <Button size="sm" asChild><Link to={`/dashboard/laboratories/${lab.id}`}>View Lab</Link></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lab Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Accreditation</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Price From</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell>{lab.city}</TableCell>
                  <TableCell><div className="flex gap-1">{lab.nabl && <Badge variant="approved">NABL</Badge>}{lab.fssai && <Badge variant="completed">FSSAI</Badge>}</div></TableCell>
                  <TableCell><div className="flex items-center gap-1"><Star className="h-3 w-3 fill-status-pending text-status-pending" />{lab.rating}</div></TableCell>
                  <TableCell>₹{lab.priceFrom}</TableCell>
                  <TableCell><Button variant="ghost" size="sm" asChild><Link to={`/dashboard/laboratories/${lab.id}`}>View</Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
