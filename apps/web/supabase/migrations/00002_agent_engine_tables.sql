-- ============================================
-- Phase 2: Agent Engine Tables
-- ============================================
-- Adds tables for agent activity events, sessions, and memory.

-- Agent activity events (powers live dashboard via Realtime)
create table if not exists agent_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  event_type text not null,
  content text not null,
  confidence float,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_agent_events_employee on agent_events(employee_id, created_at desc);
create index idx_agent_events_org on agent_events(org_id, created_at desc);
create index idx_agent_events_task on agent_events(task_id) where task_id is not null;

-- Agent sessions (tracks active/paused/completed agent runs)
create table if not exists agent_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  sdk_session_id text,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_cost_usd float default 0,
  turns_used integer default 0
);

create index idx_agent_sessions_employee on agent_sessions(employee_id, started_at desc);
create index idx_agent_sessions_status on agent_sessions(status) where status = 'active';

-- Episodic memories (individual employee experiences)
create table if not exists episodic_memories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  event_type text not null,
  content text not null,
  significance_score float not null default 0.5,
  source_ref jsonb,
  metadata jsonb not null default '{}',
  is_archived boolean not null default false,
  task_id uuid references tasks(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_episodic_memories_employee on episodic_memories(employee_id, created_at desc);

-- Institutional memories (org-wide or per-employee patterns & rules)
create table if not exists institutional_memories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid references employees(id) on delete cascade,
  category text not null,
  subject text not null,
  content text not null,
  confidence float not null default 0.5,
  source_count integer not null default 1,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_institutional_memories_employee on institutional_memories(employee_id) where employee_id is not null;
create index idx_institutional_memories_org on institutional_memories(org_id, category);

-- RLS policies
alter table agent_events enable row level security;
alter table agent_sessions enable row level security;
alter table episodic_memories enable row level security;
alter table institutional_memories enable row level security;

create policy "Org members can read agent events"
  on agent_events for select
  using (org_id in (select org_id from users where id = auth.uid()));

create policy "Org members can read agent sessions"
  on agent_sessions for select
  using (org_id in (select org_id from users where id = auth.uid()));

create policy "Org members can read episodic memories"
  on episodic_memories for select
  using (org_id in (select org_id from users where id = auth.uid()));

create policy "Org members can read institutional memories"
  on institutional_memories for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Enable Supabase Realtime on agent_events for live dashboard
alter publication supabase_realtime add table agent_events;
