'use client';

import { DollarSign, TrendingDown, Clock, Users, Calculator, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge } from '@/components/ui/gauge';
import { cn } from '@/lib/utils';
import { mockEmployees } from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

const costData = [
  { employeeId: 'emp-001', name: 'Atlas', cost: 280, tasks: 342, costPerTask: 0.82 },
  { employeeId: 'emp-002', name: 'Nova', cost: 200, tasks: 189, costPerTask: 1.06 },
  { employeeId: 'emp-003', name: 'Apex', cost: 450, tasks: 567, costPerTask: 0.79 },
  { employeeId: 'emp-004', name: 'Sage', cost: 320, tasks: 234, costPerTask: 1.37 },
  { employeeId: 'emp-005', name: 'Ember', cost: 380, tasks: 445, costPerTask: 0.85 },
  { employeeId: 'emp-006', name: 'Flux', cost: 220, tasks: 298, costPerTask: 0.74 },
];

const totalAICost = costData.reduce((s, d) => s + d.cost, 0);
const totalTasks = costData.reduce((s, d) => s + d.tasks, 0);
const humanHours = Math.round(totalTasks * 0.25);
const humanCost = humanHours * 50;
const roi = Math.round(humanCost / totalAICost * 10) / 10;

export default function CostAnalysisPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <DollarSign className="w-6 h-6" />
          Cost Analysis & ROI
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          AI employee costs vs. human equivalent savings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total AI Cost" value={totalAICost} icon={DollarSign} trend={{ value: -8, label: 'vs last month' }} subtitle="This month" />
        <StatCard label="Tasks Completed" value={totalTasks} icon={Calculator} trend={{ value: 23, label: 'increase' }} />
        <StatCard label="Human Hours Saved" value={humanHours} icon={Clock} trend={{ value: 18, label: 'vs last month' }} />
        <StatCard label="ROI Multiple" value={roi} icon={TrendingDown} trend={{ value: 12, label: 'improvement' }} subtitle={`${roi}x return on AI spend`} />
      </div>

      {/* ROI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="w-4 h-4 text-neutral-500" />
            ROI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-700">{totalTasks.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">tasks completed</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-700">{humanHours}h</p>
              <p className="text-xs text-neutral-500">human equivalent</p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
            <div className="text-center">
              <p className="text-3xl font-bold text-neutral-700">${humanCost.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">@ $50/hr</p>
            </div>
            <span className="text-neutral-400 text-xl">vs</span>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">${totalAICost.toLocaleString()}</p>
              <p className="text-xs text-neutral-500">AI cost</p>
            </div>
            <span className="text-neutral-400 text-xl">=</span>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">{roi}x</p>
              <p className="text-xs text-neutral-500">ROI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost by Employee */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-500" />
            Cost by Employee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costData.map((data) => (
              <div key={data.employeeId} className="flex items-center gap-4">
                <span className="text-lg w-6 text-center">{employeeEmojis[data.employeeId]}</span>
                <span className="text-sm text-neutral-700 w-20">{data.name}</span>
                <div className="flex-1">
                  <Progress
                    value={(data.cost / Math.max(...costData.map((d) => d.cost))) * 100}
                    indicatorClassName="bg-neutral-400"
                  />
                </div>
                <div className="flex items-center gap-6 text-xs text-neutral-500 shrink-0">
                  <span className="w-16 text-right font-mono">${data.cost}</span>
                  <span className="w-20 text-right">{data.tasks} tasks</span>
                  <span className="w-20 text-right font-mono">${data.costPerTask}/task</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
