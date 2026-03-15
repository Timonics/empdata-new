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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Mail,
  Link2,
  CheckCheck,
  Users,
  Globe,
  Clock,
} from 'lucide-react';

interface ShareDocumentDialogProps {
  document: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDocumentDialog({ document, open, onOpenChange }: ShareDocumentDialogProps) {
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState('7');
  const [access, setAccess] = useState('view');

  const shareLink = `https://empdata.com/shared/doc/${document?.id}?token=abc123`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{document?.name}" with others
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Access Level</Label>
              <Select value={access} onValueChange={setAccess}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Can View</SelectItem>
                  <SelectItem value="download">Can Download</SelectItem>
                  <SelectItem value="edit">Can Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Expires After</Label>
              <Select value={expiry} onValueChange={setExpiry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email Addresses</Label>
              <Input placeholder="Enter email addresses (comma separated)" />
            </div>

            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <textarea
                className="w-full min-h-25 rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Add a personal message..."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Anyone with link</span>
          </div>
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>{access} access</span>
          </div>
          {expiry !== 'never' && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Expires in {expiry} days</span>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}