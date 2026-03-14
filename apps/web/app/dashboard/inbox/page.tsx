'use client';

import { useState } from 'react';
import {
  Inbox, Mail, MessageSquare, Phone, Search, Star, Archive,
  Send, Paperclip, MoreHorizontal, ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatRelativeTime, employeeEmojis } from '@/lib/utils';

interface Message {
  id: string;
  threadId: string;
  from: string;
  fromType: 'employee' | 'external' | 'user';
  to: string;
  subject: string;
  preview: string;
  channel: 'email' | 'slack' | 'phone' | 'internal';
  timestamp: string;
  read: boolean;
  starred: boolean;
  employeeId?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

const mockMessages: Message[] = [
  { id: 'msg-1', threadId: 'th-1', from: 'Nova', fromType: 'employee', to: 'Sarah Johnson (CloudVault)', subject: 'Re: Partnership Proposal — Q1 2026', preview: 'Thank you for your interest in our enterprise plan. I\'ve prepared a customized proposal that addresses your team\'s specific needs...', channel: 'email', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), read: false, starred: true, employeeId: 'emp-002', sentiment: 'positive' },
  { id: 'msg-2', threadId: 'th-2', from: 'Apex', fromType: 'employee', to: 'Marcus Rivera (TechForward)', subject: 'Follow-up: Demo Scheduling', preview: 'Hi Marcus, following up on our conversation about the platform demo. I have availability on...', channel: 'email', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), read: false, starred: false, employeeId: 'emp-003', sentiment: 'neutral' },
  { id: 'msg-3', threadId: 'th-3', from: 'Ember', fromType: 'employee', to: '#support-escalations', subject: 'Ticket #4521 — Data Migration Issue', preview: 'Resolved the initial concern, but the client mentioned they have 3 more legacy databases that need migration...', channel: 'slack', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), read: true, starred: false, employeeId: 'emp-005', sentiment: 'neutral' },
  { id: 'msg-4', threadId: 'th-4', from: 'Atlas', fromType: 'employee', to: 'Lisa Park (Acme Corp)', subject: 'Vendor Delivery Update', preview: 'Hi Lisa, just checking in on the delivery timeline for order #VD-2847. Our internal deadline is...', channel: 'email', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), read: true, starred: false, employeeId: 'emp-001', sentiment: 'neutral' },
  { id: 'msg-5', threadId: 'th-5', from: 'David Kim (InnovateTech)', fromType: 'external', to: 'Apex', subject: 'Re: Pricing Question', preview: 'Thanks for the detailed breakdown. We\'re comparing this with CompetitorX\'s offering. Can you match their pricing on...', channel: 'email', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), read: true, starred: true, sentiment: 'negative' },
  { id: 'msg-6', threadId: 'th-6', from: 'Flux', fromType: 'employee', to: '#marketing-content', subject: 'Blog Post Draft: AI Operations Guide', preview: 'Draft ready for review. 2,400 words covering 5 key strategies for implementing AI in operations...', channel: 'slack', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), read: true, starred: false, employeeId: 'emp-006' },
];

const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  slack: MessageSquare,
  phone: Phone,
  internal: Inbox,
};

const folders = [
  { label: 'Inbox', icon: Inbox, count: 2 },
  { label: 'Starred', icon: Star, count: 2 },
  { label: 'Sent', icon: Send, count: 0 },
  { label: 'Archive', icon: Archive, count: 0 },
];

export default function InboxPage() {
  const [selectedFolder, setSelectedFolder] = useState('Inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockMessages.filter((msg) => {
    if (selectedFolder === 'Starred') return msg.starred;
    if (selectedFolder === 'Sent') return msg.fromType === 'user';
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return msg.subject.toLowerCase().includes(q) || msg.from.toLowerCase().includes(q) || msg.preview.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
          <Inbox className="w-6 h-6" />
          Unified Inbox
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          All communications across channels in one place
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[600px]">
        {/* Folders */}
        <div className="lg:col-span-2 space-y-1">
          {folders.map((folder) => {
            const FolderIcon = folder.icon;
            return (
              <button
                key={folder.label}
                onClick={() => setSelectedFolder(folder.label)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedFolder === folder.label
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                )}
              >
                <FolderIcon className="w-4 h-4" />
                <span className="flex-1 text-left">{folder.label}</span>
                {folder.count > 0 && (
                  <span className="text-[10px] font-mono bg-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded-full">{folder.count}</span>
                )}
              </button>
            );
          })}

          <div className="border-t border-neutral-200 my-3" />

          <p className="px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">By Employee</p>
          {['Nova', 'Apex', 'Atlas', 'Ember', 'Flux', 'Sage'].map((name) => (
            <button key={name} className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-50 hover:text-neutral-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
              {name}
            </button>
          ))}
        </div>

        {/* Message List */}
        <Card className="lg:col-span-4 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-neutral-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-9 h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.map((msg) => {
              const ChannelIcon = channelIcons[msg.channel];
              return (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={cn(
                    'flex items-start gap-3 w-full p-3 text-left border-b border-neutral-200 transition-colors',
                    selectedMessage?.id === msg.id ? 'bg-neutral-100' : 'hover:bg-neutral-100/50',
                    !msg.read && 'bg-neutral-50'
                  )}
                >
                  <ChannelIcon className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-medium truncate', msg.read ? 'text-neutral-500' : 'text-neutral-800')}>
                        {msg.from}
                      </span>
                      {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
                      {msg.starred && <Star className="w-3 h-3 text-amber-600 shrink-0 fill-amber-400" />}
                    </div>
                    <p className="text-xs text-neutral-600 truncate">{msg.subject}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">{msg.preview}</p>
                    <span className="text-[10px] text-neutral-400 mt-1 inline-block">{formatRelativeTime(msg.timestamp)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-6 overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-neutral-900">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Star className={cn('w-4 h-4', selectedMessage.starred ? 'text-amber-600 fill-amber-400' : 'text-neutral-500')} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Archive className="w-4 h-4 text-neutral-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="font-medium text-neutral-700">
                    {selectedMessage.employeeId && (
                      <span className="mr-1">{employeeEmojis[selectedMessage.employeeId]}</span>
                    )}
                    {selectedMessage.from}
                  </span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedMessage.to}</span>
                  <span className="text-neutral-400">·</span>
                  <Badge variant="outline" className="text-[10px]">{selectedMessage.channel}</Badge>
                  {selectedMessage.sentiment && (
                    <Badge variant={selectedMessage.sentiment === 'positive' ? 'default' : selectedMessage.sentiment === 'negative' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {selectedMessage.sentiment}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
                <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.preview}
                  {'\n\n'}
                  This is a preview of the full message content. In the live application, this would show the complete email/message thread with full formatting, attachments, and conversation history.
                  {'\n\n'}
                  The AI employee&apos;s reasoning for this communication would also be displayed here: why they chose this tone, what context they drew from, and their confidence level.
                </div>
              </div>
              <div className="p-4 border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <Input placeholder="Reply or add guidance..." className="flex-1" />
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button size="sm">
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400">
              <div className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to view</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
