'use client';

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImportApiService, type ImportResult, type ImportEntity } from '@/services/import.service';
import { toast } from 'sonner';

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: ImportEntity;
  title?: string;
  description?: string;
  templateColumns: string[];
  templateData?: any[];
  onSuccess?: () => void;
}

export function ImportModal({
  open,
  onOpenChange,
  entity,
  title,
  description,
  templateColumns,
  templateData,
  onSuccess,
}: ImportModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'review'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Map<number, string[]>>(new Map());
  const [sendInvitations, setSendInvitations] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setParsedData([]);
    setValidationErrors(new Map());
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    const parseFile = async () => {
      try {
        let data: any[];
        if (fileExtension === 'csv') {
          data = await ImportApiService.parseCSV(selectedFile);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          data = await ImportApiService.parseExcel(selectedFile);
        } else {
          throw new Error('Unsupported file format. Please upload CSV or Excel files.');
        }
        
        // Validate required columns
        const dataColumns = Object.keys(data[0] || {});
        const missingColumns = templateColumns.filter(col => !dataColumns.includes(col));
        
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }
        
        setParsedData(data);
        setActiveTab('review');
      } catch (err: any) {
        setError(err.message);
      }
    };
    
    parseFile();
  }, [templateColumns]);

  const handleImport = async () => {
    if (parsedData.length === 0 || !file) return;
    
    setIsImporting(true);
    setError(null);
    
    try {
      let result: ImportResult;
      
      switch (entity) {
        case 'company-registrations':
          result = await ImportApiService.bulkUploadCompanyRegistrations(file, sendInvitations);
          break;
        case 'employee-registrations':
          result = await ImportApiService.bulkUploadEmployeeRegistrations(file);
          break;
        default:
          throw new Error(`Bulk import not supported for ${entity}`);
      }
      
      setImportResult(result);
      
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          onOpenChange(false);
          onSuccess?.();
          resetState();
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Import failed');
      toast.error(err.response?.data?.message || err.message || 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setImportResult(null);
    setValidationErrors(new Map());
    setActiveTab('upload');
    setError(null);
    setSendInvitations(false);
  };

  const handleDownloadTemplate = () => {
    const headers = templateColumns.join(',');
    let templateContent = headers + '\n';
    
    if (templateData && templateData.length > 0) {
      templateData.forEach(row => {
        const values = templateColumns.map(col => {
          const val = row[col];
          return val !== undefined && val !== null ? `"${val}"` : '';
        });
        templateContent += values.join(',') + '\n';
      });
    } else {
      const sampleRow = templateColumns.map(col => {
        if (col === 'email') return '"sample@example.com"';
        if (col === 'phone_number') return '"08012345678"';
        if (col === 'first_name') return '"John"';
        if (col === 'last_name') return '"Doe"';
        return `"sample_${col}"`;
      });
      templateContent += sampleRow.join(',') + '\n';
    }
    
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entity}-template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEntityTitle = () => {
    switch (entity) {
      case 'company-registrations':
        return 'Company Registrations';
      case 'employee-registrations':
        return 'Employee Registrations';
      case 'individual-registrations':
        return 'Individual Registrations';
      default:
        return entity;
    }
  };

  const getFileIcon = () => {
    if (!file) return null;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') return <FileText className="h-8 w-8 text-green-600" />;
    if (ext === 'xlsx' || ext === 'xls') return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    return <FileText className="h-8 w-8 text-gray-400" />;
  };

  const successRate = importResult?.data?.summary 
    ? Math.round((importResult.data.summary.successful_count / importResult.data.summary.total_rows) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetState();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-5 w-5 text-blue-600" />
            {title || `Import ${getEntityTitle()}`}
          </DialogTitle>
          <DialogDescription>
            {description || `Upload a CSV or Excel file to import ${getEntityTitle().toLowerCase()}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {importResult ? (
          <div className="space-y-4 py-4">
            <div className={cn(
              "p-4 rounded-lg text-center",
              importResult.success ? "bg-green-50" : "bg-red-50"
            )}>
              {importResult.data?.summary?.successful_count === importResult.data?.summary?.total_rows ? (
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
              ) : (
                <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
              )}
              <h3 className="text-lg font-semibold mb-2">
                Import Complete
              </h3>
              <p className="text-sm text-muted-foreground">
                {importResult.data?.summary?.successful_count} of {importResult.data?.summary?.total_rows} records imported successfully
              </p>
              {importResult.data?.summary?.failed_count > 0 && (
                <Progress 
                  value={successRate} 
                  className="h-2 mt-4" 
                />
              )}
            </div>
            
            {importResult.data?.failed && importResult.data.failed.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-2 border-b">
                  <p className="text-sm font-medium text-red-800">
                    Failed Rows ({importResult.data.failed.length})
                  </p>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {importResult.data.failed.map((err, idx) => (
                    <div key={idx} className="px-4 py-2 border-b text-sm">
                      <span className="font-mono text-red-600">Row {err.row}:</span>
                      <span className="ml-2 text-gray-600">{err.errors.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'review')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="review" disabled={!file}>Review & Import</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6 py-4">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                {!file ? (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your CSV or Excel file here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: .csv, .xlsx, .xls
                    </p>
                    <div className="mt-4">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Choose File
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileSelect(e.target.files[0]);
                            }
                          }}
                        />
                      </Label>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getFileIcon()}
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFile(null);
                        setParsedData([]);
                        setValidationErrors(new Map());
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Options for Company Registrations */}
              {entity === 'company-registrations' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="send-invitations"
                      checked={sendInvitations}
                      onChange={(e) => setSendInvitations(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="send-invitations" className="text-sm font-normal cursor-pointer">
                      Send invitations to companies after import
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    If checked, invitation emails will be sent to all imported companies.
                  </p>
                </div>
              )}

              {/* Template Download */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Need a template?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Download our template to ensure your file is formatted correctly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-6 py-4">
              {/* Preview Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">File Preview</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {parsedData.length} records found
                    </p>
                  </div>
                  <Badge variant={validationErrors.size > 0 ? "destructive" : "default"}>
                    Ready to import
                  </Badge>
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {templateColumns.slice(0, 5).map((col) => (
                          <th key={col} className="px-4 py-2 text-left font-medium border-b">
                            {col}
                          </th>
                        ))}
                        <th className="px-4 py-2 text-left font-medium border-b">Preview</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="border-b">
                          {templateColumns.slice(0, 5).map((col) => (
                            <td key={col} className="px-4 py-2">
                              {String(row[col] || '-').slice(0, 30)}
                            </td>
                          ))}
                          <td className="px-4 py-2">
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Valid
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 10 && (
                  <div className="bg-gray-50 px-4 py-2 text-center text-xs text-muted-foreground">
                    + {parsedData.length - 10} more rows
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mb-2" />
                <p className="text-sm text-yellow-800">
                  Please review your data before importing. This action cannot be undone.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!importResult && (
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            {activeTab === 'review' && (
              <Button 
                onClick={handleImport} 
                disabled={isImporting || parsedData.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {parsedData.length} Records
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}