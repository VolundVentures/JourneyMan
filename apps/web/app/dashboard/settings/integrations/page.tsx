'use client';

import { Check, ExternalLink, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockIntegrations } from '@/lib/mock-data';

export default function IntegrationsPage() {
  const connected = mockIntegrations.filter((i) => i.status === 'active');
  const available = mockIntegrations.filter((i) => i.status !== 'active');

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-neutral-50">Integrations</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Connect tools your AI employees need to work
        </p>
      </div>

      {connected.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Connected ({connected.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connected.map((integration) => (
              <div
                key={integration.id}
                className="rounded-xl border border-neutral-700 bg-neutral-900 p-4 transition-colors hover:bg-neutral-800/80"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-neutral-200">{integration.name}</h3>
                      <Badge variant="success">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{integration.description}</p>
                    {integration.lastSyncedAt && (
                      <p className="text-[10px] text-neutral-600 mt-2 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Last sync: {formatRelativeTime(integration.lastSyncedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
          Available ({available.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {available.map((integration) => (
            <div
              key={integration.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/80 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                  {integration.icon}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-300 group-hover:text-neutral-200 transition-colors">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">{integration.description}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <ExternalLink className="w-3 h-3" />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
