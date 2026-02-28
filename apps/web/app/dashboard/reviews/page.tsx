'use client';

import { BarChart3, Star, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockEmployees } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

interface ReviewSummary {
  employeeId: string;
  period: string;
  overallGrade: string;
  headline: string;
  categories: { name: string; score: number; trend: 'up' | 'down' | 'stable' }[];
  highlights: string[];
}

const mockReviews: ReviewSummary[] = [
  {
    employeeId: 'emp-001',
    period: 'February 2026',
    overallGrade: 'A',
    headline: 'Atlas continues to deliver exceptional operational consistency with zero missed deadlines.',
    categories: [
      { name: 'Productivity', score: 92, trend: 'up' },
      { name: 'Quality', score: 88, trend: 'stable' },
      { name: 'Autonomy', score: 78, trend: 'up' },
      { name: 'Collaboration', score: 85, trend: 'stable' },
      { name: 'Learning', score: 80, trend: 'up' },
      { name: 'Cost Efficiency', score: 95, trend: 'up' },
    ],
    highlights: ['Reduced vendor follow-up time by 30%', 'Zero escalations this month', 'Proactively identified 2 process improvements'],
  },
  {
    employeeId: 'emp-002',
    period: 'February 2026',
    overallGrade: 'A+',
    headline: 'Nova is the highest-performing employee, outpacing industry benchmarks by 2.3x.',
    categories: [
      { name: 'Productivity', score: 96, trend: 'up' },
      { name: 'Quality', score: 94, trend: 'up' },
      { name: 'Autonomy', score: 82, trend: 'stable' },
      { name: 'Collaboration', score: 90, trend: 'up' },
      { name: 'Learning', score: 88, trend: 'stable' },
      { name: 'Cost Efficiency', score: 91, trend: 'stable' },
    ],
    highlights: ['Prepared 15 executive briefings with 100% approval rate', 'Proactively anticipated 3 scheduling conflicts', 'Achieved highest satisfaction score across all employees'],
  },
  {
    employeeId: 'emp-003',
    period: 'February 2026',
    overallGrade: 'B+',
    headline: 'Apex shows strong lead qualification but needs improvement in competitive objection handling.',
    categories: [
      { name: 'Productivity', score: 85, trend: 'up' },
      { name: 'Quality', score: 72, trend: 'down' },
      { name: 'Autonomy', score: 65, trend: 'stable' },
      { name: 'Collaboration', score: 78, trend: 'up' },
      { name: 'Learning', score: 82, trend: 'up' },
      { name: 'Cost Efficiency', score: 88, trend: 'stable' },
    ],
    highlights: ['Qualified 47 leads this month (up 23%)', 'Response rate improved 40% after tone adjustment', 'Competitive pricing scenarios still trigger escalation 60% of the time'],
  },
];

const gradeColors: Record<string, string> = {
  'A+': 'text-emerald-400 bg-emerald-950/50',
  'A': 'text-emerald-400 bg-emerald-950/50',
  'B+': 'text-blue-400 bg-blue-950/50',
  'B': 'text-blue-400 bg-blue-950/50',
  'C': 'text-amber-400 bg-amber-950/50',
  'D': 'text-red-400 bg-red-950/50',
};

export default function ReviewsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <BarChart3 className="w-6 h-6" />
            Performance Reviews
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            AI-generated performance insights for your workforce
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            February 2026
          </Badge>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {mockReviews.map((review) => {
          const employee = mockEmployees.find((e) => e.id === review.employeeId);
          if (!employee) return null;
          const emoji = employeeEmojis[employee.id] || '🤖';

          return (
            <Card key={review.employeeId}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Employee info + grade */}
                  <div className="text-center shrink-0">
                    <span className="text-3xl">{emoji}</span>
                    <p className="text-sm font-semibold text-neutral-200 mt-1">{employee.name}</p>
                    <p className="text-xs text-neutral-500">{employee.roleTitle}</p>
                    <div className={cn('mt-2 text-2xl font-bold rounded-lg px-3 py-1', gradeColors[review.overallGrade])}>
                      {review.overallGrade}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Headline */}
                    <p className="text-sm text-neutral-300 mb-4 italic">&ldquo;{review.headline}&rdquo;</p>

                    {/* Categories */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                      {review.categories.map((cat) => (
                        <div key={cat.name} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-neutral-500">{cat.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-mono text-neutral-300">{cat.score}</span>
                              {cat.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                              {cat.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                            </div>
                          </div>
                          <Progress
                            value={cat.score}
                            indicatorClassName={cat.score >= 85 ? 'bg-emerald-400' : cat.score >= 70 ? 'bg-blue-400' : 'bg-amber-400'}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Key Highlights</p>
                      <ul className="space-y-1">
                        {review.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                            <Star className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button variant="outline" size="sm">View Full Review</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
