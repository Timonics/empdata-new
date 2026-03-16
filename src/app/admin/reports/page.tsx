"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  FileSpreadsheet,
  FileJson,
  Printer,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  FileDown,
  FileUp,
  Archive,
  Trash2,
  Share2,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy reports data
const generateDummyReports = () => {
  const reportTypes = [
    "Monthly Registration Summary",
    "KYC Verification Report",
    "Company Onboarding Report",
    "Employee Enrollment Report",
    "Beneficiary Summary",
    "NIN Verification Log",
    "Document Upload Report",
    "Rejection Analysis",
    "Pending Approvals",
    "Completion Rate Report",
    "Audit Trail Export",
    "Compliance Report",
  ];

  const formats = ["PDF", "CSV", "Excel", "JSON"];
  const statuses = ["completed", "pending", "failed", "processing"];
  const creators = ["John Admin", "Sarah Manager", "System Auto", "Mike Analyst", "Jane Director"];

  return Array.from({ length: 25 }, (_, i) => {
    const id = i + 1;
    const type = reportTypes[Math.floor(Math.random() * reportTypes.length)];
    const format = formats[Math.floor(Math.random() * formats.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const size = `${(Math.random() * 10 + 0.5).toFixed(1)} MB`;
    const downloads = Math.floor(Math.random() * 500);
    
    // Random date within last 60 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    return {
      id,
      name: type,
      description: `${type} for `,
      format,
      status,
      creator,
      size,
      downloads,
      created_at: date.toISOString(),
      last_accessed: Math.random() > 0.3 ? new Date(date.getTime() + Math.random() * 86400000 * 5).toISOString() : null,
      tags: Math.random() > 0.5 ? ['monthly', 'kyc', 'urgent'].slice(0, Math.floor(Math.random() * 3)) : [],
    };
  });
};

// Dummy saved reports
const dummyReports = generateDummyReports();

// Format date
const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy HH:mm');
};

const formatDateShort = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

interface ReportsPageProps {
  role: "admin" | "company" | "employee";
}

export default function ReportsPage({ role }: ReportsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("all");
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = role === "admin";
  const theme = isAdmin ? "blue" : "emerald";

  // Filter reports
  const filteredReports = dummyReports.filter(report => {
    const matchesSearch = searchTerm === "" || 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.creator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFormat = formatFilter === "" || report.format === formatFilter;
    const matchesStatus = statusFilter === "" || report.status === statusFilter;
    
    return matchesSearch && matchesFormat && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(r => r.id));
    }
  };

  const handleSelectReport = (id: number) => {
    setSelectedReports(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleDownload = (report: any) => {
    alert(`Downloading ${report.name} as ${report.format}...`);
  };

  const handleBulkDownload = () => {
    alert(`Downloading ${selectedReports.length} selected reports...`);
  };

  const handleShare = (report: any) => {
    alert(`Share options for ${report.name}`);
  };

  const handleArchive = (report: any) => {
    alert(`Archiving ${report.name}`);
  };

  const handleDelete = (report: any) => {
    if (confirm(`Are you sure you want to delete ${report.name}?`)) {
      alert(`Deleted ${report.name}`);
    }
  };

  const handleExportList = (format: "csv" | "pdf") => {
    alert(`Exporting report list as ${format.toUpperCase()}...`);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed": return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <Badge variant="outline" className={cn("font-medium capitalize", variants[status])}>
        {status}
      </Badge>
    );
  };

  const getFormatIcon = (format: string) => {
    switch(format) {
      case "PDF": return <FileText className="h-4 w-4 text-red-500" />;
      case "CSV": return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
      case "Excel": return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
      case "JSON": return <FileJson className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(
            "text-3xl font-bold tracking-tight bg-linear-to-r bg-clip-text text-transparent",
            isAdmin
              ? "from-blue-600 to-blue-800"
              : "from-emerald-600 to-emerald-800",
          )}>
            Reports
          </h1>
          <p className="text-muted-foreground mt-2">
            View, download, and manage generated reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              isAdmin && "hover:bg-blue-50 hover:text-blue-600",
              !isAdmin && "hover:bg-emerald-50 hover:text-emerald-600"
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  isAdmin 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export List
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExportList("csv")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportList("pdf")}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports by name, description, or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-37.5">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-none",
                viewMode === "list" && (isAdmin ? "bg-blue-600" : "bg-emerald-600")
              )}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-none",
                viewMode === "grid" && (isAdmin ? "bg-blue-600" : "bg-emerald-600")
              )}
            >
              <FileText className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={formatFilter} onValueChange={setFormatFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All formats</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFormatFilter("");
                  setStatusFilter("");
                  setDateRange("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <Card className={cn(
          "border-0 shadow-lg",
          isAdmin ? "bg-blue-50" : "bg-emerald-50"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedReports.length} reports selected</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Selected
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports View */}
      {viewMode === "list" ? (
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  isAdmin ? "bg-blue-50" : "bg-emerald-50"
                )}>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(report.id)}
                          onChange={() => handleSelectReport(report.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">{report.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFormatIcon(report.format)}
                          <span>{report.format}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          {getStatusBadge(report.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDateShort(report.created_at)}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(report.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>{report.creator}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>{report.downloads.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDownload(report)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(report)}>
                              <Share2 className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleArchive(report)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(report)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => handleSelectReport(report.id)}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div>
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(report.format)}
                      <span>{report.format}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <span className="ml-2 font-medium">{report.size}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="ml-2 font-medium">{report.downloads}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <span className="ml-2 font-medium">{formatDateShort(report.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Creator:</span>
                      <span className="ml-2 font-medium">{report.creator}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => handleDownload(report)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShare(report)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleArchive(report)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(report)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      <Card className={cn(
        "border-0 shadow-lg",
        isAdmin ? "bg-blue-50" : "bg-emerald-50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className={cn(
                "h-4 w-4",
                isAdmin ? "text-blue-600" : "text-emerald-600"
              )} />
              <span className={cn(
                "font-medium",
                isAdmin ? "text-blue-800" : "text-emerald-800"
              )}>
                Total Reports: {dummyReports.length}
              </span>
              <span className="text-muted-foreground mx-2">•</span>
              <span className="text-muted-foreground">
                Showing {filteredReports.length} filtered results
              </span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Completed: {dummyReports.filter(r => r.status === 'completed').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs">Pending: {dummyReports.filter(r => r.status === 'pending').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs">Failed: {dummyReports.filter(r => r.status === 'failed').length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}