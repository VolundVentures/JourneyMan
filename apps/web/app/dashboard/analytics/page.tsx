'use client';

import { BarChart3, TrendingUp, Users, DollarSign, Zap, Clock, Target, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockEmployees, mockTasks } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

const departmentData = [
  { name: 'Operations', tasks: 342, autonomy: 78, escalation: 5, cost: 280 },
  { name: 'Sales', tasks: 567, autonomy: 65, escalation: 12, cost: 450 },
  { name: 'Executive', tasks: 189, autonomy: 82, escalation: 3, cost: 200 },
  { name: 'Research', tasks: 234, autonomy: 72, escalation: 8, cost: 320 },
  { name: 'Customer Success', tasks: 445, autonomy: 70, escalation: 15, cost: 380 },
  { name: 'Content', tasks: 298, autonomy: 85, escalation: 2, cost: 220 },
];

const leaderboard = mockEmployees
  .filter((e) => e.status !== 'terminated')
  .map((emp, i) => ({
    employee: emp,
    tasksCompleted: [342, 189, 567, 234, 445, 298][i] || 100,
    autonomyRate: [78, 82, 65, 72, 70, 85][i] || 70,
    satisfaction: [4.8, 4.9, 4.5, 4.7, 4.6, 4.8][i] || 4.5,
  }))
  .sort((a, b) => b.tasksCompleted - a.tasksCompleted);

export default function AnalyticsPage() {
  const totalTasks = departmentData.reduce((sum, d) => sum + d.tasks, 0);
  const avgAutonomy = Math.round(departmentData.reduce((sum, d) => sum + d.autonomy, 0) / departmentData.length);
  const totalCost = departmentData.reduce((sum, d) => sum + d.cost, 0);
  const humanHoursSaved = Math.round(totalTasks * 0.25); // 15 min per task

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <BarChart3 className="w-6 h-6" />
          Analytics
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Organization-wide intelligence and performance insights
        </p>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tasks (Month)"
          value={totalTasks}
          icon={Zap}
          trend={{ value: 23, label: 'vs last month' }}
        />
        <StatCard
          label="Autonomy Rate"
          value={avgAutonomy}
          icon={Target}
          trend={{ value: 5, label: 'improvement' }}
          subtitle={`${avgAutonomy}% avg across all employees`}
        />
        <StatCard
          label="Hours Saved"
          value={humanHoursSaved}
          icon={Clock}
          trend={{ value: 18, label: 'vs last month' }}
          subtitle="vs human equivalent"
        />
        <StatCard
          label="AI Cost"
          value={totalCost}
          icon={DollarSign}
          trend={{ value: -8, label: 'efficiency gain' }}
          subtitle={`$${totalCost} total this month`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-neutral-500" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-700">{dept.name}</span>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>{dept.tasks} tasks</span>
                      <span>{dept.autonomy}% auto</span>
                      <span>{dept.escalation} esc.</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className="bg-emerald-500/40 rounded-l" style={{ width: `${dept.autonomy}%` }} />
                    <div className="bg-amber-500/40" style={{ width: `${dept.escalation}%` }} />
                    <div className="bg-neutral-100 rounded-r flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="w-4 h-4 text-neutral-500" />
              Employee Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, i) => {
                const emoji = employeeEmojis[entry.employee.id] || '🤖';
                return (
                  <div key={entry.employee.id} className="flex items-center gap-3 py-2">
                    <span className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      i === 0 ? 'bg-amber-400/20 text-amber-600' :
                      i === 1 ? 'bg-neutral-400/20 text-neutral-500' :
                      i === 2 ? 'bg-amber-700/20 text-amber-700' :
                      'bg-neutral-100 text-neutral-400'
                    )}>
                      {i + 1}
                    </span>
                    <span className="text-lg">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-700">{entry.employee.name}</p>
                      <p className="text-xs text-neutral-500">{entry.employee.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-700">{entry.tasksCompleted}</p>
                      <p className="text-[10px] text-neutral-500">tasks</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-neutral-600">{entry.autonomyRate}%</p>
                      <p className="text-[10px] text-neutral-500">auto</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neutral-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '📈', title: 'Apex\'s response rate improved 40%', detail: 'Since changing communication tone to "warm professional". Consider applying this to Ember too.', confidence: 92, action: 'Apply to Ember' },
              { icon: '⚠️', title: 'Atlas completion rate dropped 25%', detail: 'Correlates with increased vendor follow-up volume. Consider redistributing or hiring an ops assistant.', confidence: 85, action: 'View details' },
              { icon: '💡', title: 'Hiring recommendation', detail: 'Adding a second SDR would reduce Apex\'s queue from 15 to 8 tasks/day, increasing speed-to-contact by 60%.', confidence: 78, action: 'Start hiring' },
              { icon: '🎯', title: 'Nova exceeding all benchmarks', detail: 'Outperforming industry average for executive assistants by 2.3x in task throughput and 1.8x in satisfaction.', confidence: 95, action: 'View report' },
              { icon: '🔄', title: 'Cross-training opportunity', detail: 'Sage and Flux have complementary skills. Cross-training could improve content-research pipeline by 30%.', confidence: 72, action: 'Create plan' },
              { icon: '💰', title: 'Cost optimization available', detail: 'Ember resolves 80% of tickets without escalation. Increasing confidence threshold from 0.7 to 0.8 could save $120/month.', confidence: 88, action: 'Adjust config' },
            ].map((insight, i) => (
              <div key={i} className="p-4 rounded-lg border border-neutral-200 bg-white/50 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{insight.icon}</span>
                  <p className="text-sm font-medium text-neutral-700">{insight.title}</p>
                </div>
                <p className="text-xs text-neutral-500">{insight.detail}</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant="secondary" className="text-[10px]">{insight.confidence}% confidence</Badge>
                  <button className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors">
                    {insight.action} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
