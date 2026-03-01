'use client';

import * as React from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFilesSelected,
  accept,
  multiple = true,
  maxSize = 10 * 1024 * 1024,
  className,
}: FileUploadProps) {
  const [dragging, setDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => f.size <= maxSize);
    setFiles((prev) => [...prev, ...valid]);
    onFilesSelected(valid);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors',
          dragging
            ? 'border-neutral-400 bg-neutral-100'
            : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50'
        )}
      >
        <Upload className="w-8 h-8 text-neutral-500" />
        <p className="text-sm text-neutral-400">
          <span className="text-neutral-700 font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-neutral-400">Max {formatSize(maxSize)} per file</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200">
              <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-600 truncate">{file.name}</p>
                <p className="text-xs text-neutral-400">{formatSize(file.size)}</p>
              </div>
              <button onClick={() => removeFile(i)} className="p-1 rounded hover:bg-neutral-200 text-neutral-500 hover:text-neutral-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
