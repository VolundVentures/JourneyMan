'use client';

import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mockEmployees, mockTasks } from '@/lib/mock-data';
import { employeeEmojis, getTaskStatusColor } from '@/lib/utils';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const hours = Array.from({ length: 10 }, (_, i) => i + 8);

const tasksByEmployee = mockEmployees
  .filter((e) => e.status !== 'terminated')
  .map((emp) => {
    const tasks = mockTasks.filter((t) => t.employeeId === emp.id);
    const utilization = Math.min(100, tasks.length * 20);
    return { employee: emp, tasks, utilization };
  });

export default function TimelinePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            Timeline
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Visual task scheduling and capacity overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
          <Badge variant="outline">Week of Feb 24 — Feb 28, 2026</Badge>
          <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Gantt-like view */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header row */}
            <div className="flex border-b border-neutral-800 pb-2 mb-4">
              <div className="w-40 shrink-0" />
              {days.map((day) => (
                <div key={day} className="flex-1 text-center text-xs font-semibold text-neutral-500 uppercase">
                  {day}
                </div>
              ))}
              <div className="w-24 shrink-0 text-center text-xs font-semibold text-neutral-500 uppercase">
                Utilization
              </div>
            </div>

            {/* Employee rows */}
            {tasksByEmployee.map(({ employee, tasks, utilization }) => {
              const emoji = employeeEmojis[employee.id] || '🤖';
              return (
                <div key={employee.id} className="flex items-center py-3 border-b border-neutral-800/50 last:border-0">
                  <div className="w-40 shrink-0 flex items-center gap-2">
                    <span className="text-lg">{emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-neutral-200">{employee.name}</p>
                      <p className="text-[10px] text-neutral-600">{employee.department}</p>
                    </div>
                  </div>

                  {/* Task bars across the week */}
                  <div className="flex-1 flex gap-1">
                    {days.map((day, dayIdx) => {
                      const dayTasks = tasks.slice(dayIdx, dayIdx + 1);
                      return (
                        <div key={day} className="flex-1 flex gap-0.5">
                          {dayTasks.length > 0 ? (
                            dayTasks.map((task) => (
                              <div
                                key={task.id}
                                className={cn(
                                  'flex-1 h-8 rounded px-2 flex items-center text-[10px] font-medium truncate',
                                  getTaskStatusColor(task.status)
                                )}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            ))
                          ) : (
                            <div className="flex-1 h-8 rounded bg-neutral-900/50 border border-neutral-800/30" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Utilization bar */}
                  <div className="w-24 shrink-0 px-2">
                    <Progress
                      value={utilization}
                      className="h-2"
                      indicatorClassName={
                        utilization > 80 ? 'bg-red-400' :
                        utilization > 60 ? 'bg-amber-400' :
                        'bg-emerald-400'
                      }
                    />
                    <p className="text-[10px] text-neutral-600 text-center mt-1">{utilization}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-950/50 border border-emerald-800/50" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-neutral-800 border border-neutral-700/50" />
          In Progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-950/50 border border-amber-800/50" />
          Awaiting Approval
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-950/50 border border-red-800/50" />
          Escalated
        </span>
      </div>
    </div>
  );
}
