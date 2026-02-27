'use client';

import { useState } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar } from '@/components/ui/avatar';
import { EmployeeCard } from '@/components/dashboard/employee-card';
import { mockEmployees, mockTasks } from '@/lib/mock-data';
import { cn, employeeEmojis } from '@/lib/utils';
import Link from 'next/link';
import type { EmployeeStatus } from '@journeyman/shared';

export default function EmployeesPage() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');

  const filtered = mockEmployees.filter((emp) => {
    const matchesSearch =
      search === '' ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.roleTitle.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentTaskByEmployee = new Map<string, (typeof mockTasks)[0]>();
  for (const task of mockTasks) {
    if (task.status === 'in_progress' && !currentTaskByEmployee.has(task.employeeId)) {
      currentTaskByEmployee.set(task.employeeId, task);
    }
  }

  const statuses: (EmployeeStatus | 'all')[] = ['all', 'active', 'supervised', 'onboarding', 'paused', 'terminated'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50">Employees</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage your AI workforce</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <Input
            placeholder="Search by name, role, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                statusFilter === status
                  ? 'bg-neutral-800 text-neutral-50 border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800 border border-transparent'
              )}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && (
                <span className="ml-1 text-neutral-500">({mockEmployees.length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto bg-neutral-800 rounded-lg p-0.5">
          <button
            onClick={() => setView('grid')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              view === 'grid' ? 'bg-neutral-700 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('table')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              view === 'table' ? 'bg-neutral-700 text-neutral-200' : 'text-neutral-500 hover:text-neutral-300'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              currentTask={currentTaskByEmployee.get(employee.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Tasks</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Autonomy</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Reports To</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/employees/${employee.id}`} className="flex items-center gap-3 group">
                      <Avatar name={employee.name} emoji={employeeEmojis[employee.id]} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                          {employee.name}
                        </p>
                        <p className="text-xs text-neutral-500">{employee.roleTitle}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{employee.department}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={employee.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-neutral-300">{employee.tasksCompleted}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-neutral-300">
                      {Math.round(employee.autonomyScore * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-400">{employee.reportsToName || '—'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neutral-500">No employees match your filters.</p>
        </div>
      )}
    </div>
  );
}
