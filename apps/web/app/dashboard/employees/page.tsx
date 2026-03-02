import { auth } from '@/lib/auth';
import { getEmployees, getAllTasks } from '@/lib/data';
import { EmployeesView } from './employees-view';

export default async function EmployeesPage() {
  const user = await auth();
  const orgId = user?.orgId ?? 'org-001';

  const [employees, tasks] = await Promise.all([
    getEmployees(orgId),
    getAllTasks(orgId),
  ]);

  return <EmployeesView employees={employees} tasks={tasks} />;
}
