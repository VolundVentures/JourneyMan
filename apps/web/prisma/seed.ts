import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { hash } from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create organization
  const org = await prisma.organization.upsert({
    where: { slug: 'volund-ventures' },
    update: {},
    create: {
      name: 'Volund Ventures',
      slug: 'volund-ventures',
      plan: 'professional',
      settings: JSON.stringify({ timezone: 'America/New_York' }),
    },
  });

  // Create users
  const passwordHash = await hash('password', 12);

  const zakaria = await prisma.user.upsert({
    where: { email: 'zakaria@volundventures.com' },
    update: {},
    create: {
      orgId: org.id,
      email: 'zakaria@volundventures.com',
      name: 'Zakaria Sabti',
      password: passwordHash,
      role: 'admin',
    },
  });

  const sara = await prisma.user.upsert({
    where: { email: 'sara@volundventures.com' },
    update: {},
    create: {
      orgId: org.id,
      email: 'sara@volundventures.com',
      name: 'Sara Lindström',
      password: passwordHash,
      role: 'manager',
    },
  });

  const james = await prisma.user.upsert({
    where: { email: 'james@volundventures.com' },
    update: {},
    create: {
      orgId: org.id,
      email: 'james@volundventures.com',
      name: 'James Chen',
      password: passwordHash,
      role: 'member',
    },
  });

  // Create AI employees
  const defaultConfig = JSON.stringify({
    communicationTone: 'professional',
    proactivityLevel: 'medium',
    autonomyMode: 'semi-autonomous',
    workingHours: { start: '09:00', end: '17:00', timezone: 'America/New_York' },
    escalationRules: [],
    confidenceThresholds: { execute: 0.85, recommend: 0.7, escalateBelow: 0.5 },
    languages: ['English'],
    priorityHierarchy: ['urgent', 'high', 'medium', 'low'],
  });

  const employees = [
    { name: 'Atlas', roleTitle: 'Operations Manager', department: 'Operations', status: 'active', autonomyScore: 88, tasksCompleted: 847, escalationRate: 4.2 },
    { name: 'Nova', roleTitle: 'Sales Development Rep', department: 'Sales', status: 'active', autonomyScore: 92, tasksCompleted: 1023, escalationRate: 3.1 },
    { name: 'Apex', roleTitle: 'Account Executive', department: 'Sales', status: 'active', autonomyScore: 85, tasksCompleted: 634, escalationRate: 5.8 },
    { name: 'Sage', roleTitle: 'Research Analyst', department: 'Strategy', status: 'active', autonomyScore: 79, tasksCompleted: 412, escalationRate: 8.2 },
    { name: 'Flux', roleTitle: 'Content Strategist', department: 'Marketing', status: 'supervised', autonomyScore: 65, tasksCompleted: 289, escalationRate: 12.5 },
    { name: 'Ember', roleTitle: 'Customer Success Manager', department: 'Support', status: 'active', autonomyScore: 74, tasksCompleted: 556, escalationRate: 6.7 },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { id: `emp-${emp.name.toLowerCase()}` },
      update: {},
      create: {
        id: `emp-${emp.name.toLowerCase()}`,
        orgId: org.id,
        name: emp.name,
        roleTitle: emp.roleTitle,
        department: emp.department,
        status: emp.status,
        config: defaultConfig,
        autonomyScore: emp.autonomyScore,
        tasksCompleted: emp.tasksCompleted,
        escalationRate: emp.escalationRate,
        reportsToName: zakaria.name,
      },
    });
  }

  // Create sample tasks
  const taskData = [
    { employeeId: 'emp-atlas', title: 'Daily operations status report', status: 'completed', priority: 60 },
    { employeeId: 'emp-nova', title: 'Send proposal to CloudVault Inc.', status: 'awaiting_approval', priority: 85 },
    { employeeId: 'emp-apex', title: 'Q1 Pipeline Analysis', status: 'completed', priority: 70 },
    { employeeId: 'emp-sage', title: 'Competitor landscape research', status: 'in_progress', priority: 50 },
    { employeeId: 'emp-flux', title: 'Publish weekly blog post', status: 'completed', priority: 40 },
    { employeeId: 'emp-ember', title: 'Follow up with MedTech Solutions', status: 'in_progress', priority: 65 },
    { employeeId: 'emp-nova', title: 'Outreach to TechForward Inc.', status: 'completed', priority: 75 },
    { employeeId: 'emp-atlas', title: 'Vendor contract renewal review', status: 'queued', priority: 55 },
  ];

  for (let i = 0; i < taskData.length; i++) {
    await prisma.task.upsert({
      where: { id: `task-${i + 1}` },
      update: {},
      create: {
        id: `task-${i + 1}`,
        orgId: org.id,
        employeeId: taskData[i].employeeId,
        title: taskData[i].title,
        status: taskData[i].status,
        priority: taskData[i].priority,
        source: 'human_assigned',
        assignedByName: zakaria.name,
      },
    });
  }

  // Create sample approvals
  await prisma.approval.upsert({
    where: { id: 'apv-1' },
    update: {},
    create: {
      id: 'apv-1',
      orgId: org.id,
      employeeId: 'emp-nova',
      employeeName: 'Nova',
      employeeRole: 'Sales Development Rep',
      taskId: 'task-2',
      actionType: 'send_proposal',
      proposedAction: JSON.stringify({ recipient: 'CloudVault Inc.', value: 48000 }),
      reasoning: 'CloudVault has shown strong interest after 3 demo calls. Proposing $48k annual contract.',
      confidenceScore: 0.91,
      status: 'pending',
    },
  });

  // Create sample escalations
  await prisma.escalation.upsert({
    where: { id: 'esc-1' },
    update: {},
    create: {
      id: 'esc-1',
      orgId: org.id,
      employeeId: 'emp-nova',
      employeeName: 'Nova',
      employeeRole: 'Sales Development Rep',
      reason: 'Prospect asked about GDPR compliance — requires legal review',
      context: JSON.stringify({ prospect: 'CloudVault Inc.', question: 'GDPR data processing agreement' }),
      recommendation: 'Loop in legal team for DPA review before proceeding',
      urgency: 'high',
      status: 'open',
    },
  });

  // Create sample contacts
  const contacts = [
    { name: 'Sarah Johnson', email: 'sarah@cloudvault.io', company: 'CloudVault Inc.', title: 'VP of Engineering', interactionCount: 24 },
    { name: 'Marcus Rivera', email: 'mrivera@techforward.com', company: 'TechForward Inc.', title: 'CTO', interactionCount: 8 },
    { name: 'Lisa Park', email: 'lisa@acmecorp.com', company: 'Acme Corp', title: 'Procurement Manager', interactionCount: 45 },
  ];

  for (let i = 0; i < contacts.length; i++) {
    await prisma.contact.upsert({
      where: { id: `contact-${i + 1}` },
      update: {},
      create: {
        id: `contact-${i + 1}`,
        orgId: org.id,
        name: contacts[i].name,
        email: contacts[i].email,
        company: contacts[i].company,
        title: contacts[i].title,
        interactionCount: contacts[i].interactionCount,
      },
    });
  }

  console.log('Seed completed successfully');
  console.log(`  Organization: ${org.name} (${org.slug})`);
  console.log(`  Users: ${zakaria.name}, ${sara.name}, ${james.name}`);
  console.log(`  Employees: ${employees.map((e) => e.name).join(', ')}`);
  console.log(`  Tasks: ${taskData.length}`);
  console.log(`  Login: zakaria@volundventures.com / password`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
