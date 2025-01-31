'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { JsonViewerProps } from '../types/flowchart.types';

export default function JsonViewer({ flowDescription }: JsonViewerProps) {
  const downloadJson = () => {
    const blob = new Blob([flowDescription], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-architecture.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-96 border-l border-border bg-card p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Architecture JSON</h3>
        <Button variant="outline" size="sm" onClick={downloadJson}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        value={flowDescription}
        readOnly
        className="flex-1 w-full p-4 font-mono text-sm bg-background border rounded-md"
        style={{ resize: 'none' }}
      />
    </div>
  );
}