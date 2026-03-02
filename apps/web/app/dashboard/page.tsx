import { auth } from '@/lib/auth';
import { getDashboardStats, getRecentActivity, getAllTasks } from '@/lib/data';
import { getEmployees } from '@/lib/data';
import { DashboardView } from './dashboard-view';

export default async function DashboardPage() {
  const user = await auth();
  const orgId = user?.orgId ?? 'org-001';
  const orgName = (user?.organization as Record<string, unknown>)?.name as string ?? 'Volund Ventures';

  const [stats, employees, tasks, activities] = await Promise.all([
    getDashboardStats(orgId),
    getEmployees(orgId),
    getAllTasks(orgId),
    getRecentActivity(orgId, 10),
  ]);

  return (
    <DashboardView
      stats={stats}
      employees={employees}
      tasks={tasks}
      activities={activities}
      orgName={orgName}
    />
  );
}
