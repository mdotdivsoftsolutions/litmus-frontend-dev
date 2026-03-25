import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { MapPin, Download, Eye } from "lucide-react";
import { bookings } from "@/lib/placeholder-data";

const tabs = ["All", "Active", "Completed", "Reports Ready"];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = bookings.filter((b) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return ["Pending", "Approved", "In Progress"].includes(b.status);
    if (activeTab === "Completed") return b.status === "Completed";
    if (activeTab === "Reports Ready") return b.status === "Completed";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tab
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-accent"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      <div className="space-y-3">
        {filtered.map((b) => (
          <Card key={b.id} className="border border-border rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{b.id}</span>
                <StatusBadge status={b.status} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{b.product}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {b.lab}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">{b.testsCount} tests</Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-bold text-primary">₹{b.amount.toLocaleString()}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full gap-1" asChild>
                    <Link to={`/orders/${b.id}`}><Eye className="h-3.5 w-3.5" /> Track Order</Link>
                  </Button>
                  {b.status === "Completed" && (
                    <Button size="sm" className="rounded-full gap-1 bg-litmus-teal hover:bg-litmus-dark">
                      <Download className="h-3.5 w-3.5" /> Report
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No orders found.</p>
        </div>
      )}
    </div>
  );
}
