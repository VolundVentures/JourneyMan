'use client';

import { Users, CheckSquare, Clock, AlertTriangle, UserPlus, TrendingUp, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeCard } from '@/components/dashboard/employee-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Gauge } from '@/components/ui/gauge';
import { Progress } from '@/components/ui/progress';
import { employeeEmojis } from '@/lib/utils';
import type { Employee, Task, ActivityEntry } from '@journeyman/shared';
import type { DashboardStats } from '@/lib/data';

interface DashboardViewProps {
  stats: DashboardStats;
  employees: Employee[];
  tasks: Task[];
  activities: ActivityEntry[];
  orgName: string;
}

export function DashboardView({ stats, employees, tasks, activities, orgName }: DashboardViewProps) {
  const activeEmployees = employees.filter((e) => e.status !== 'terminated');

  const currentTaskByEmployee = new Map<string, Task>();
  for (const task of tasks) {
    if (task.status === 'in_progress' && !currentTaskByEmployee.has(task.employeeId)) {
      currentTaskByEmployee.set(task.employeeId, task);
    }
  }

  // Operational Health score
  const taskSuccessRate = stats.totalTaskCount > 0
    ? (stats.completedTasksCount / stats.totalTaskCount) * 100
    : 0;
  const approvalSpeed = 85;
  const escalationLoad = stats.openEscalationsCount === 0
    ? 100
    : Math.max(0, 100 - stats.openEscalationsCount * 20);
  const uptime = 99.8;
  const overallHealth = Math.round((taskSuccessRate + approvalSpeed + escalationLoad + uptime) / 4);

  // Real-time ticker events (from actual activity data)
  const tickerEvents = activities.slice(0, 6).map((a) => ({
    emoji: activityEmoji(a.action),
    text: `${a.employeeName} ${a.description.toLowerCase().startsWith(a.employeeName.toLowerCase()) ? a.description.slice(a.employeeName.length).trim() : a.description}`,
    time: formatTimeAgo(a.timestamp),
  }));

  // Employee workload heatmap
  const workloads = activeEmployees.map((emp) => {
    const empTasks = tasks.filter((t) => t.employeeId === emp.id);
    const active = empTasks.filter((t) => t.status === 'in_progress' || t.status === 'queued').length;
    return { employee: emp, active, total: empTasks.length };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Your AI Workforce
          </h1>
          <p className="mt-2 text-neutral-500">
            {orgName} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Link href="/dashboard/hire">
          <Button>
            <UserPlus className="w-4 h-4" />
            Hire Employee
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="AI Employees"
          value={stats.activeEmployeeCount}
          icon={Users}
          trend={{ value: 12, label: 'vs last month' }}
          subtitle={`${stats.onboardingCount} onboarding`}
        />
        <StatCard
          label="Tasks Today"
          value={stats.tasksTodayCount}
          icon={CheckSquare}
          trend={{ value: 8, label: 'vs yesterday' }}
        />
        <StatCard
          label="Pending Approvals"
          value={stats.pendingApprovalsCount}
          icon={Clock}
          trend={{ value: -15, label: 'vs last week' }}
          pulseOnPositive
        />
        <StatCard
          label="Active Escalations"
          value={stats.openEscalationsCount}
          icon={AlertTriangle}
          trend={{ value: 0, label: 'same as yesterday' }}
          pulseOnPositive
        />
      </div>

      {/* Operational Health + Real-Time Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Operational Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-4 h-4 text-neutral-500" />
              Operational Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Gauge value={overallHealth} size="lg" color="success" />
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Task Success</span>
                    <span className="text-neutral-600">{Math.round(taskSuccessRate)}%</span>
                  </div>
                  <Progress value={taskSuccessRate} indicatorClassName="bg-emerald-400" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Approval Speed</span>
                    <span className="text-neutral-600">{approvalSpeed}%</span>
                  </div>
                  <Progress value={approvalSpeed} indicatorClassName="bg-blue-400" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Escalation Load</span>
                    <span className="text-neutral-600">{escalationLoad}%</span>
                  </div>
                  <Progress value={escalationLoad} indicatorClassName="bg-amber-400" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Uptime</span>
                    <span className="text-neutral-600">{uptime}%</span>
                  </div>
                  <Progress value={uptime} indicatorClassName="bg-neutral-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Ticker */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-neutral-500" />
              Live Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tickerEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 text-sm border-b border-neutral-200 last:border-0">
                  <span className="text-base shrink-0">{event.emoji}</span>
                  <span className="flex-1 text-neutral-600">{event.text}</span>
                  <span className="text-xs text-neutral-400 shrink-0">{event.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workload Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-neutral-500" />
            Employee Workload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workloads.map(({ employee, active, total }) => {
              const utilization = total > 0 ? (active / Math.max(total, 5)) * 100 : 0;
              const emoji = employeeEmojis[employee.id] || '🤖';
              return (
                <div key={employee.id} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center">{emoji}</span>
                  <span className="text-sm text-neutral-600 w-24 truncate">{employee.name}</span>
                  <div className="flex-1">
                    <Progress
                      value={utilization}
                      indicatorClassName={
                        utilization > 80 ? 'bg-red-400' :
                        utilization > 60 ? 'bg-amber-400' :
                        'bg-emerald-400'
                      }
                    />
                  </div>
                  <span className="text-xs text-neutral-500 w-20 text-right">{active} active / {total} total</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Employee grid */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">
          AI Employees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              currentTask={currentTaskByEmployee.get(employee.id)}
            />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="border-t border-neutral-200 pt-8">
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}

function activityEmoji(action: string): string {
  const map: Record<string, string> = {
    task_completed: '✅',
    task_started: '▶️',
    escalation_created: '🚨',
    approval_requested: '🔒',
    message_sent: '📧',
    knowledge_ingested: '📚',
    decision: '💡',
    action: '⚡',
    thinking: '🧠',
    communication: '💬',
    error: '❌',
    waiting: '⏳',
  };
  return map[action] ?? '⚡';
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}
