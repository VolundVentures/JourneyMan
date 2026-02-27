'use client';

import { Users, CheckSquare, Clock, AlertTriangle, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { EmployeeCard } from '@/components/dashboard/employee-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import {
  mockEmployees,
  mockTasks,
  mockApprovals,
  mockEscalations,
  mockActivities,
} from '@/lib/mock-data';

export default function DashboardPage() {
  const activeEmployees = mockEmployees.filter((e) => e.status !== 'terminated');
  const onboardingCount = mockEmployees.filter((e) => e.status === 'onboarding').length;
  const todayTasks = mockTasks.filter((t) => t.status === 'completed' || t.status === 'in_progress').length;
  const pendingApprovals = mockApprovals.filter((a) => a.status === 'pending').length;
  const openEscalations = mockEscalations.filter((e) => e.status === 'open').length;

  // Find current task for each employee
  const currentTaskByEmployee = new Map<string, (typeof mockTasks)[0]>();
  for (const task of mockTasks) {
    if (task.status === 'in_progress' && !currentTaskByEmployee.has(task.employeeId)) {
      currentTaskByEmployee.set(task.employeeId, task);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero section */}
      <div className="relative overflow-hidden rounded-2xl p-8 mesh-bg">
        <div className="relative z-10">
          <h1 className="font-heading text-3xl font-bold text-surface-50">
            Your AI Workforce
          </h1>
          <p className="mt-2 text-surface-400 max-w-xl">
            Volund Ventures · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {/* Decorative gradient orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent-500/5 blur-2xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="AI Employees"
          value={activeEmployees.length}
          icon={Users}
          iconColor="text-brand-400 bg-brand-500/10"
          trend={{ value: 12, label: 'vs last month' }}
          subtitle={`${onboardingCount} onboarding`}
        />
        <StatCard
          label="Tasks Today"
          value={todayTasks}
          icon={CheckSquare}
          iconColor="text-accent-400 bg-accent-500/10"
          trend={{ value: 8, label: 'vs yesterday' }}
        />
        <StatCard
          label="Pending Approvals"
          value={pendingApprovals}
          icon={Clock}
          iconColor="text-warning-400 bg-warning-500/10"
          trend={{ value: -15, label: 'vs last week' }}
          pulseOnPositive
        />
        <StatCard
          label="Active Escalations"
          value={openEscalations}
          icon={AlertTriangle}
          iconColor="text-destructive-400 bg-destructive-500/10"
          trend={{ value: 0, label: 'same as yesterday' }}
          pulseOnPositive
        />
      </div>

      {/* Employee grid header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-surface-100">
          AI Employees
        </h2>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/hire">
            <Button size="sm">
              <UserPlus className="w-4 h-4" />
              Hire New Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {activeEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            currentTask={currentTaskByEmployee.get(employee.id)}
          />
        ))}
      </div>

      {/* Activity Feed */}
      <div className="border-t border-surface-800/50 pt-8">
        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  );
}
