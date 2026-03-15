'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';

const data = [
  { industry: 'Technology', count: 42 },
  { industry: 'Finance', count: 38 },
  { industry: 'Healthcare', count: 31 },
  { industry: 'Manufacturing', count: 28 },
  { industry: 'Retail', count: 24 },
  { industry: 'Education', count: 19 },
];

export function TopIndustries() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-orange-600" />
          Top Industries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-62.5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis type="number" className="text-xs" />
              <YAxis dataKey="industry" type="category" width={80} className="text-xs" />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}