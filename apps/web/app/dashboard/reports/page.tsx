'use client';

import { FileText, Plus, Download, Calendar, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom';
  lastGenerated: string;
  schedule: string | null;
  format: 'pdf' | 'csv' | 'pptx';
  status: 'ready' | 'generating' | 'scheduled';
}

const mockReports: Report[] = [
  { id: 'rpt-1', name: 'Weekly Operations Summary', description: 'Task completions, escalations, and employee performance for the week', type: 'weekly', lastGenerated: '2026-02-28T09:00:00Z', schedule: 'Every Friday at 9 AM', format: 'pdf', status: 'ready' },
  { id: 'rpt-2', name: 'Monthly Sales Pipeline', description: 'Lead progression, deal values, conversion rates, and Apex performance', type: 'monthly', lastGenerated: '2026-02-01T09:00:00Z', schedule: 'First Monday of each month', format: 'pdf', status: 'ready' },
  { id: 'rpt-3', name: 'Q1 2026 Review', description: 'Comprehensive quarterly review across all departments and employees', type: 'quarterly', lastGenerated: null!, schedule: null, format: 'pptx', status: 'scheduled' },
  { id: 'rpt-4', name: 'Cost & ROI Analysis', description: 'AI employee costs vs human equivalent savings and ROI breakdown', type: 'monthly', lastGenerated: '2026-02-15T09:00:00Z', schedule: '15th of each month', format: 'csv', status: 'ready' },
  { id: 'rpt-5', name: 'Communication Analytics', description: 'Message volumes, response times, sentiment scores by channel and employee', type: 'weekly', lastGenerated: '2026-02-28T09:00:00Z', schedule: 'Every Monday at 8 AM', format: 'pdf', status: 'ready' },
  { id: 'rpt-6', name: 'Board Deck — February', description: 'Executive summary for board presentation', type: 'custom', lastGenerated: null!, schedule: null, format: 'pptx', status: 'generating' },
];

const typeColors: Record<string, string> = {
  weekly: 'bg-blue-50 text-blue-600',
  monthly: 'bg-purple-50 text-purple-600',
  quarterly: 'bg-amber-50 text-amber-600',
  custom: 'bg-neutral-100 text-neutral-500',
};

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
            <FileText className="w-6 h-6" />
            Reports
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Automated and custom reports with scheduled delivery
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockReports.map((report) => (
          <Card key={report.id} className="hover:border-neutral-300 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={typeColors[report.type]}>{report.type}</Badge>
                <Badge variant="outline" className="text-[10px] uppercase">{report.format}</Badge>
              </div>
              <CardTitle className="text-sm mt-2">{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-neutral-500 mb-4">{report.description}</p>

              <div className="space-y-2 text-xs text-neutral-500">
                {report.schedule && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{report.schedule}</span>
                  </div>
                )}
                {report.lastGenerated && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>Last: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {report.status === 'ready' && (
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                )}
                {report.status === 'generating' && (
                  <Button variant="outline" size="sm" className="flex-1 text-xs" disabled>
                    <Clock className="w-3 h-3 animate-spin" /> Generating...
                  </Button>
                )}
                {report.status === 'scheduled' && (
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    Generate Now
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-xs">
                  <Mail className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
