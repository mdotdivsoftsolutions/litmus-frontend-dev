import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Milk, Wine, Wheat, Flame as SpiceIcon, Drumstick, Droplets, Package, Cookie } from "lucide-react";
import { categories } from "@/lib/placeholder-data";

const iconMap: Record<string, React.ElementType> = {
  "Dairy": Milk,
  "Beverages": Wine,
  "Grains & Cereals": Wheat,
  "Spices": SpiceIcon,
  "Meat & Poultry": Drumstick,
  "Oils & Fats": Droplets,
  "Processed Foods": Package,
  "Snacks": Cookie,
};

export default function CategoryManagement() {
  const [editCategory, setEditCategory] = useState<typeof categories[0] | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="gap-2 bg-primary hover:bg-primary-deep"><Plus className="h-4 w-4" />Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label className="text-sm font-medium">Name</Label><Input placeholder="Category name" /></div>
              <div className="space-y-2"><Label className="text-sm font-medium">Description</Label><Input placeholder="Short description" /></div>
              <Button className="w-full bg-primary hover:bg-primary-deep">Save Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((cat) => {
          const IconComp = iconMap[cat.name] || Package;
          return (
            <Card key={cat.id} className="border border-border shadow-sm hover:border-primary hover:shadow-md transition-all group cursor-pointer">
              <CardContent className="p-5 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-xl bg-flame-red-tint flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <IconComp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">{cat.count} products</p>
                <div className="flex justify-center gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Edit className="h-3.5 w-3.5" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Edit Category — {cat.name}</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2"><Label className="text-sm font-medium">Name</Label><Input defaultValue={cat.name} /></div>
                        <div className="space-y-2"><Label className="text-sm font-medium">Description</Label><Input placeholder="Short description" /></div>
                        <Button className="w-full bg-primary hover:bg-primary-deep">Update Category</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
