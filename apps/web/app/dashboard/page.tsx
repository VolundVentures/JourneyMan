'use client';

import { Users, CheckSquare, Clock, AlertTriangle, UserPlus, TrendingUp, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmployeeCard } from '@/components/dashboard/employee-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Gauge } from '@/components/ui/gauge';
import { Progress } from '@/components/ui/progress';
import {
  mockEmployees,
  mockTasks,
  mockApprovals,
  mockEscalations,
  mockActivities,
} from '@/lib/mock-data';
import { employeeEmojis } from '@/lib/utils';

export default function DashboardPage() {
  const activeEmployees = mockEmployees.filter((e) => e.status !== 'terminated');
  const onboardingCount = mockEmployees.filter((e) => e.status === 'onboarding').length;
  const todayTasks = mockTasks.filter((t) => t.status === 'completed' || t.status === 'in_progress').length;
  const completedTasks = mockTasks.filter((t) => t.status === 'completed').length;
  const pendingApprovals = mockApprovals.filter((a) => a.status === 'pending').length;
  const openEscalations = mockEscalations.filter((e) => e.status === 'open').length;
  const totalTasks = mockTasks.length;

  const currentTaskByEmployee = new Map<string, (typeof mockTasks)[0]>();
  for (const task of mockTasks) {
    if (task.status === 'in_progress' && !currentTaskByEmployee.has(task.employeeId)) {
      currentTaskByEmployee.set(task.employeeId, task);
    }
  }

  // Operational Health score
  const taskSuccessRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const approvalSpeed = 85; // mock
  const escalationLoad = openEscalations === 0 ? 100 : Math.max(0, 100 - openEscalations * 20);
  const uptime = 99.8;
  const overallHealth = Math.round((taskSuccessRate + approvalSpeed + escalationLoad + uptime) / 4);

  // Real-time ticker events
  const tickerEvents = [
    { emoji: '✅', text: 'Atlas completed "Vendor Status Report"', time: '2m ago' },
    { emoji: '📧', text: 'Nova sent proposal to CloudVault Inc.', time: '5m ago' },
    { emoji: '🎯', text: 'Apex qualified 3 new leads from HubSpot', time: '12m ago' },
    { emoji: '⚡', text: 'Flux published blog post "AI in Operations"', time: '18m ago' },
    { emoji: '🔮', text: 'Sage completed market analysis for Q1', time: '25m ago' },
    { emoji: '🔥', text: 'Ember resolved 5 support tickets', time: '30m ago' },
  ];

  // Employee workload heatmap
  const workloads = activeEmployees.map((emp) => {
    const tasks = mockTasks.filter((t) => t.employeeId === emp.id);
    const active = tasks.filter((t) => t.status === 'in_progress' || t.status === 'queued').length;
    return { employee: emp, active, total: tasks.length };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-50">
            Your AI Workforce
          </h1>
          <p className="mt-2 text-neutral-500">
            Volund Ventures · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
          value={activeEmployees.length}
          icon={Users}
          trend={{ value: 12, label: 'vs last month' }}
          subtitle={`${onboardingCount} onboarding`}
        />
        <StatCard
          label="Tasks Today"
          value={todayTasks}
          icon={CheckSquare}
          trend={{ value: 8, label: 'vs yesterday' }}
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals}
          icon={Clock}
          trend={{ value: -15, label: 'vs last week' }}
          pulseOnPositive
        />
        <StatCard
          label="Active Escalations"
          value={openEscalations}
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
                    <span className="text-neutral-300">{Math.round(taskSuccessRate)}%</span>
                  </div>
                  <Progress value={taskSuccessRate} indicatorClassName="bg-emerald-400" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Approval Speed</span>
                    <span className="text-neutral-300">{approvalSpeed}%</span>
                  </div>
                  <Progress value={approvalSpeed} indicatorClassName="bg-blue-400" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Escalation Load</span>
                    <span className="text-neutral-300">{escalationLoad}%</span>
                  </div>
                  <Progress value={escalationLoad} indicatorClassName="bg-amber-400" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-500">Uptime</span>
                    <span className="text-neutral-300">{uptime}%</span>
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
                <div key={i} className="flex items-center gap-3 py-1.5 text-sm border-b border-neutral-800/50 last:border-0">
                  <span className="text-base shrink-0">{event.emoji}</span>
                  <span className="flex-1 text-neutral-300">{event.text}</span>
                  <span className="text-xs text-neutral-600 shrink-0">{event.time}</span>
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
                  <span className="text-sm text-neutral-300 w-24 truncate">{employee.name}</span>
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
        <h2 className="text-xl font-semibold text-neutral-100 mb-4">
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
      <div className="border-t border-neutral-800 pt-8">
        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  );
}
