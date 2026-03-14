import Link from 'next/link';
import { cn, employeeEmojis } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import type { Employee, Task } from '@journeyman/shared';

interface EmployeeCardProps {
  employee: Employee;
  currentTask?: Task;
}

export function EmployeeCard({ employee, currentTask }: EmployeeCardProps) {
  const emoji = employeeEmojis[employee.id];

  return (
    <Link href={`/dashboard/employees/${employee.id}`} className="block group">
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden transition-colors hover:bg-neutral-50 hover:border-neutral-300">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <Avatar name={employee.name} emoji={emoji} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-900 transition-colors">
                {employee.name}
              </h3>
              <p className="text-sm text-neutral-500 truncate">{employee.roleTitle}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant="secondary">
                  {employee.department}
                </Badge>
                <StatusBadge status={employee.status} size="sm" />
              </div>
            </div>
          </div>

          {/* Current task */}
          {currentTask && (
            <div className="text-xs text-neutral-500">
              <span className="text-neutral-400">Working on: </span>
              <span className="italic text-neutral-500">{currentTask.title}</span>
            </div>
          )}

          {/* Metrics */}
          <div className="flex items-center gap-3 pt-3 border-t border-neutral-200">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-semibold text-neutral-700">
                {employee.tasksCompleted}
              </span>
              <span className="text-[10px] text-neutral-500 uppercase">tasks</span>
            </div>
            <div className="w-px h-3 bg-neutral-200" />
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-semibold text-neutral-700">
                {Math.round(employee.autonomyScore * 100)}%
              </span>
              <span className="text-[10px] text-neutral-500 uppercase">autonomy</span>
            </div>
            {employee.escalationRate > 0.05 && (
              <>
                <div className="w-px h-3 bg-neutral-200" />
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-semibold text-neutral-500">
                    {Math.round(employee.escalationRate * 100)}%
                  </span>
                  <span className="text-[10px] text-neutral-500 uppercase">esc.</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
