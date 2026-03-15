'use client';

import { useState } from 'react';
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
import { Folder, Lock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFolderDialog({ open, onOpenChange }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState('root');
  const [access, setAccess] = useState('private');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      // TODO: Implement API call
      console.log('Creating folder:', { folderName, parentFolder, access });
      await new Promise(resolve => setTimeout(resolve, 1000));
      onOpenChange(false);
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-emerald-600" />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            Create a folder to organize your documents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="e.g., Tax Documents 2024"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentFolder">Location</Label>
            <Select value={parentFolder} onValueChange={setParentFolder}>
              <SelectTrigger id="parentFolder">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root Directory</SelectItem>
                <SelectItem value="cac">CAC Documents</SelectItem>
                <SelectItem value="tax">Tax Certificates</SelectItem>
                <SelectItem value="insurance">Insurance Policies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Access Level</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccess('private')}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  access === 'private'
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Lock className={cn(
                  "h-4 w-4",
                  access === 'private' ? "text-emerald-600" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  access === 'private' ? "text-emerald-600" : "text-gray-600"
                )}>
                  Private
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAccess('shared')}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  access === 'shared'
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Users className={cn(
                  "h-4 w-4",
                  access === 'shared' ? "text-emerald-600" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  access === 'shared' ? "text-emerald-600" : "text-gray-600"
                )}>
                  Shared
                </span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!folderName || isCreating}>
            {isCreating ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}