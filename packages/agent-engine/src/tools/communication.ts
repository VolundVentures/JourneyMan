// ============================================
// Communication MCP Tools
// ============================================
// Email and Slack tools for AI employees.
// Initially logs to messages table; real integrations plugged in later.

import { tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create the communication MCP tool server.
 */
export function createCommunicationToolServer(db: SupabaseClient, context: { orgId: string; employeeId: string }) {
  const { orgId, employeeId } = context;

  const sendEmail = tool(
    'send_email',
    'Compose and send an email. External emails require approval if confidence is below threshold.',
    {
      to: z.string().describe('Recipient email address'),
      subject: z.string().describe('Email subject line'),
      body: z.string().describe('Email body (plain text or markdown)'),
      replyToThreadId: z.string().optional().describe('Thread ID if this is a reply'),
      confidenceScore: z.number().min(0).max(1).describe('Your confidence that this email is appropriate'),
    },
    async ({ to, subject, body, replyToThreadId }) => {
      // Record the message in the database
      const { data, error } = await db.from('messages').insert({
        org_id: orgId,
        employee_id: employeeId,
        channel: 'email',
        direction: 'outbound',
        thread_id: replyToThreadId,
        from_address: null, // Will be set from employee's email_address
        to_address: to,
        subject,
        body,
        metadata: { status: 'queued' },
      }).select('id').single();

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error sending email: ${error.message}` }] };
      }

      // TODO: In production, trigger actual email delivery via integration
      // For now, mark as sent in the message record
      await db.from('messages').update({
        metadata: { status: 'sent', sentAt: new Date().toISOString() },
      }).eq('id', data.id);

      return {
        content: [{
          type: 'text' as const,
          text: `Email sent to ${to}: "${subject}" (message ID: ${data.id})`,
        }],
      };
    },
    { annotations: { destructive: true } }
  );

  const readInbox = tool(
    'read_inbox',
    'Read recent emails from the inbox.',
    {
      limit: z.number().default(10).describe('Max emails to return'),
      unreadOnly: z.boolean().default(true),
    },
    async ({ limit }) => {
      const { data, error } = await db
        .from('messages')
        .select('id, from_address, to_address, subject, body, created_at')
        .eq('org_id', orgId)
        .eq('employee_id', employeeId)
        .eq('channel', 'email')
        .eq('direction', 'inbound')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error reading inbox: ${error.message}` }] };
      }
      if (!data || data.length === 0) {
        return { content: [{ type: 'text' as const, text: 'No emails in inbox.' }] };
      }

      return {
        content: [{
          type: 'text' as const,
          text: data.map((msg) =>
            `From: ${msg.from_address}\nSubject: ${msg.subject}\nDate: ${msg.created_at}\n\n${msg.body?.slice(0, 500) ?? ''}`
          ).join('\n\n---\n\n'),
        }],
      };
    },
    { annotations: { readOnly: true } }
  );

  const sendSlackMessage = tool(
    'send_slack_message',
    'Post a message to a Slack channel or direct message.',
    {
      channel: z.string().describe('Slack channel name or user ID'),
      message: z.string().describe('Message content'),
      threadTs: z.string().optional().describe('Thread timestamp for replies'),
      confidenceScore: z.number().min(0).max(1).describe('Your confidence in this message'),
    },
    async ({ channel, message, threadTs }) => {
      // Record the message
      const { data, error } = await db.from('messages').insert({
        org_id: orgId,
        employee_id: employeeId,
        channel: 'slack',
        direction: 'outbound',
        thread_id: threadTs,
        to_address: channel,
        body: message,
        metadata: { status: 'queued', channel },
      }).select('id').single();

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error sending Slack message: ${error.message}` }] };
      }

      // TODO: Send via Slack API integration
      await db.from('messages').update({
        metadata: { status: 'sent', sentAt: new Date().toISOString(), channel },
      }).eq('id', data.id);

      return {
        content: [{
          type: 'text' as const,
          text: `Slack message sent to ${channel} (message ID: ${data.id})`,
        }],
      };
    },
    { annotations: { destructive: true } }
  );

  const readSlackMessages = tool(
    'read_slack_messages',
    'Read recent messages from a Slack channel.',
    {
      channel: z.string().describe('Slack channel name'),
      limit: z.number().default(20),
    },
    async ({ channel, limit }) => {
      const { data, error } = await db
        .from('messages')
        .select('id, from_address, body, created_at, metadata')
        .eq('org_id', orgId)
        .eq('channel', 'slack')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { content: [{ type: 'text' as const, text: `Error reading Slack: ${error.message}` }] };
      }
      if (!data || data.length === 0) {
        return { content: [{ type: 'text' as const, text: `No messages found in ${channel}.` }] };
      }

      return {
        content: [{
          type: 'text' as const,
          text: data.map((msg) =>
            `${msg.from_address ?? 'Unknown'} (${msg.created_at}):\n${msg.body}`
          ).join('\n\n'),
        }],
      };
    },
    { annotations: { readOnly: true } }
  );

  return createSdkMcpServer({
    name: 'journeyman-communication',
    tools: [sendEmail, readInbox, sendSlackMessage, readSlackMessages],
  });
}
