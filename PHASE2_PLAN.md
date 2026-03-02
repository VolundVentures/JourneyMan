# Phase 2: The AI Brain — Agent Orchestration Engine

## Vision

Every AI employee in JourneyMan is powered by a **Claude agent session** via the
[Claude Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview). The
platform provides each agent with domain-specific **MCP tools** (email, CRM,
knowledge base, etc.), a **confidence-based decision engine** that routes actions
to autonomous execution, approval, or escalation, and a **memory system** that
lets agents learn from feedback and past interactions.

The dashboard becomes a real-time command center — managers watch agents think,
intervene mid-task, approve high-stakes actions, and see live results.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Web App                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │Dashboard │  │ Live     │  │Approvals │  │ Hire       │  │
│  │ (real    │  │ Monitor  │  │ (working │  │ (creates   │  │
│  │  data)   │  │ (SSE)    │  │  queue)  │  │  agents)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       │              │              │               │        │
│  ─────┴──────────────┴──────────────┴───────────────┴─────── │
│                    API Routes Layer                           │
│  POST /api/agents/[id]/execute-task                          │
│  POST /api/agents/[id]/intervene                             │
│  POST /api/approvals/[id]/resolve                            │
│  GET  /api/agents/[id]/stream  (SSE)                         │
│  POST /api/tasks                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│              packages/agent-engine                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AgentOrchestrator                        │   │
│  │  • Manages all active EmployeeSessions               │   │
│  │  • Routes tasks to the right agent                   │   │
│  │  • Handles lifecycle (create/pause/resume/terminate) │   │
│  └──────────┬───────────────────────────────────────────┘   │
│             │                                                │
│  ┌──────────┴───────────────────────────────────────────┐   │
│  │              EmployeeSession                          │   │
│  │  • Wraps Claude Agent SDK query()                    │   │
│  │  • Role-specific system prompt + personality         │   │
│  │  • Confidence thresholds via canUseTool              │   │
│  │  • Streams activity events                           │   │
│  └──────────┬───────────────────────────────────────────┘   │
│             │                                                │
│  ┌──────────┴───────────────────────────────────────────┐   │
│  │              MCP Tool Servers                         │   │
│  │                                                       │   │
│  │  Platform Tools        Communication       CRM        │   │
│  │  ├─ get_task           ├─ send_email      ├─ search   │   │
│  │  ├─ update_task        ├─ read_inbox      ├─ update   │   │
│  │  ├─ request_approval   ├─ send_slack      └─ create   │   │
│  │  ├─ create_escalation  └─ read_slack                  │   │
│  │  ├─ search_knowledge                                  │   │
│  │  ├─ read_memory        Calendar                       │   │
│  │  └─ write_memory       ├─ check_avail                 │   │
│  │                        └─ schedule                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ConfidenceEngine │  │  MemoryManager  │                   │
│  │canUseTool guard │  │ episodic + inst │                   │
│  └─────────────────┘  └─────────────────┘                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                    Supabase                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │Tables    │  │Realtime  │  │Storage   │  │Edge Funcs  │  │
│  │(all 14)  │  │(live     │  │(knowledge│  │(cron tasks │  │
│  │+ new:    │  │ events)  │  │ files)   │  │ webhooks)  │  │
│  │agent_    │  │          │  │          │  │            │  │
│  │events    │  │          │  │          │  │            │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Agent Engine Core — `packages/agent-engine`

New package in the monorepo. Pure TypeScript, no Next.js dependency.

#### AgentOrchestrator

Singleton that manages all active agent sessions across the org.

```typescript
// packages/agent-engine/src/orchestrator.ts
import { query, type Query } from "@anthropic-ai/claude-agent-sdk";

class AgentOrchestrator {
  private sessions: Map<string, EmployeeSession>;

  // Spin up an agent for an employee and assign a task
  async executeTask(employee: Employee, task: Task, org: Organization): Promise<void>;

  // Send real-time guidance to a running agent
  async intervene(employeeId: string, message: string): Promise<void>;

  // Pause/resume agent execution
  async pauseAgent(employeeId: string): Promise<void>;
  async resumeAgent(employeeId: string): Promise<void>;

  // Get live activity stream (yields AgentEvent objects)
  getActivityStream(employeeId: string): AsyncGenerator<AgentEvent>;

  // Shut down an agent session
  async terminateAgent(employeeId: string): Promise<void>;
}
```

#### EmployeeSession

Wraps a single Claude Agent SDK session for one employee.

```typescript
// packages/agent-engine/src/session.ts
class EmployeeSession {
  private agentQuery: Query;
  private employee: Employee;
  private eventEmitter: EventEmitter;

  constructor(employee: Employee, org: Organization) {
    // Build system prompt from:
    // - Role template description + capabilities
    // - Employee personality dimensions → tone/style instructions
    // - Employee config (working hours, priority hierarchy, etc.)
    // - Relevant institutional memories
    // - Current task context
  }

  async start(task: Task): Promise<void> {
    this.agentQuery = query({
      prompt: this.buildTaskPrompt(task),
      options: {
        model: "claude-sonnet-4-6",  // Cost-effective for most tasks
        allowedTools: ["Task"],       // Subagent orchestration via Task tool
        agents: this.buildAgentDefinitions(),
        mcpServers: {
          platform: platformToolServer,      // Task mgmt, approvals, knowledge
          communication: commToolServer,     // Email, Slack
          crm: crmToolServer,               // Contacts, companies, deals
        },
        canUseTool: this.confidenceGuard.bind(this),
        hooks: {
          PostToolUse: [{ hooks: [this.logActivity.bind(this)] }],
          Stop: [{ hooks: [this.onComplete.bind(this)] }],
        },
        systemPrompt: this.systemPrompt,
        maxTurns: 50,
        maxBudgetUsd: 0.50,  // Per-task budget cap
      },
    });

    // Stream messages and emit events
    for await (const message of this.agentQuery) {
      this.processMessage(message);
    }
  }
}
```

**Key Design Decision: Subagents for Complex Tasks**

For complex tasks, the main employee agent delegates to specialized subagents
via the `Task` tool + `agents` option:

```typescript
// Inside EmployeeSession.buildAgentDefinitions()
agents: {
  "researcher": {
    description: "Deep research specialist. Use for tasks requiring thorough investigation.",
    prompt: `You are a research specialist working for ${employee.name}.
             Search knowledge base, analyze data, and return structured findings.`,
    tools: ["Read", "Grep", "WebSearch", "WebFetch"],
    model: "haiku",  // Fast + cheap for research subtasks
    maxTurns: 15,
  },
  "writer": {
    description: "Content and communication drafter. Use for emails, reports, proposals.",
    prompt: `You are a writing specialist for ${employee.name}.
             Personality: ${personalityToPrompt(employee.personality)}.
             Draft content matching the employee's voice and tone.`,
    tools: ["Read", "Grep"],
    model: "sonnet",
    maxTurns: 10,
  },
  "analyzer": {
    description: "Data analysis specialist. Use for metrics, trends, comparisons.",
    prompt: `You are a data analyst supporting ${employee.name}.
             Analyze data and return structured insights with confidence scores.`,
    tools: ["Read", "Grep", "Bash"],
    model: "haiku",
    maxTurns: 10,
  },
}
```

This mirrors the **agent teams** pattern — the employee agent acts as team lead,
delegating research, writing, and analysis to specialized subagents that report
back results. The employee agent then synthesizes and decides on actions.

---

### 2. MCP Tool Servers

Custom tools exposed via in-process MCP servers using the Agent SDK's
`createSdkMcpServer()` and `tool()` helpers.

#### Platform Tools (always available to every agent)

```typescript
// packages/agent-engine/src/tools/platform.ts
import { tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const getTaskDetails = tool(
  "get_task_details",
  "Get full details of the current task assignment including description, priority, and context",
  { taskId: z.string() },
  async ({ taskId }) => {
    const { data } = await db.from("tasks").select("*").eq("id", taskId).single();
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  }
);

const updateTaskStatus = tool(
  "update_task_status",
  "Update the status of a task (e.g., in_progress, awaiting_approval, completed)",
  { taskId: z.string(), status: z.string(), result: z.any().optional() },
  async ({ taskId, status, result }) => { /* ... */ }
);

const requestApproval = tool(
  "request_approval",
  "Submit a proposed action for human manager review before executing",
  {
    actionType: z.string(),
    proposedAction: z.object({ summary: z.string(), details: z.any() }),
    reasoning: z.string(),
    confidenceScore: z.number(),
  },
  async ({ actionType, proposedAction, reasoning, confidenceScore }) => {
    // Creates approval record in Supabase
    // Returns approval ID — agent waits for resolution
  }
);

const createEscalation = tool(
  "escalate_to_human",
  "Escalate an issue to a human manager when you cannot handle it confidently",
  {
    reason: z.string(),
    context: z.any(),
    recommendation: z.string().optional(),
    urgency: z.enum(["low", "medium", "high", "critical"]),
  },
  async (args) => { /* ... */ }
);

const searchKnowledge = tool(
  "search_knowledge_base",
  "Search the organization's knowledge base for relevant information",
  { query: z.string(), limit: z.number().default(5) },
  async ({ query, limit }) => {
    // Full-text search on knowledge_items table
    // Returns relevant documents with relevance scores
  }
);

const readMemory = tool(
  "recall_memory",
  "Recall relevant past experiences, patterns, or preferences",
  { query: z.string(), category: z.string().optional() },
  async ({ query, category }) => {
    // Search episodic + institutional memory
    // Return ranked results
  }
);

const writeMemory = tool(
  "store_memory",
  "Store a new observation, pattern, or learning for future reference",
  {
    category: z.enum(["preference", "pattern", "relationship", "rule", "context"]),
    subject: z.string(),
    content: z.string(),
    significance: z.number().min(0).max(1),
  },
  async (args) => { /* ... */ }
);

const logActivity = tool(
  "log_activity",
  "Log an activity or decision for the human dashboard",
  {
    eventType: z.enum(["action", "thinking", "decision", "communication", "waiting"]),
    content: z.string(),
    confidence: z.number().optional(),
  },
  async (args) => {
    // Insert into agent_events table
    // Supabase Realtime broadcasts to dashboard automatically
  }
);

export const platformServer = createSdkMcpServer({
  name: "journeyman-platform",
  tools: [
    getTaskDetails, updateTaskStatus, requestApproval,
    createEscalation, searchKnowledge, readMemory,
    writeMemory, logActivity,
  ],
});
```

#### Communication Tools

```typescript
// packages/agent-engine/src/tools/communication.ts

const sendEmail = tool(
  "send_email",
  "Compose and send an email. Requires approval if recipient is external.",
  {
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    replyToThreadId: z.string().optional(),
  },
  async (args) => { /* Send via connected email integration */ },
  { annotations: { destructive: true } }  // Marks as side-effect tool
);

const readInbox = tool(
  "read_inbox",
  "Read recent emails from the connected inbox",
  { limit: z.number().default(10), unreadOnly: z.boolean().default(true) },
  async (args) => { /* Read from integration */ },
  { annotations: { readOnly: true } }
);

const sendSlackMessage = tool(
  "send_slack_message",
  "Post a message to a Slack channel or DM",
  { channel: z.string(), message: z.string(), threadTs: z.string().optional() },
  async (args) => { /* ... */ },
  { annotations: { destructive: true } }
);
```

#### CRM Tools

```typescript
// packages/agent-engine/src/tools/crm.ts

const searchContacts = tool("search_contacts", ...);
const updateContact = tool("update_contact", ...);
const searchCompanies = tool("search_companies", ...);
const createDeal = tool("create_deal", ...);
```

---

### 3. Confidence Engine

The confidence engine is the **human-in-the-loop gate**. It intercepts every
tool call with side effects and decides: execute, request approval, or escalate.

```typescript
// packages/agent-engine/src/confidence.ts
import type { CanUseTool } from "@anthropic-ai/claude-agent-sdk";

// Tool annotations from MCP tell us which tools have side effects
const SIDE_EFFECT_TOOLS = new Set([
  "send_email", "send_slack_message", "update_contact",
  "create_deal", "update_task_status",
]);

function createConfidenceGuard(employee: Employee): CanUseTool {
  const thresholds = employee.config.confidenceThresholds;

  return async (toolName, input, options) => {
    // Read-only tools always allowed
    if (!SIDE_EFFECT_TOOLS.has(toolName)) {
      return { behavior: "allow" };
    }

    // Check spending limits
    if (toolName === "send_email") {
      const todayCount = await getEmailCountToday(employee.id);
      if (todayCount >= employee.config.limits?.emailsPerDay ?? 100) {
        return {
          behavior: "deny",
          message: "Daily email limit reached. Escalate if urgent.",
        };
      }
    }

    // The agent's own confidence is passed in the tool input
    // (we instruct the agent to include it in the system prompt)
    const confidence = (input as any).confidenceScore ?? 0.5;

    if (confidence >= thresholds.execute) {
      // High confidence → execute autonomously
      return { behavior: "allow" };
    }

    if (confidence >= thresholds.recommend) {
      // Medium confidence → create approval request, block execution
      await createApprovalRecord(employee, toolName, input);
      return {
        behavior: "deny",
        message: `Action submitted for human approval (confidence: ${confidence}).
                  Proceed to other tasks while waiting.`,
      };
    }

    // Low confidence → escalate
    await createEscalationRecord(employee, toolName, input);
    return {
      behavior: "deny",
      message: `Escalated to human manager (confidence: ${confidence}).
                This requires human judgment.`,
    };
  };
}
```

---

### 4. System Prompt Engineering

Each employee gets a carefully constructed system prompt:

```typescript
// packages/agent-engine/src/prompt-builder.ts

function buildSystemPrompt(employee: Employee, org: Organization): string {
  return `
You are ${employee.name}, an AI employee at ${org.name}.

## Your Role
Title: ${employee.roleTitle}
Department: ${employee.department}
Reports to: ${employee.reportsToName}

## Your Capabilities
${employee.roleTemplate.capabilities.map(c => `- ${c.name}: ${c.description}`).join('\n')}

## Your Personality
${personalityToInstructions(employee.personality)}

## Decision Making Rules
- For EVERY action with side effects, include a "confidenceScore" (0.0-1.0)
- Score >= ${employee.config.confidenceThresholds.execute}: You are confident. Execute directly.
- Score >= ${employee.config.confidenceThresholds.recommend}: You're unsure. Use request_approval.
- Score < ${employee.config.confidenceThresholds.escalateBelow}: You're stuck. Use escalate_to_human.

## Communication Style
Tone: ${employee.config.communicationTone}
Proactivity: ${employee.config.proactivityLevel}

## Working Context
${relevantMemories.map(m => `- ${m.subject}: ${m.content}`).join('\n')}

## Important Rules
1. Always log your reasoning using log_activity before taking actions
2. Search the knowledge base before making assumptions
3. When in doubt, request approval rather than guessing
4. Store important learnings using store_memory
5. Be transparent about your confidence level
`.trim();
}

function personalityToInstructions(p: PersonalityDimensions): string {
  const traits: string[] = [];
  if (p.warmth > 7) traits.push("Be warm, empathetic, and personable in communications");
  if (p.warmth < 4) traits.push("Be businesslike and direct — skip pleasantries");
  if (p.precision > 7) traits.push("Be extremely precise with data, dates, and details");
  if (p.initiative > 7) traits.push("Proactively suggest improvements and flag opportunities");
  if (p.creativity > 7) traits.push("Think creatively — propose unconventional approaches");
  if (p.directness > 7) traits.push("Be direct and concise — get to the point quickly");
  if (p.adaptability > 7) traits.push("Adapt your approach based on context and audience");
  return traits.join('\n');
}
```

---

### 5. New Database Tables

```sql
-- Add to Supabase migration

-- Real-time agent activity events (powers live dashboard)
create table agent_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid not null references employees(id),
  task_id uuid references tasks(id),
  event_type text not null,  -- action | thinking | decision | communication | escalation | error | waiting
  content text not null,
  confidence float,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Episodic memory (per-employee experiences)
create table episodic_memories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid not null references employees(id),
  event_type text not null,  -- interaction | decision | feedback | observation
  content text not null,
  significance float not null default 0.5,
  task_id uuid references tasks(id),
  created_at timestamptz not null default now()
);

-- Institutional memory (org-wide or employee-specific patterns)
create table institutional_memories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid references employees(id),  -- null = org-wide
  category text not null,  -- preference | pattern | relationship | rule | context
  subject text not null,
  content text not null,
  confidence float not null default 0.5,
  source_count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Agent sessions (track active/paused sessions)
create table agent_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  employee_id uuid not null references employees(id),
  task_id uuid references tasks(id),
  sdk_session_id text,  -- Claude Agent SDK session ID for resume
  status text not null default 'active',  -- active | paused | completed | failed
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  total_cost_usd float default 0,
  turns_used integer default 0
);

-- Enable RLS + realtime on agent_events
alter table agent_events enable row level security;
alter table episodic_memories enable row level security;
alter table institutional_memories enable row level security;
alter table agent_sessions enable row level security;

-- RLS policies (org-scoped read)
create policy "Org members can read agent events"
  on agent_events for select
  using (org_id in (select org_id from users where id = auth.uid()));

create policy "Org members can read episodic memories"
  on episodic_memories for select
  using (org_id in (select org_id from users where id = auth.uid()));

create policy "Org members can read institutional memories"
  on institutional_memories for select
  using (org_id in (select org_id from users where id = auth.uid()));

create policy "Org members can read agent sessions"
  on agent_sessions for select
  using (org_id in (select org_id from users where id = auth.uid()));

-- Enable Supabase Realtime on agent_events for live dashboard
alter publication supabase_realtime add table agent_events;
```

---

### 6. API Routes

```
apps/web/app/api/
├── agents/
│   └── [employeeId]/
│       ├── execute-task/route.ts   POST — Assign a task and start agent
│       ├── intervene/route.ts      POST — Send guidance to running agent
│       ├── pause/route.ts          POST — Pause agent execution
│       ├── resume/route.ts         POST — Resume paused agent
│       └── stream/route.ts         GET  — SSE stream of live activity
├── approvals/
│   └── [id]/
│       └── resolve/route.ts        POST — Approve/reject/modify action
├── escalations/
│   └── [id]/
│       └── resolve/route.ts        POST — Resolve/dismiss escalation
├── tasks/
│   └── route.ts                    POST — Create task (auto-assigns to best employee)
└── employees/
    └── route.ts                    POST — Create employee (from hire wizard)
```

#### Example: Execute Task Route

```typescript
// apps/web/app/api/agents/[employeeId]/execute-task/route.ts
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orchestrator } from "@journeyman/agent-engine";

export async function POST(req: Request, { params }: { params: { employeeId: string } }) {
  const user = await auth();
  if (!user?.orgId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId } = await req.json();

  // Load employee and task
  const { data: employee } = await db.from("employees")
    .select("*").eq("id", params.employeeId).eq("org_id", user.orgId).single();
  const { data: task } = await db.from("tasks")
    .select("*").eq("id", taskId).eq("org_id", user.orgId).single();
  const { data: org } = await db.from("organizations")
    .select("*").eq("id", user.orgId).single();

  if (!employee || !task || !org) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Start agent execution (non-blocking)
  orchestrator.executeTask(employee, task, org);

  return Response.json({ status: "started", employeeId: employee.id, taskId: task.id });
}
```

#### Example: SSE Live Stream Route

```typescript
// apps/web/app/api/agents/[employeeId]/stream/route.ts
export async function GET(req: Request, { params }: { params: { employeeId: string } }) {
  const user = await auth();
  if (!user?.orgId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Subscribe to agent_events via Supabase Realtime
      const channel = db.channel(`agent-${params.employeeId}`)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "agent_events",
          filter: `employee_id=eq.${params.employeeId}`,
        }, (payload) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload.new)}\n\n`));
        })
        .subscribe();

      // Cleanup on disconnect
      req.signal.addEventListener("abort", () => {
        channel.unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

#### Example: Approve Action Route

```typescript
// apps/web/app/api/approvals/[id]/resolve/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await auth();
  const { action, feedback } = await req.json();
  // action: "approved" | "rejected" | "modified"

  // Update approval record
  await db.from("approvals").update({
    status: action,
    resolved_by: user.id,
    resolution_feedback: feedback,
    resolved_at: new Date().toISOString(),
  }).eq("id", params.id);

  // If approved, the agent's blocked tool call gets unblocked
  // (via a Supabase Realtime subscription in the agent session)

  // Store feedback as institutional memory for the employee
  if (feedback) {
    const { data: approval } = await db.from("approvals")
      .select("employee_id, action_type, reasoning").eq("id", params.id).single();

    await db.from("institutional_memories").insert({
      org_id: user.orgId,
      employee_id: approval.employee_id,
      category: action === "rejected" ? "rule" : "preference",
      subject: `Approval feedback: ${approval.action_type}`,
      content: `Manager ${action} this action. Feedback: ${feedback}. Original reasoning: ${approval.reasoning}`,
      confidence: 0.9,
    });
  }

  return Response.json({ success: true });
}
```

---

### 7. Dashboard Wiring

#### Data Fetching Layer

Create server-side data functions that all pages use:

```typescript
// apps/web/lib/data/employees.ts
import { db } from "@/lib/db";

export async function getEmployees(orgId: string) {
  const { data } = await db.from("employees")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getEmployeeWithStats(employeeId: string, orgId: string) {
  const { data: employee } = await db.from("employees")
    .select("*").eq("id", employeeId).eq("org_id", orgId).single();

  const { data: tasks } = await db.from("tasks")
    .select("id, status, priority, created_at")
    .eq("employee_id", employeeId);

  const { data: recentActivity } = await db.from("agent_events")
    .select("*")
    .eq("employee_id", employeeId)
    .order("created_at", { ascending: false })
    .limit(20);

  return { employee, tasks, recentActivity };
}
```

```typescript
// apps/web/lib/data/dashboard.ts
export async function getDashboardStats(orgId: string) {
  const { count: employeeCount } = await db.from("employees")
    .select("*", { count: "exact", head: true }).eq("org_id", orgId);

  const { count: pendingApprovals } = await db.from("approvals")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId).eq("status", "pending");

  const { count: openEscalations } = await db.from("escalations")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId).eq("status", "open");

  // ... more aggregations
  return { employeeCount, pendingApprovals, openEscalations };
}
```

#### Live Monitoring Page — Real Connection

```typescript
// apps/web/app/dashboard/employees/[id]/live/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function LiveMonitor({ params }) {
  const [events, setEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    const es = new EventSource(`/api/agents/${params.id}/stream`);
    es.onmessage = (e) => {
      const event = JSON.parse(e.data);
      setEvents((prev) => [...prev, event]);
    };
    return () => es.close();
  }, [params.id]);

  async function sendGuidance(message: string) {
    await fetch(`/api/agents/${params.id}/intervene`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // ... render timeline + intervention panel using real events
}
```

#### Approval Queue — Working Mutations

```typescript
// apps/web/app/dashboard/approvals/page.tsx
// Replace mock data with real Supabase query
// Add working approve/reject buttons that call /api/approvals/[id]/resolve
```

#### Hiring Wizard — Creates Real Employees

```typescript
// Final step of hire wizard calls:
// POST /api/employees — creates employee record
// Then: POST /api/agents/[id]/execute-task — runs onboarding task
```

---

## Implementation Order

### Step 1: Data Foundation (1-2 days)
- [ ] Create `lib/data/` fetching layer (employees, tasks, approvals, escalations, dashboard)
- [ ] Replace mock data imports on dashboard, employees, approvals, escalations pages
- [ ] Add agent_events, episodic_memories, institutional_memories, agent_sessions tables
- [ ] Wire hiring wizard to create real employee records in Supabase

### Step 2: Agent Engine Core (2-3 days)
- [ ] Create `packages/agent-engine` package with tsconfig, package.json
- [ ] Install `@anthropic-ai/claude-agent-sdk`
- [ ] Implement EmployeeSession (wraps SDK query with system prompt + tools)
- [ ] Implement AgentOrchestrator (manages sessions, routes tasks)
- [ ] Build platform MCP tools (task mgmt, approval, escalation, knowledge, memory)
- [ ] Implement confidence engine via canUseTool

### Step 3: Task Execution Pipeline (2-3 days)
- [ ] API route: POST /api/agents/[employeeId]/execute-task
- [ ] API route: POST /api/tasks (create + auto-assign)
- [ ] Agent picks up task → plans → executes with tools
- [ ] Confidence-based routing: autonomous / approval / escalation
- [ ] Task status updates flow back to Supabase
- [ ] Activity events logged to agent_events table

### Step 4: Live Dashboard (1-2 days)
- [ ] API route: GET /api/agents/[employeeId]/stream (SSE)
- [ ] Wire live monitoring page to SSE stream
- [ ] Working intervention panel (pause, message, override)
- [ ] Dashboard activity feed via Supabase Realtime subscription
- [ ] Real-time stat updates on main dashboard

### Step 5: Approval & Escalation Workflows (1-2 days)
- [ ] API route: POST /api/approvals/[id]/resolve
- [ ] API route: POST /api/escalations/[id]/resolve
- [ ] Working approve/reject/modify buttons on approvals page
- [ ] Feedback stored as institutional memory
- [ ] Agent resumes after approval resolution

### Step 6: Communication Tools (2-3 days)
- [ ] Email tool (initial: simulated, then real via Resend/SendGrid)
- [ ] Slack tool (via Slack API)
- [ ] Knowledge base search (full-text search on knowledge_items)
- [ ] Handoff tool (employee-to-employee task transfer)

### Step 7: Memory & Learning (1-2 days)
- [ ] Episodic memory extraction after task completion
- [ ] Institutional memory from approval feedback
- [ ] Memory injection into system prompt for new tasks
- [ ] Memory UI on employee detail page (already has tab)

### Step 8: Automations & Triggers (1-2 days)
- [ ] Standing instructions → create tasks when triggers fire
- [ ] Scheduled tasks via Supabase cron (pg_cron)
- [ ] Webhook endpoint for external event triggers

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Agent SDK | Claude Agent SDK (TS) | Same tools as Claude Code, built-in MCP, subagent orchestration |
| Model for agents | Sonnet 4.6 (default) | Best cost/quality balance for agent tasks |
| Model for subagents | Haiku 4.5 | Fast + cheap for research/analysis subtasks |
| Model for complex | Opus 4.6 (opt-in) | For high-stakes decisions requiring deep reasoning |
| Tool system | MCP via createSdkMcpServer | In-process, type-safe, no external server needed |
| Confidence gate | canUseTool callback | Intercepts every tool call, no agent code change needed |
| Live streaming | SSE + Supabase Realtime | Native browser support, Supabase handles pub/sub |
| Memory storage | Supabase tables | Queryable, durable, org-scoped with RLS |
| Budget control | maxBudgetUsd per task | Hard cap prevents runaway costs |

---

## UX Flow: End-to-End Task Execution

```
Manager clicks "Assign Task" on dashboard
        │
        ▼
POST /api/agents/{employeeId}/execute-task
        │
        ▼
AgentOrchestrator creates EmployeeSession
  • Builds system prompt (role + personality + memories)
  • Connects MCP tools (platform + communication + CRM)
  • Sets confidence thresholds via canUseTool
        │
        ▼
Agent starts working (Claude SDK query loop)
  │
  ├─► log_activity("thinking", "Analyzing task requirements...")
  │   → agent_events table → Supabase Realtime → Dashboard live feed
  │
  ├─► search_knowledge_base("sales playbook") → reads docs
  │
  ├─► recall_memory("client preferences") → gets past context
  │
  ├─► log_activity("decision", "Will draft proposal with 3 tiers")
  │
  ├─► [Subagent: writer] → drafts proposal email
  │
  ├─► send_email(to: "client@co.com", subject: "Proposal", ...)
  │   │
  │   └─► canUseTool fires:
  │       confidence = 0.72, threshold = 0.85
  │       → Creates approval record
  │       → Denies tool call
  │       → Agent receives: "Submitted for approval"
  │
  ├─► Agent moves to next task while waiting
  │
  │   ... Manager sees approval in queue ...
  │   ... Manager clicks "Approve" with feedback ...
  │
  ├─► POST /api/approvals/{id}/resolve (approved)
  │   → Feedback stored as institutional memory
  │   → Agent's blocked action gets released
  │
  ├─► send_email executes successfully
  │
  ├─► store_memory("preference", "Manager prefers 3-tier proposals")
  │
  ├─► update_task_status("completed", { result: "..." })
  │
  └─► Session ends. Dashboard updates.
```

---

## Cost Estimates

| Operation | Model | Est. Cost | Frequency |
|-----------|-------|-----------|-----------|
| Simple task (email reply) | Sonnet | ~$0.05 | 50/day |
| Medium task (research + draft) | Sonnet + Haiku subagent | ~$0.15 | 20/day |
| Complex task (analysis + multi-step) | Sonnet + 2 subagents | ~$0.40 | 5/day |
| Budget cap per task | — | $0.50 default | configurable |
| **Est. daily cost per employee** | — | **~$3-8** | — |
| **Est. monthly cost (6 employees)** | — | **~$500-1500** | — |

These are rough estimates. The `maxBudgetUsd` option on the SDK provides a hard
cap per task execution, and the dashboard analytics page will show real costs.
