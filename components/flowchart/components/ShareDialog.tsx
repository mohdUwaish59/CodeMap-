'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, X, Check, Copy } from 'lucide-react';
import { shareFlowchart, removeSharedUser } from '../services/flowchartService';
import { toast } from 'sonner';

interface ShareDialogProps {
  flowchartId: string;
  sharedWith: string[];
}

export function ShareDialog({ flowchartId, sharedWith }: ShareDialogProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await shareFlowchart(flowchartId, email);
      setEmail('');
      toast.success('User added successfully');
    } catch (error) {
      toast.error('Failed to share flowchart');
    }
  };

  const handleRemove = async (userEmail: string) => {
    try {
      await removeSharedUser(flowchartId, userEmail);
      toast.success('User removed successfully');
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/flowchart/${flowchartId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Flowchart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleShare}>Share</Button>
          </div>

          <div className="flex gap-2">
            <Input
              readOnly
              value={`${window.location.origin}/flowchart/${flowchartId}`}
            />
            <Button variant="outline" onClick={copyLink}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Shared with</h3>
            {sharedWith.map((email) => (
              <div key={email} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <span className="text-sm">{email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(email)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}