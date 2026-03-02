// ============================================
// CRM MCP Tools
// ============================================
// Contact and company management tools backed by Supabase.

import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create the CRM MCP tool server.
 */
export function createCrmToolServer(db: SupabaseClient, context: { orgId: string }) {
  const { orgId } = context;

  const searchContacts = tool(
    'search_contacts',
    'Search for contacts by name, email, company, or label.',
    {
      query: z.string().describe('Search query'),
      limit: z.number().default(10),
    },
    async ({ query, limit }) => {
      const { data, error } = await db
        .from('contacts')
        .select('id, name, email, phone, company, title, labels, interaction_count, last_interaction_at')
        .eq('org_id', orgId)
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error searching contacts: ${error.message}` }] };
      }
      if (!data || data.length === 0) {
        return { content: [{ type: 'text' as const, text: `No contacts found matching "${query}".` }] };
      }
      return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
    },
    { annotations: { readOnly: true } }
  );

  const updateContact = tool(
    'update_contact',
    'Update a contact record with new information.',
    {
      contactId: z.string(),
      updates: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        title: z.string().optional(),
        labels: z.array(z.string()).optional(),
      }),
      confidenceScore: z.number().min(0).max(1).describe('Your confidence in these updates'),
    },
    async ({ contactId, updates }) => {
      const { error } = await db
        .from('contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', contactId)
        .eq('org_id', orgId);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error updating contact: ${error.message}` }] };
      }
      return { content: [{ type: 'text' as const, text: `Contact ${contactId} updated.` }] };
    },
    { annotations: { destructive: false } }
  );

  const searchCompanies = tool(
    'search_companies',
    'Search for companies by name, domain, or industry.',
    {
      query: z.string(),
      limit: z.number().default(10),
    },
    async ({ query, limit }) => {
      const { data, error } = await db
        .from('companies')
        .select('id, name, domain, industry, size, deal_value, stage')
        .eq('org_id', orgId)
        .or(`name.ilike.%${query}%,domain.ilike.%${query}%,industry.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error searching companies: ${error.message}` }] };
      }
      if (!data || data.length === 0) {
        return { content: [{ type: 'text' as const, text: `No companies found matching "${query}".` }] };
      }
      return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
    },
    { annotations: { readOnly: true } }
  );

  const createDeal = tool(
    'create_deal',
    'Create or update a company deal with value and stage.',
    {
      companyId: z.string(),
      dealValue: z.number().describe('Deal value in USD'),
      stage: z.string().describe('Deal stage (e.g., Prospecting, Qualified, Proposal, Closed Won)'),
      confidenceScore: z.number().min(0).max(1),
    },
    async ({ companyId, dealValue, stage }) => {
      const { error } = await db
        .from('companies')
        .update({ deal_value: dealValue, stage })
        .eq('id', companyId)
        .eq('org_id', orgId);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error creating deal: ${error.message}` }] };
      }
      return {
        content: [{
          type: 'text' as const,
          text: `Deal updated for company ${companyId}: $${dealValue.toLocaleString()} at stage "${stage}".`,
        }],
      };
    },
    { annotations: { destructive: false } }
  );

  return createSdkMcpServer({
    name: 'journeyman-crm',
    tools: [searchContacts, updateContact, searchCompanies, createDeal],
  });
}
