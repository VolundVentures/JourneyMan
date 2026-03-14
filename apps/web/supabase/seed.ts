import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .upsert({ name: 'Volund Ventures', slug: 'volund-ventures', plan: 'professional', settings: { timezone: 'America/New_York' } }, { onConflict: 'slug' })
    .select()
    .single();

  if (orgError || !org) {
    throw new Error(`Failed to create org: ${orgError?.message}`);
  }

  // Note: Users are created via Supabase Auth signup flow.
  // For seeding, create users with placeholder IDs that match
  // the Supabase auth user UUIDs after you create them in the dashboard.
  const users = [
    { id: '00000000-0000-0000-0000-000000000001', email: 'zakaria@volundventures.com', name: 'Zakaria Sabti', role: 'admin' },
    { id: '00000000-0000-0000-0000-000000000002', email: 'sara@volundventures.com', name: 'Sara Lindström', role: 'manager' },
    { id: '00000000-0000-0000-0000-000000000003', email: 'james@volundventures.com', name: 'James Chen', role: 'member' },
  ];

  for (const u of users) {
    const { error } = await supabase
      .from('users')
      .upsert({ ...u, org_id: org.id }, { onConflict: 'email' });
    if (error) console.warn(`User ${u.email}: ${error.message}`);
  }

  // Create AI employees
  const defaultConfig = {
    communicationTone: 'professional',
    proactivityLevel: 'medium',
    autonomyMode: 'semi-autonomous',
    workingHours: { start: '09:00', end: '17:00', timezone: 'America/New_York' },
    escalationRules: [],
    confidenceThresholds: { execute: 0.85, recommend: 0.7, escalateBelow: 0.5 },
    languages: ['English'],
    priorityHierarchy: ['urgent', 'high', 'medium', 'low'],
  };

  const employees = [
    { name: 'Atlas', role_title: 'Operations Manager', department: 'Operations', status: 'active', autonomy_score: 88, tasks_completed: 847, escalation_rate: 4.2 },
    { name: 'Nova', role_title: 'Sales Development Rep', department: 'Sales', status: 'active', autonomy_score: 92, tasks_completed: 1023, escalation_rate: 3.1 },
    { name: 'Apex', role_title: 'Account Executive', department: 'Sales', status: 'active', autonomy_score: 85, tasks_completed: 634, escalation_rate: 5.8 },
    { name: 'Sage', role_title: 'Research Analyst', department: 'Strategy', status: 'active', autonomy_score: 79, tasks_completed: 412, escalation_rate: 8.2 },
    { name: 'Flux', role_title: 'Content Strategist', department: 'Marketing', status: 'supervised', autonomy_score: 65, tasks_completed: 289, escalation_rate: 12.5 },
    { name: 'Ember', role_title: 'Customer Success Manager', department: 'Support', status: 'active', autonomy_score: 74, tasks_completed: 556, escalation_rate: 6.7 },
  ];

  const employeeIds: Record<string, string> = {};

  for (const emp of employees) {
    const { data, error } = await supabase
      .from('employees')
      .upsert({
        org_id: org.id,
        ...emp,
        config: defaultConfig,
        reports_to_name: 'Zakaria Sabti',
      }, { onConflict: 'id', ignoreDuplicates: false })
      .select('id, name')
      .single();

    if (error) {
      // Try insert instead
      const { data: inserted, error: insertError } = await supabase
        .from('employees')
        .insert({
          org_id: org.id,
          ...emp,
          config: defaultConfig,
          reports_to_name: 'Zakaria Sabti',
        })
        .select('id, name')
        .single();
      if (insertError) {
        console.warn(`Employee ${emp.name}: ${insertError.message}`);
        continue;
      }
      if (inserted) employeeIds[emp.name.toLowerCase()] = inserted.id;
    } else if (data) {
      employeeIds[emp.name.toLowerCase()] = data.id;
    }
  }

  // Create sample tasks
  const taskData = [
    { employee: 'atlas', title: 'Daily operations status report', status: 'completed', priority: 60 },
    { employee: 'nova', title: 'Send proposal to CloudVault Inc.', status: 'awaiting_approval', priority: 85 },
    { employee: 'apex', title: 'Q1 Pipeline Analysis', status: 'completed', priority: 70 },
    { employee: 'sage', title: 'Competitor landscape research', status: 'in_progress', priority: 50 },
    { employee: 'flux', title: 'Publish weekly blog post', status: 'completed', priority: 40 },
    { employee: 'ember', title: 'Follow up with MedTech Solutions', status: 'in_progress', priority: 65 },
    { employee: 'nova', title: 'Outreach to TechForward Inc.', status: 'completed', priority: 75 },
    { employee: 'atlas', title: 'Vendor contract renewal review', status: 'queued', priority: 55 },
  ];

  const taskIds: string[] = [];

  for (const t of taskData) {
    const employeeId = employeeIds[t.employee];
    if (!employeeId) {
      console.warn(`Skipping task "${t.title}" — employee ${t.employee} not found`);
      continue;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        org_id: org.id,
        employee_id: employeeId,
        title: t.title,
        status: t.status,
        priority: t.priority,
        source: 'human_assigned',
        assigned_by_name: 'Zakaria Sabti',
      })
      .select('id')
      .single();

    if (error) console.warn(`Task "${t.title}": ${error.message}`);
    else if (data) taskIds.push(data.id);
  }

  // Create sample approval (for task 2 — "Send proposal to CloudVault Inc.")
  if (taskIds[1] && employeeIds['nova']) {
    await supabase.from('approvals').insert({
      org_id: org.id,
      employee_id: employeeIds['nova'],
      employee_name: 'Nova',
      employee_role: 'Sales Development Rep',
      task_id: taskIds[1],
      action_type: 'send_proposal',
      proposed_action: { recipient: 'CloudVault Inc.', value: 48000 },
      reasoning: 'CloudVault has shown strong interest after 3 demo calls. Proposing $48k annual contract.',
      confidence_score: 0.91,
      status: 'pending',
    });
  }

  // Create sample escalation
  if (employeeIds['nova']) {
    await supabase.from('escalations').insert({
      org_id: org.id,
      employee_id: employeeIds['nova'],
      employee_name: 'Nova',
      employee_role: 'Sales Development Rep',
      reason: 'Prospect asked about GDPR compliance — requires legal review',
      context: { prospect: 'CloudVault Inc.', question: 'GDPR data processing agreement' },
      recommendation: 'Loop in legal team for DPA review before proceeding',
      urgency: 'high',
      status: 'open',
    });
  }

  // Create sample contacts
  const contacts = [
    { name: 'Sarah Johnson', email: 'sarah@cloudvault.io', company: 'CloudVault Inc.', title: 'VP of Engineering', interaction_count: 24 },
    { name: 'Marcus Rivera', email: 'mrivera@techforward.com', company: 'TechForward Inc.', title: 'CTO', interaction_count: 8 },
    { name: 'Lisa Park', email: 'lisa@acmecorp.com', company: 'Acme Corp', title: 'Procurement Manager', interaction_count: 45 },
  ];

  for (const c of contacts) {
    const { error } = await supabase
      .from('contacts')
      .insert({ org_id: org.id, ...c });
    if (error) console.warn(`Contact ${c.name}: ${error.message}`);
  }

  console.log('Seed completed successfully');
  console.log(`  Organization: ${org.name} (${org.slug})`);
  console.log(`  Users: ${users.map(u => u.name).join(', ')}`);
  console.log(`  Employees: ${employees.map(e => e.name).join(', ')}`);
  console.log(`  Tasks: ${taskIds.length}`);
  console.log('  Note: Create auth users via the signup page, then update seed UUIDs if needed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
