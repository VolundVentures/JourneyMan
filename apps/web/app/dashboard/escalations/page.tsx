import { auth } from '@/lib/auth';
import { getEscalations, getEmployees } from '@/lib/data';
import { EscalationsView } from './escalations-view';

export default async function EscalationsPage() {
  const user = await auth();
  const orgId = user?.orgId ?? 'org-001';

  const [escalations, employees] = await Promise.all([
    getEscalations(orgId),
    getEmployees(orgId),
  ]);

  return <EscalationsView escalations={escalations} employees={employees} />;
}
