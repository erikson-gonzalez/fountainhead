import { useState } from "react";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLessons() {
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  function handleMockUpload() {
    const mockFile = {
      name: `leccion-mock-${Date.now()}.pdf`,
      size: `${Math.floor(Math.random() * 500 + 100)} KB`,
    };
    setUploadedFiles((prev) => [...prev, mockFile]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleMockUpload();
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Lesson Content</h1>
        <p className="text-slate-600 mt-1">
          Manage lesson material. <span className="font-medium text-amber-600">Lessons are NOT downloadable</span> — streaming only.
        </p>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Mock Uploader</CardTitle>
          <CardDescription>
            For now, an upload simulator. The real uploader will be implemented later.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors
              ${isDragging ? "border-slate-400 bg-slate-50" : "border-slate-200 bg-slate-50/50"}
            `}
          >
            <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium mb-2">Arrastra archivos aquí o haz clic para subir</p>
            <p className="text-sm text-slate-500 mb-4">PDF, tabs, material de apoyo para lecciones</p>
            <Button type="button" variant="outline" onClick={handleMockUpload} className="border-slate-300 text-slate-700">
              Simulate upload (mock)
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-700">Uploaded files (mock)</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <FileText className="h-5 w-5 text-slate-500 shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">{f.name}</span>
                    <span className="text-xs text-slate-500">{f.size}</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
