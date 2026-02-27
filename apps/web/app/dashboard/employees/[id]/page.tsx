'use client';

import { useParams } from 'next/navigation';
import { use } from 'react';
import {
  Pause,
  Play,
  Settings,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Brain,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  mockEmployees,
  mockTasks,
  mockActivities,
  mockMemories,
  mockPerformanceByEmployee,
} from '@/lib/mock-data';
import { cn, formatRelativeTime, getTaskStatusColor } from '@/lib/utils';

export default function EmployeeProfilePage() {
  const params = useParams();
  const employee = mockEmployees.find((e) => e.id === params.id);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-surface-400">Employee not found.</p>
        <Link href="/dashboard/employees" className="mt-4 text-brand-400 hover:text-brand-300">
          Back to Employees
        </Link>
      </div>
    );
  }

  const employeeTasks = mockTasks.filter((t) => t.employeeId === employee.id);
  const employeeActivities = mockActivities.filter((a) => a.employeeId === employee.id);
  const performance = mockPerformanceByEmployee[employee.id];
  const daysHired = Math.floor((Date.now() - new Date(employee.hiredAt).getTime()) / 86400000);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/dashboard/employees"
        className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </Link>

      {/* Header */}
      <div className="relative rounded-xl border border-surface-800/50 bg-surface-800/30 backdrop-blur-sm p-6 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
          <Avatar name={employee.name} department={employee.department} size="xl" />

          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="font-heading text-2xl font-bold text-surface-50">{employee.name}</h1>
              <StatusBadge status={employee.status} size="lg" />
            </div>

            <p className="text-surface-400">{employee.roleTitle} · {employee.department}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500">
              {employee.reportsToName && (
                <span>Reports to <span className="text-surface-300">{employee.reportsToName}</span></span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Hired {daysHired} days ago
              </span>
              {employee.emailAddress && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {employee.emailAddress}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              {employee.slackUserId && <Badge variant="secondary"><MessageSquare className="w-3 h-3 mr-1" />Slack</Badge>}
              {employee.emailAddress && <Badge variant="secondary"><Mail className="w-3 h-3 mr-1" />Email</Badge>}
              {employee.phoneNumber && <Badge variant="secondary"><Phone className="w-3 h-3 mr-1" />Phone</Badge>}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {employee.status === 'active' || employee.status === 'supervised' ? (
              <Button variant="outline" size="sm"><Pause className="w-4 h-4" />Pause</Button>
            ) : employee.status === 'paused' ? (
              <Button variant="outline" size="sm"><Play className="w-4 h-4" />Resume</Button>
            ) : null}
            <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" className="text-destructive-400 hover:text-destructive-300 hover:bg-destructive-500/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-500/5 blur-3xl" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <div className="space-y-2">
            {employeeActivities.length === 0 ? (
              <p className="text-center py-12 text-surface-500">No recent activity.</p>
            ) : (
              employeeActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-800/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-surface-800 border border-surface-700/50 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-surface-300">{activity.description}</p>
                    <p className="text-[10px] text-surface-500 mt-0.5 font-mono">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="rounded-xl border border-surface-800/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Task</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Confidence</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody>
                {employeeTasks.map((task) => (
                  <tr key={task.id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm text-surface-200">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-surface-500 mt-0.5 truncate max-w-xs">{task.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', getTaskStatusColor(task.status))}>
                        {task.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16">
                          <Progress value={task.priority} />
                        </div>
                        <span className="font-mono text-xs text-surface-400">{task.priority}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{task.source.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {task.confidenceScore ? (
                        <span className={cn(
                          'font-mono text-sm',
                          task.confidenceScore >= 0.85 ? 'text-success-400' :
                          task.confidenceScore >= 0.60 ? 'text-warning-400' : 'text-destructive-400'
                        )}>
                          {Math.round(task.confidenceScore * 100)}%
                        </span>
                      ) : (
                        <span className="text-surface-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-surface-500 font-mono">
                      {formatRelativeTime(task.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          {performance ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-4">
                  <p className="text-xs text-surface-500 uppercase tracking-wider">Tasks This Week</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-surface-100">{performance.tasksCompletedWeek}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success-400" />
                    <span className="text-xs text-success-400">+12% vs last week</span>
                  </div>
                </div>
                <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-4">
                  <p className="text-xs text-surface-500 uppercase tracking-wider">Autonomy Rate</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-surface-100">
                    {Math.round(performance.autonomousCompletionRate * 100)}%
                  </p>
                  <Progress value={performance.autonomousCompletionRate * 100} className="mt-2" />
                </div>
                <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-4">
                  <p className="text-xs text-surface-500 uppercase tracking-wider">Avg Response</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-surface-100">
                    {(performance.avgResponseTimeMs / 1000).toFixed(1)}s
                  </p>
                  <p className="mt-1 text-xs text-surface-500">p95: {(performance.avgResponseTimeP95Ms / 1000).toFixed(1)}s</p>
                </div>
                <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-4">
                  <p className="text-xs text-surface-500 uppercase tracking-wider">Escalation Rate</p>
                  <p className={cn(
                    'mt-2 font-heading text-2xl font-bold',
                    performance.escalationRate <= 0.05 ? 'text-success-400' : 'text-warning-400'
                  )}>
                    {Math.round(performance.escalationRate * 100)}%
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-success-400" />
                    <span className="text-xs text-success-400">Improving</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-6">
                <h3 className="font-heading text-lg font-semibold text-surface-200 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-surface-500">Accuracy Rate</p>
                    <p className="mt-1 font-mono text-lg text-surface-200">{Math.round(performance.accuracyRate * 100)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Manager Satisfaction</p>
                    <p className="mt-1 font-mono text-lg text-surface-200">{performance.managerSatisfactionScore}/5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Cost Per Task</p>
                    <p className="mt-1 font-mono text-lg text-surface-200">${performance.costPerTask.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Tasks Today</p>
                    <p className="mt-1 font-mono text-lg text-surface-200">{performance.tasksCompletedToday}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-500">Tasks This Month</p>
                    <p className="mt-1 font-mono text-lg text-surface-200">{performance.tasksCompletedMonth}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center py-12 text-surface-500">No performance data available.</p>
          )}
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory">
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <Input placeholder="Search memories..." className="pl-9" />
            </div>

            <div className="space-y-3">
              {mockMemories.map((memory) => (
                <div key={memory.id} className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-4 hover:bg-surface-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          memory.category === 'preference' ? 'default' :
                          memory.category === 'pattern' ? 'accent' :
                          memory.category === 'relationship' ? 'success' :
                          memory.category === 'rule' ? 'warning' : 'secondary'
                        }>
                          {memory.category}
                        </Badge>
                        <span className="text-xs text-surface-500 font-medium">{memory.subject}</span>
                      </div>
                      <p className="text-sm text-surface-300 leading-relaxed">{memory.content}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono text-xs text-surface-500">
                        {Math.round(memory.confidence * 100)}% conf.
                      </p>
                      <p className="text-[10px] text-surface-600 mt-0.5">
                        {memory.sourceCount} sources
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config">
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-surface-800/50 bg-surface-800/30 p-6 space-y-5">
              <h3 className="font-heading text-lg font-semibold text-surface-200">Behavioral Settings</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Communication Tone</label>
                  <select className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                    <option value="professional" selected={employee.config.communicationTone === 'professional'}>Professional</option>
                    <option value="casual" selected={employee.config.communicationTone === 'casual'}>Casual</option>
                    <option value="formal" selected={employee.config.communicationTone === 'formal'}>Formal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Proactivity Level</label>
                  <select className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                    <option value="low" selected={employee.config.proactivityLevel === 'low'}>Low</option>
                    <option value="medium" selected={employee.config.proactivityLevel === 'medium'}>Medium</option>
                    <option value="high" selected={employee.config.proactivityLevel === 'high'}>High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Autonomy Mode</label>
                  <select className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3 py-2 text-sm text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                    <option value="supervised" selected={employee.config.autonomyMode === 'supervised'}>Supervised</option>
                    <option value="semi-autonomous" selected={employee.config.autonomyMode === 'semi-autonomous'}>Semi-Autonomous</option>
                    <option value="autonomous" selected={employee.config.autonomyMode === 'autonomous'}>Autonomous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Timezone</label>
                  <Input value={employee.config.workingHours.timezone} readOnly className="bg-surface-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Working Hours</label>
                <div className="flex items-center gap-3">
                  <Input value={employee.config.workingHours.start} className="w-24 bg-surface-800" readOnly />
                  <span className="text-surface-500">to</span>
                  <Input value={employee.config.workingHours.end} className="w-24 bg-surface-800" readOnly />
                </div>
              </div>

              <div>
                <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Confidence Thresholds</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-surface-400 mb-1">Execute</p>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.config.confidenceThresholds.execute * 100} className="flex-1" indicatorClassName="from-success-500 to-success-400" />
                      <span className="font-mono text-xs text-surface-300">{Math.round(employee.config.confidenceThresholds.execute * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-surface-400 mb-1">Recommend</p>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.config.confidenceThresholds.recommend * 100} className="flex-1" indicatorClassName="from-warning-500 to-warning-400" />
                      <span className="font-mono text-xs text-surface-300">{Math.round(employee.config.confidenceThresholds.recommend * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-surface-400 mb-1">Escalate Below</p>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.config.confidenceThresholds.escalateBelow * 100} className="flex-1" indicatorClassName="from-destructive-500 to-destructive-400" />
                      <span className="font-mono text-xs text-surface-300">{Math.round(employee.config.confidenceThresholds.escalateBelow * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Languages</label>
                <div className="flex items-center gap-2">
                  {employee.config.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">{lang.toUpperCase()}</Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-surface-800/50">
                <Button>Save Configuration</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
