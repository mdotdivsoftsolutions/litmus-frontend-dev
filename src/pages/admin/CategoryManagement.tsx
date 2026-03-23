import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { categories } from "@/lib/placeholder-data";

export default function CategoryManagement() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input placeholder="Category name" /></div>
              <div className="space-y-2"><Label>Emoji/Icon</Label><Input placeholder="🥛" /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Short description" /></div>
              <Button>Save Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5 text-center space-y-2">
              <span className="text-3xl">{cat.emoji}</span>
              <h3 className="font-semibold text-foreground">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.count} products</p>
              <div className="flex justify-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
