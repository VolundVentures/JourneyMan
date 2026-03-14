'use client';

import { useState } from 'react';
import {
  Upload,
  FileText,
  Link2,
  Edit3,
  Search,
  Archive,
  Trash2,
  Eye,
  File,
  RefreshCw,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockKnowledgeItems } from '@/lib/mock-data';

const sourceIcons: Record<string, React.ElementType> = {
  upload: FileText,
  sync: RefreshCw,
  manual: Edit3,
};

export default function KnowledgePage() {
  const [search, setSearch] = useState('');

  const filtered = mockKnowledgeItems.filter((item) =>
    search === '' ||
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.sourceType.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {mockKnowledgeItems.length} documents powering your AI employees
          </p>
        </div>
        <Button>
          <Upload className="w-4 h-4" />
          Upload Knowledge
        </Button>
      </div>

      {/* Upload zone */}
      <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white/50 p-8 text-center hover:border-neutral-400 transition-colors cursor-pointer group">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
            <Upload className="w-7 h-7 text-neutral-500 group-hover:text-neutral-600 transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-600">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              PDF, DOCX, TXT, MD, HTML, CSV, Excel — up to 50MB each
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline"><FileText className="w-3 h-3 mr-1" />PDF</Badge>
            <Badge variant="outline"><FileText className="w-3 h-3 mr-1" />DOCX</Badge>
            <Badge variant="outline"><File className="w-3 h-3 mr-1" />CSV</Badge>
            <Badge variant="outline"><Link2 className="w-3 h-3 mr-1" />URL</Badge>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          placeholder="Search knowledge..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Knowledge items */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const SourceIcon = sourceIcons[item.sourceType] || FileText;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 hover:bg-neutral-100 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg p-2 shrink-0 bg-neutral-100 text-neutral-500">
                  <SourceIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-700 truncate">{item.title}</h3>
                    <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{item.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                    <span>Source: {item.sourceType}</span>
                    {item.sourceRef && <span className="truncate max-w-[200px]">{item.sourceRef}</span>}
                    <span>Updated {formatRelativeTime(item.updatedAt)}</span>
                    {item.metadata && 'pages' in item.metadata && (
                      <span>{item.metadata.pages as number} pages</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-600">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
