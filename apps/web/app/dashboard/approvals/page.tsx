import { auth } from '@/lib/auth';
import { getApprovals, getEmployees } from '@/lib/data';
import { ApprovalsView } from './approvals-view';

export default async function ApprovalsPage() {
  const user = await auth();
  const orgId = user?.orgId ?? 'org-001';

  const [approvals, employees] = await Promise.all([
    getApprovals(orgId),
    getEmployees(orgId),
  ]);

  return <ApprovalsView approvals={approvals} employees={employees} />;
}
