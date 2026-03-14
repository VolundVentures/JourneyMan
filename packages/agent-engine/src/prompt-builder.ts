// ============================================
// System Prompt Builder
// ============================================
// Constructs role-specific system prompts for each AI employee
// by combining role, personality, config, and memory context.

import type { Employee, Organization, RoleTemplate, PersonalityDimensions } from '@journeyman/shared';
import type { MemoryEntry } from './types.js';

/**
 * Convert personality dimensions (0-10 scale) into natural language instructions
 * that guide the agent's communication style and decision-making approach.
 */
export function personalityToInstructions(p?: PersonalityDimensions): string {
  if (!p) return '';
  const traits: string[] = [];

  // Warmth
  if (p.warmth >= 8) traits.push('Be warm, empathetic, and personable in all communications');
  else if (p.warmth >= 5) traits.push('Be friendly but professional');
  else if (p.warmth <= 3) traits.push('Be businesslike and direct — skip pleasantries');

  // Precision
  if (p.precision >= 8) traits.push('Be extremely precise with data, dates, and details — double-check everything');
  else if (p.precision >= 5) traits.push('Be accurate with facts and data');
  else traits.push('Focus on the big picture rather than minutiae');

  // Initiative
  if (p.initiative >= 8) traits.push('Proactively suggest improvements, flag opportunities, and anticipate needs');
  else if (p.initiative >= 5) traits.push('Suggest improvements when you notice clear opportunities');
  else traits.push('Focus on assigned work — suggest improvements only when asked');

  // Creativity
  if (p.creativity >= 8) traits.push('Think creatively — propose unconventional approaches when appropriate');
  else if (p.creativity <= 3) traits.push('Stick to proven methods and established processes');

  // Directness
  if (p.directness >= 8) traits.push('Be direct and concise — get to the point quickly');
  else if (p.directness <= 3) traits.push('Be diplomatic and soften feedback with context');

  // Adaptability
  if (p.adaptability >= 8) traits.push('Adapt your approach based on context, audience, and urgency');
  else if (p.adaptability <= 3) traits.push('Follow consistent, predictable communication patterns');

  return traits.join('\n');
}

/**
 * Build the full system prompt for an employee agent session.
 */
export function buildSystemPrompt(params: {
  employee: Employee;
  org: Organization;
  roleTemplate?: RoleTemplate;
  memories?: MemoryEntry[];
  taskContext?: string;
}): string {
  const { employee, org, roleTemplate, memories = [], taskContext } = params;
  const config = employee.config;
  const thresholds = config.confidenceThresholds;

  const sections: string[] = [];

  // === Identity ===
  sections.push(`You are ${employee.name}, an AI employee at ${org.name}.

## Your Role
Title: ${employee.roleTitle}
Department: ${employee.department}${employee.reportsToName ? `\nReports to: ${employee.reportsToName}` : ''}
Status: ${employee.status}
Languages: ${config.languages.join(', ')}`);

  // === Capabilities ===
  if (roleTemplate?.capabilities && roleTemplate.capabilities.length > 0) {
    sections.push(`## Your Capabilities
${roleTemplate.capabilities.map((c) => `- **${c.name}**: ${c.description}`).join('\n')}`);
  }

  // === Personality ===
  const personalityBlock = personalityToInstructions(
    (employee as Record<string, unknown>).personality as PersonalityDimensions | undefined
  );
  if (personalityBlock) {
    sections.push(`## Your Personality & Communication Style
${personalityBlock}`);
  }

  // === Communication config ===
  sections.push(`## Communication Settings
Tone: ${config.communicationTone}
Proactivity: ${config.proactivityLevel}
Autonomy mode: ${config.autonomyMode}`);

  // === Decision-making rules ===
  sections.push(`## Decision Making Rules
For EVERY action with side effects (sending emails, updating CRM, modifying records, scheduling):
1. Assess your confidence on a 0.0–1.0 scale
2. Include a \`confidenceScore\` field when calling side-effect tools

Confidence routing:
- Score >= ${thresholds.execute}: You are confident → execute directly
- Score >= ${thresholds.recommend} but < ${thresholds.execute}: You're unsure → use \`request_approval\` tool
- Score < ${thresholds.escalateBelow}: You're stuck → use \`escalate_to_human\` tool

Read-only tools (searching knowledge, reading data) do NOT require confidence gating.`);

  // === Priority hierarchy ===
  if (config.priorityHierarchy.length > 0) {
    sections.push(`## Priority Hierarchy
When multiple tasks compete, prioritize by: ${config.priorityHierarchy.join(' > ')}`);
  }

  // === Working hours ===
  sections.push(`## Working Hours
${config.workingHours.start}–${config.workingHours.end} ${config.workingHours.timezone}`);

  // === Memories ===
  if (memories.length > 0) {
    sections.push(`## Relevant Context & Memories
${memories.map((m) => `- [${m.category}] ${m.subject}: ${m.content}`).join('\n')}`);
  }

  // === Task context ===
  if (taskContext) {
    sections.push(`## Current Task Context
${taskContext}`);
  }

  // === Operating rules ===
  sections.push(`## Operating Rules
1. Always log your reasoning using \`log_activity\` before taking significant actions
2. Search the knowledge base before making assumptions about company processes
3. When in doubt, request approval rather than guessing
4. Store important learnings using \`store_memory\` for future reference
5. Be transparent about your confidence level in decisions
6. If a task is outside your capabilities, escalate immediately
7. Respect rate limits and spending limits`);

  return sections.join('\n\n');
}
