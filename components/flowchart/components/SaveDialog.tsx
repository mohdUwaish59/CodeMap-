'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFlowchartContext } from '../context/FlowchartContext';
import { saveFlowchart } from '../services/flowchartService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function SaveDialog() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { rfInstance } = useFlowchartContext();
  const router = useRouter();

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save flowcharts');
      return;
    }

    if (!rfInstance) {
      toast.error('Flow instance not ready');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a name for your flowchart');
      return;
    }

    try {
      const flow = rfInstance.toObject();
      const id = await saveFlowchart(user.uid, name, flow);
      toast.success('Flowchart saved successfully');
      setOpen(false);
      router.push(`/flowchart/${id}`);
    } catch (error) {
      console.error('Error saving flowchart:', error);
      toast.error('Failed to save flowchart');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Flowchart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter flowchart name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Flowchart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}