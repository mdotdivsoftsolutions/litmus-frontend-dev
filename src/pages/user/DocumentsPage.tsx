import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Trash2 } from "lucide-react";

const documents = [
  { id: "1", name: "FSSAI_Certificate_Kumar.pdf", type: "FSSAI Certificate", date: "2024-01-15", status: "Verified" },
  { id: "2", name: "GST_Certificate_Kumar.pdf", type: "GST Certificate", date: "2024-01-15", status: "Verified" },
  { id: "3", name: "Business_License.pdf", type: "Business License", date: "2024-02-10", status: "Pending" },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Document Manager</h1>

      {/* Upload area */}
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-input p-12 hover:border-secondary transition-colors cursor-pointer bg-card">
        <div className="flex flex-col items-center gap-3 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground">or click to browse. PDF, JPG, PNG up to 10MB</p>
          </div>
          <Button variant="outline">Browse Files</Button>
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-muted p-2"><FileText className="h-5 w-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.type} · Uploaded {doc.date}</p>
              </div>
              <Badge variant={doc.status === "Verified" ? "approved" : "pending"}>{doc.status}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
