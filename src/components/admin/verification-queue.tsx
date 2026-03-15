'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const queueItems = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    type: 'Company Verification',
    priority: 'high',
    timeLeft: 'Overdue',
  },
  {
    id: 2,
    name: 'John Smith',
    type: 'NIN Verification',
    priority: 'medium',
    timeLeft: '2 hours left',
  },
  {
    id: 3,
    name: 'Global Industries',
    type: 'Document Review',
    priority: 'low',
    timeLeft: '1 day left',
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    type: 'Identity Verification',
    priority: 'high',
    timeLeft: '30 mins left',
  },
];

const priorityColors = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50',
};

export function VerificationQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">12/25 verified</span>
          </div>
          <Progress value={48} className="h-2" />
        </div>

        <div className="space-y-3">
          {queueItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.type}</p>
              </div>
              <div className="text-right">
                <span className={cn(
                  "inline-block px-2 py-1 rounded-full text-xs font-medium",
                  priorityColors[item.priority as keyof typeof priorityColors]
                )}>
                  {item.priority}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{item.timeLeft}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="w-full">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
            Approve
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            Reject
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Clock className="mr-2 h-4 w-4 text-yellow-600" />
            Hold
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}