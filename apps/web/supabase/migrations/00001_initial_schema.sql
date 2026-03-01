-- JourneyMan Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================
-- CORE ENTITIES
-- ============================================

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text not null default 'starter',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid references organizations(id),
  email text unique not null,
  name text,
  role text not null default 'member',
  avatar_url text,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table employees (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  name text not null,
  role_title text not null,
  role_template_id text,
  department text not null,
  reports_to text,
  reports_to_name text,
  status text not null default 'onboarding',
  email_address text,
  phone_number text,
  slack_user_id text,
  config jsonb not null default '{}',
  autonomy_score float not null default 0,
  tasks_completed integer not null default 0,
  escalation_rate float not null default 0,
  hired_at timestamptz not null default now(),
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- TASKS & WORKFLOW
-- ============================================

create table tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid not null references employees(id),
  title text not null,
  description text,
  source text not null default 'human_assigned',
  status text not null default 'queued',
  priority integer not null default 50,
  confidence_score float,
  plan jsonb,
  result jsonb,
  assigned_by text,
  assigned_by_name text,
  due_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table approvals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid not null references employees(id),
  employee_name text,
  employee_role text,
  task_id uuid references tasks(id),
  action_type text not null,
  proposed_action jsonb not null default '{}',
  reasoning text not null,
  confidence_score float not null,
  context jsonb,
  status text not null default 'pending',
  resolved_by text,
  resolution_feedback text,
  resolved_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table escalations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid not null references employees(id),
  employee_name text,
  employee_role text,
  task_id uuid references tasks(id),
  reason text not null,
  context jsonb not null default '{}',
  recommendation text,
  urgency text not null default 'medium',
  status text not null default 'open',
  resolved_by text,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- COMMUNICATION
-- ============================================

create table messages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  employee_id uuid not null references employees(id),
  channel text not null,
  direction text not null,
  thread_id text,
  from_address text,
  to_address text,
  subject text,
  body text not null,
  metadata jsonb not null default '{}',
  task_id uuid references tasks(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- KNOWLEDGE BASE
-- ============================================

create table knowledge_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  source_type text not null,
  source_ref text,
  title text not null,
  content text not null,
  content_hash text not null,
  chunk_index integer not null default 0,
  metadata jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- INTEGRATIONS
-- ============================================

create table integrations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id text,
  provider text not null,
  scopes jsonb not null default '[]',
  status text not null default 'active',
  last_synced_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- HANDOFFS
-- ============================================

create table handoffs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  task_id uuid not null references tasks(id),
  from_employee_id uuid not null references employees(id),
  from_employee_name text not null,
  to_employee_id uuid not null references employees(id),
  to_employee_name text not null,
  reason text not null,
  context_package jsonb not null default '{}',
  status text not null default 'pending',
  approved_by text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ============================================
-- CONTACTS & CRM
-- ============================================

create table contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  name text not null,
  email text,
  phone text,
  company text,
  company_id text,
  title text,
  labels jsonb not null default '[]',
  interaction_count integer not null default 0,
  last_interaction_at timestamptz,
  sentiment_score float,
  assigned_employee_ids jsonb not null default '[]',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  name text not null,
  domain text,
  industry text,
  size text,
  contact_ids jsonb not null default '[]',
  deal_value float,
  stage text,
  created_at timestamptz not null default now()
);

-- ============================================
-- AUDIT LOG
-- ============================================

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  actor_type text not null,
  actor_id text not null,
  actor_name text not null,
  action text not null,
  resource_type text not null,
  resource_id text not null,
  resource_name text,
  details jsonb not null default '{}',
  previous_state jsonb,
  new_state jsonb,
  ip_address text,
  severity text not null default 'info',
  timestamp timestamptz not null default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table organizations enable row level security;
alter table users enable row level security;
alter table employees enable row level security;
alter table tasks enable row level security;
alter table approvals enable row level security;
alter table escalations enable row level security;
alter table messages enable row level security;
alter table knowledge_items enable row level security;
alter table integrations enable row level security;
alter table handoffs enable row level security;
alter table contacts enable row level security;
alter table companies enable row level security;
alter table audit_logs enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on users for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

-- Users can read their organization
create policy "Users can read own organization"
  on organizations for select
  using (id in (select org_id from users where id = auth.uid()));

-- Organization members can read employees in their org
create policy "Org members can read employees"
  on employees for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read tasks in their org
create policy "Org members can read tasks"
  on tasks for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read approvals in their org
create policy "Org members can read approvals"
  on approvals for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read escalations in their org
create policy "Org members can read escalations"
  on escalations for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read messages in their org
create policy "Org members can read messages"
  on messages for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read knowledge items in their org
create policy "Org members can read knowledge items"
  on knowledge_items for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read integrations in their org
create policy "Org members can read integrations"
  on integrations for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read handoffs in their org
create policy "Org members can read handoffs"
  on handoffs for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read contacts in their org
create policy "Org members can read contacts"
  on contacts for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read companies in their org
create policy "Org members can read companies"
  on companies for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Organization members can read audit logs in their org
create policy "Org members can read audit logs"
  on audit_logs for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger organizations_updated_at before update on organizations
  for each row execute function update_updated_at();

create trigger users_updated_at before update on users
  for each row execute function update_updated_at();

create trigger employees_updated_at before update on employees
  for each row execute function update_updated_at();

create trigger tasks_updated_at before update on tasks
  for each row execute function update_updated_at();

create trigger knowledge_items_updated_at before update on knowledge_items
  for each row execute function update_updated_at();

create trigger contacts_updated_at before update on contacts
  for each row execute function update_updated_at();
