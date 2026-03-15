"use client";

import { useState, useCallback, ChangeEvent } from "react";
import { useDropzone } from "react-dropzone";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  X,
  File,
  FileText,
  FileImage,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface UploadDocumentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadFile extends File {
  preview?: string;
  progress?: number;
  status?: "pending" | "uploading" | "success" | "error";
  error?: string;
}

const categories = [
  { value: "cac", label: "CAC Documents" },
  { value: "tax", label: "Tax Certificates" },
  { value: "insurance", label: "Insurance Policies" },
  { value: "employee", label: "Employee Records" },
  { value: "financial", label: "Financial Reports" },
  { value: "brand", label: "Brand Assets" },
  { value: "other", label: "Other" },
];

const getFileIcon = (file: UploadFile) => {
  const type = file.type;
  if (type.includes("pdf")) return FileText;
  if (type.includes("image")) return FileImage;
  if (type.includes("sheet") || type.includes("excel")) return FileSpreadsheet;
  return File;
};

export function UploadDocumentDrawer({
  open,
  onOpenChange,
}: UploadDocumentDrawerProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "pending" as const,
      }),
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: 10485760, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    setUploading(true);

    // Simulate upload progress for each file
    for (let i = 0; i < files.length; i++) {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[i].status = "uploading";
        return newFiles;
      });

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setFiles((prev) => {
          const newFiles = [...prev];
          newFiles[i].progress = progress;
          return newFiles;
        });
      }

      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles[i].status = "success";
        return newFiles;
      });
    }

    setUploading(false);

    // Close drawer after successful upload
    setTimeout(() => {
      onOpenChange(false);
      setFiles([]);
      setCategory("");
      setDescription("");
      setTags("");
    }, 1000);
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none data-[side=right]:max-w-none">
        <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-emerald-800 text-white p-6 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-xl">
              Upload Documents
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-emerald-100 text-sm mt-2">
            Upload and manage your company documents
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop files here"
                : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, DOC, XLS, Images (Max 10MB each)
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  Files to Upload ({files.length})
                </h3>
                <span className="text-xs text-muted-foreground">
                  Total: {formatBytes(totalSize)}
                </span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                        <FileIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(file.size)}
                        </p>
                        {file.status === "uploading" && (
                          <Progress
                            value={file.progress}
                            className="h-1 mt-2"
                          />
                        )}
                        {file.status === "success" && (
                          <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Uploaded
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata Form */}
          {files.length > 0 && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-sm font-medium">Document Information</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter document description"
                    className="mt-1.5"
                    value={description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., contract, signed, 2024 (comma separated)"
                    className="mt-1.5"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {files.length > 0 && (
            <div className="sticky bottom-0 bg-white py-4 border-t flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={uploading || !category || files.length === 0}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {files.length} File{files.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
