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
import { CalendarIcon, Download, FileText, FileSpreadsheet, Check, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExportApiService, type ExportEntity, type ExportFormat } from '@/services/export.service';
import { toast } from 'sonner';

export type ExportScope = 'all' | 'selected' | 'filtered';

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
  additionalParams?: Record<string, any>;
}

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
  formats = ['csv', 'excel'],
  showDateRange = true,
  showColumnSelection = true,
  onSuccess,
  additionalParams = {},
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
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setError(null);
    setIsExporting(true);
    
    try {
      // Prepare API parameters
      const params: Record<string, any> = {
        ...additionalParams,
      };
      
      // Apply filters
      if (scope === 'filtered') {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            params[key] = value;
          }
        });
      }
      
      // Apply date range
      if (showDateRange && dateRange.from && dateRange.to) {
        params.from_date = format(dateRange.from, 'yyyy-MM-dd');
        params.to_date = format(dateRange.to, 'yyyy-MM-dd');
      }
      
      // Apply selected IDs
      if (scope === 'selected' && selectedIds.length > 0) {
        params.ids = selectedIds.join(',');
      }
      
      // Call the appropriate export API based on entity
      let blob: Blob;
      switch (entity) {
        case 'company-registrations':
          blob = await ExportApiService.exportCompanyRegistrations(params);
          break;
        case 'employee-registrations':
          blob = await ExportApiService.exportEmployeeRegistrations(params);
          break;
        case 'individual-registrations':
          blob = await ExportApiService.exportIndividualRegistrations(params);
          break;
        case 'portal-employees':
          blob = await ExportApiService.exportPortalEmployees(params);
          break;
        default:
          throw new Error(`Unsupported entity: ${entity}`);
      }
      
      // Download the file
      const finalFilename = `${filename}.${exportFormat === 'excel' ? 'xlsx' : exportFormat}`;
      ExportApiService.download(blob, finalFilename);
      
      toast.success('Export completed successfully');
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Export failed');
      toast.error(err.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const getEntityTitle = () => {
    switch (entity) {
      case 'company-registrations':
        return 'Company Registrations';
      case 'employee-registrations':
        return 'Employee Registrations';
      case 'individual-registrations':
        return 'Individual Registrations';
      case 'portal-employees':
        return 'Portal Employees';
      default:
        return entity;
    }
  };

  const formatIcons = {
    csv: FileText,
    excel: FileSpreadsheet,
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
              <div className="grid grid-cols-2 gap-3">
                {formats.map((fmt) => {
                  const Icon = formatIcons[fmt];
                  const isSelected = exportFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setExportFormat(fmt)}
                      disabled={isExporting}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                        isExporting && "opacity-50 cursor-not-allowed"
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
                disabled={isExporting}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="font-normal cursor-pointer">
                    All Records <span className="text-muted-foreground">({totalCount})</span>
                  </Label>
                </div>
                {selectedIds.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="selected" id="selected" />
                    <Label htmlFor="selected" className="font-normal cursor-pointer">
                      Selected Records <span className="text-muted-foreground">({selectedIds.length})</span>
                    </Label>
                  </div>
                )}
                {filteredCount > 0 && filteredCount !== totalCount && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filtered" id="filtered" />
                    <Label htmlFor="filtered" className="font-normal cursor-pointer">
                      Filtered Records <span className="text-muted-foreground">({filteredCount})</span>
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
                          disabled={isExporting}
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
                          disabled={isExporting}
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
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            )}

            {/* Filename */}
            <div className="space-y-2">
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                disabled={isExporting}
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
                  <p className="font-medium mt-1">
                    {scope === 'all' ? totalCount : 
                     scope === 'selected' ? selectedIds.length : 
                     filteredCount}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Filename:</p>
                  <p className="font-medium mt-1">{filename}.{exportFormat === 'excel' ? 'xlsx' : exportFormat}</p>
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
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Check className="h-4 w-4 text-blue-600 mb-2" />
              <p className="text-sm text-blue-800">
                Your export will be processed and downloaded automatically. 
                The file will contain all selected records with the chosen format.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isExporting ? (
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