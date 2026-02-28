'use client';

import { useState } from 'react';
import { Hash, Plus, Copy, Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  scopes: string[];
  requestCount: number;
  status: 'active' | 'expired' | 'revoked';
}

const mockKeys: APIKey[] = [
  { id: 'key-1', name: 'Production API Key', prefix: 'jm_live_a3f2', createdAt: '2026-01-15', lastUsed: '2026-02-28', expiresAt: null, scopes: ['employees:read', 'tasks:read', 'tasks:write'], requestCount: 12450, status: 'active' },
  { id: 'key-2', name: 'Development Key', prefix: 'jm_test_b8d1', createdAt: '2026-02-01', lastUsed: '2026-02-27', expiresAt: '2026-06-01', scopes: ['employees:read', 'tasks:read'], requestCount: 3200, status: 'active' },
  { id: 'key-3', name: 'Webhook Integration', prefix: 'jm_live_c5e9', createdAt: '2026-01-20', lastUsed: '2026-02-28', expiresAt: null, scopes: ['webhooks:write', 'events:read'], requestCount: 8900, status: 'active' },
  { id: 'key-4', name: 'Old Integration Key', prefix: 'jm_live_d2a7', createdAt: '2025-12-15', lastUsed: '2026-01-30', expiresAt: '2026-02-15', scopes: ['employees:read'], requestCount: 450, status: 'expired' },
];

export default function APIKeysPage() {
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 flex items-center gap-3">
            <Hash className="w-6 h-6" />
            API Keys
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage API keys for programmatic access to JourneyMan
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Generate Key
        </Button>
      </div>

      <div className="space-y-4">
        {mockKeys.map((key) => (
          <Card key={key.id} className={cn(key.status !== 'active' && 'opacity-60')}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-neutral-100">{key.name}</h3>
                    <Badge variant={key.status === 'active' ? 'default' : key.status === 'expired' ? 'secondary' : 'destructive'} className="text-[10px]">
                      {key.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <code className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-1 rounded">
                      {showKey === key.id ? `${key.prefix}••••••••••••••••••••••••` : `${key.prefix}••••••••`}
                    </code>
                    <button onClick={() => setShowKey(showKey === key.id ? null : key.id)} className="p-1 text-neutral-500 hover:text-neutral-300">
                      {showKey === key.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-1 text-neutral-500 hover:text-neutral-300">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {key.scopes.map((scope) => (
                      <span key={scope} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-500">{scope}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>Created: {key.createdAt}</span>
                    <span>Last used: {key.lastUsed || 'Never'}</span>
                    {key.expiresAt && <span>Expires: {key.expiresAt}</span>}
                    <span>{key.requestCount.toLocaleString()} requests</span>
                  </div>
                </div>

                {key.status === 'active' && (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-3 h-3" /> Rotate
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
