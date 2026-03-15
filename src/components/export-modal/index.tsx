'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Download, FileText, FileSpreadsheet, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExportCompanies } from '@/hooks/queries/useCompanies';
import { useExportCompanyRegistrations } from '@/hooks/queries/useGroupLifeCompanies';
import { useExportEmployeeRegistrations } from '@/hooks/queries/useGroupLifeEmployees';
// import { useExportEmployees } from '@/hooks/queries/useEmployees';
import { toast } from 'sonner';

export type ExportFormat = 'csv' | 'excel' | 'pdf';
export type ExportScope = 'all' | 'selected' | 'filtered';
export type ExportEntity = 
  | 'companies' 
  | 'employees' 
  | 'group-life-companies' 
  | 'group-life-employees'
  | 'invitations';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: ExportEntity;
  title?: string;
  description?: string;
  filters?: Record<string, any>;
  selectedIds?: number[];
  totalCount?: number;
  filteredCount?: number;
  columns?: { key: string; label: string; default?: boolean }[];
  formats?: ExportFormat[];
  showDateRange?: boolean;
  showColumnSelection?: boolean;
  onSuccess?: () => void;
}

export interface ExportOptions {
  format: ExportFormat;
  scope: ExportScope;
  columns?: string[];
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  includeHeaders?: boolean;
  filename?: string;
  filters?: Record<string, any>;
  ids?: number[];
}

// Map entities to their export hooks
const useExportHook = (entity: ExportEntity) => {
  switch (entity) {
    case 'companies':
      return useExportCompanies;
    // case 'employees':
    //   return useExportEmployees;
    case 'group-life-companies':
      return useExportCompanyRegistrations;
    case 'group-life-employees':
      return useExportEmployeeRegistrations;
    default:
      return useExportCompanies;
  }
};

export function ExportModal({
  open,
  onOpenChange,
  entity,
  title,
  description,
  filters = {},
  selectedIds = [],
  totalCount = 0,
  filteredCount = 0,
  columns = [],
  formats = ['csv', 'excel', 'pdf'],
  showDateRange = true,
  showColumnSelection = true,
  onSuccess,
}: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [scope, setScope] = useState<ExportScope>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columns.filter(col => col.default !== false).map(col => col.key)
  );
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [filename, setFilename] = useState(`${entity}-export-${format(new Date(), 'yyyy-MM-dd')}`);
  const [activeTab, setActiveTab] = useState<'options' | 'preview'>('options');
  const [error, setError] = useState<string | null>(null);

  // Get the appropriate export hook
  const useExport = useExportHook(entity);
  const exportMutation = useExport();

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setError(null);
      setScope('all');
      setExportFormat('csv');
      setDateRange({ from: undefined, to: undefined });
      setSelectedColumns(columns.filter(col => col.default !== false).map(col => col.key));
      setFilename(`${entity}-export-${format(new Date(), 'yyyy-MM-dd')}`);
      setActiveTab('options');
    }
  }, [open, entity, columns]);

  const handleExport = async () => {
    setError(null);
    
    // Prepare export options
    const options: ExportOptions = {
      format: exportFormat,
      scope,
      columns: showColumnSelection ? selectedColumns : undefined,
      dateRange: showDateRange ? dateRange : undefined,
      includeHeaders,
      filename,
      filters: scope === 'filtered' ? filters : undefined,
      ids: scope === 'selected' ? selectedIds : undefined,
    };

    try {
      await exportMutation.mutateAsync(options.filters ?? {});
      toast.success('Export completed successfully');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Export failed');
      toast.error(err.message || 'Export failed');
    }
  };

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(columns.map(col => col.key));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const getScopeDescription = () => {
    switch (scope) {
      case 'all':
        return `All ${totalCount} ${entity.replace('-', ' ')}`;
      case 'selected':
        return `${selectedIds.length} selected ${entity.replace('-', ' ')}`;
      case 'filtered':
        return `${filteredCount} filtered ${entity.replace('-', ' ')}`;
      default:
        return '';
    }
  };

  const getEntityTitle = () => {
    switch (entity) {
      case 'companies':
        return 'Companies';
      case 'employees':
        return 'Employees';
      case 'group-life-companies':
        return 'Group Life Companies';
      case 'group-life-employees':
        return 'Group Life Employees';
      case 'invitations':
        return 'Invitations';
      default:
        return entity;
    }
  };

  const formatIcons = {
    csv: FileText,
    excel: FileSpreadsheet,
    pdf: FileText,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="h-5 w-5 text-blue-600" />
            {title || `Export ${getEntityTitle()}`}
          </DialogTitle>
          <DialogDescription>
            {description || `Choose your export preferences for ${getEntityTitle().toLowerCase()}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'options' | 'preview')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options">Export Options</TabsTrigger>
            <TabsTrigger value="preview">Preview & Confirm</TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-6 py-4">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label>Export Format</Label>
              <div className="grid grid-cols-3 gap-3">
                {formats.map((fmt) => {
                  const Icon = formatIcons[fmt];
                  const isSelected = exportFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      disabled={exportMutation.isPending}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                        exportMutation.isPending && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Icon className={cn(
                        "h-6 w-6",
                        isSelected ? "text-blue-600" : "text-gray-500"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-blue-600" : "text-gray-700"
                      )}>
                        {fmt.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scope Selection */}
            <div className="space-y-3">
              <Label>Export Scope</Label>
              <RadioGroup 
                value={scope} 
                onValueChange={(v) => setScope(v as ExportScope)}
                disabled={exportMutation.isPending}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="font-normal cursor-pointer">
                    All {getEntityTitle()} <span className="text-muted-foreground">({totalCount})</span>
                  </Label>
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="selected" id="selected" />
                    <Label htmlFor="selected" className="font-normal cursor-pointer">
                      Selected {getEntityTitle()} <span className="text-muted-foreground">({selectedIds.length})</span>
                    </Label>
                  </div>
                )}
                {filteredCount > 0 && filteredCount !== totalCount && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filtered" id="filtered" />
                    <Label htmlFor="filtered" className="font-normal cursor-pointer">
                      Filtered {getEntityTitle()} <span className="text-muted-foreground">({filteredCount})</span>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* Date Range */}
            {showDateRange && (
              <div className="space-y-3">
                <Label>Date Range (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={exportMutation.isPending}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          initialFocus
                          disabled={exportMutation.isPending}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={exportMutation.isPending}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          initialFocus
                          disabled={exportMutation.isPending}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {/* Column Selection */}
            {showColumnSelection && columns.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Columns to Export</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={selectAllColumns}
                      disabled={exportMutation.isPending}
                      className="h-7 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={deselectAllColumns}
                      disabled={exportMutation.isPending}
                      className="h-7 text-xs"
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                  {columns.map((column) => (
                    <div key={column.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${column.key}`}
                        checked={selectedColumns.includes(column.key)}
                        onCheckedChange={() => toggleColumn(column.key)}
                        disabled={exportMutation.isPending}
                      />
                      <Label
                        htmlFor={`col-${column.key}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="space-y-3">
              <Label>Additional Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-headers"
                    checked={includeHeaders}
                    onCheckedChange={(checked) => setIncludeHeaders(checked as boolean)}
                    disabled={exportMutation.isPending}
                  />
                  <Label htmlFor="include-headers" className="text-sm font-normal cursor-pointer">
                    Include column headers
                  </Label>
                </div>
              </div>
            </div>

            {/* Filename */}
            <div className="space-y-2">
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                disabled={exportMutation.isPending}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 py-4">
            {/* Export Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium">Export Summary</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Format:</p>
                  <p className="font-medium mt-1">{exportFormat.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Scope:</p>
                  <p className="font-medium mt-1 capitalize">{scope}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Records:</p>
                  <p className="font-medium mt-1">{getScopeDescription()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Filename:</p>
                  <p className="font-medium mt-1">{filename}.{exportFormat}</p>
                </div>
              </div>

              {showDateRange && (dateRange.from || dateRange.to) && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Date Range:</p>
                  <p className="font-medium mt-1">
                    {dateRange.from ? format(dateRange.from, 'PP') : 'Any'} - {dateRange.to ? format(dateRange.to, 'PP') : 'Any'}
                  </p>
                </div>
              )}

              {showColumnSelection && selectedColumns.length > 0 && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Columns ({selectedColumns.length}):</p>
                  <p className="text-xs mt-1 text-gray-600 wrap-break-word">
                    {selectedColumns.map(key => 
                      columns.find(col => col.key === key)?.label || key
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Sample Preview */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Sample Preview</h4>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <p className="text-xs text-muted-foreground">
                    {exportMutation.isPending ? 'Generating preview...' : 'Sample of first 5 rows'}
                  </p>
                </div>
                <div className="p-8 text-center text-gray-400">
                  {exportMutation.isPending ? (
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-600" />
                  ) : (
                    <>
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Preview will be generated during export</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Estimated File Size */}
            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <Check className="h-3 w-3 inline mr-1 text-blue-600" />
              Estimated file size: ~
              {Math.ceil(
                (selectedColumns.length * 10 * 
                (scope === 'all' ? totalCount : 
                 scope === 'selected' ? selectedIds.length : 
                 filteredCount)) / 1024
              )} KB
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={exportMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={exportMutation.isPending || selectedColumns.length === 0}
          >
            {exportMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}