import Link from 'next/link';
import { cn, getDepartmentColor } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Employee, Task } from '@journeyman/shared';

interface EmployeeCardProps {
  employee: Employee;
  currentTask?: Task;
}

const departmentBadgeVariant: Record<string, 'default' | 'secondary' | 'accent' | 'success' | 'warning'> = {
  Operations: 'default',
  Executive: 'secondary',
  Sales: 'accent',
  'Customer Success': 'success',
  Marketing: 'warning',
  Strategy: 'default',
  HR: 'warning',
  Finance: 'secondary',
};

export function EmployeeCard({ employee, currentTask }: EmployeeCardProps) {
  const gradient = getDepartmentColor(employee.department);

  return (
    <Link href={`/dashboard/employees/${employee.id}`} className="block group">
      <div className="relative rounded-xl border border-surface-800/50 bg-surface-800/30 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-surface-700/50 hover:bg-surface-800/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/5">
        {/* Department accent bar */}
        <div className={cn('h-1 bg-gradient-to-r', gradient)} />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <Avatar name={employee.name} department={employee.department} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-surface-100 group-hover:text-white transition-colors">
                {employee.name}
              </h3>
              <p className="text-sm text-surface-400 truncate">{employee.roleTitle}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant={departmentBadgeVariant[employee.department] || 'secondary'}>
                  {employee.department}
                </Badge>
                <StatusBadge status={employee.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Current task */}
          {currentTask && (
            <div className="text-xs text-surface-500">
              <span className="text-surface-600">Working on: </span>
              <span className="italic text-surface-400">{currentTask.title}</span>
            </div>
          )}

          {/* Metrics */}
          <div className="flex items-center gap-3 pt-2 border-t border-surface-800/50">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-semibold text-surface-200">
                {employee.tasksCompleted}
              </span>
              <span className="text-[10px] text-surface-500 uppercase">tasks</span>
            </div>
            <div className="w-px h-3 bg-surface-700" />
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-semibold text-surface-200">
                {Math.round(employee.autonomyScore * 100)}%
              </span>
              <span className="text-[10px] text-surface-500 uppercase">autonomy</span>
            </div>
            {employee.escalationRate > 0.05 && (
              <>
                <div className="w-px h-3 bg-surface-700" />
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-semibold text-warning-400">
                    {Math.round(employee.escalationRate * 100)}%
                  </span>
                  <span className="text-[10px] text-surface-500 uppercase">esc.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hover gradient border overlay */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(6,182,212,0.05))',
        }} />
      </div>
    </Link>
  );
}
