'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';
import { NodeEditorProps } from '@/components/flowchart/types/flowchart.types';

export default function NodeEditor({ node, onClose, onUpdate }: NodeEditorProps) {
  const [label, setLabel] = useState(node.data.label);
  const [description, setDescription] = useState(node.data.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(node.id, { ...node.data, label, description });
  };

  return (
    <Card className="absolute top-4 right-4 w-80 p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Edit Node</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Label</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
        <Button type="submit" className="w-full">
          Update Node
        </Button>
      </form>
    </Card>
  );
}