'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowchartCanvas } from './FlowchartCanvas';
import CodeGeneration from './CodeGeneration';
import { ShareDialog } from './ShareDialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFlowchartContext } from '../context/FlowchartContext';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { saveFlowchart } from '../services/flowchartService';
import { toast } from "sonner";

interface FlowchartTabsProps {
  flowchartId?: string;
}

export function FlowchartTabs({ flowchartId }: FlowchartTabsProps) {
  const { user } = useAuth();
  const { nodes, edges, flowchartData } = useFlowchartContext();

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save flowcharts');
      return;
    }

    try {
      const id = await saveFlowchart(user.uid, 'My Flowchart', nodes, edges);
      toast.success('Flowchart saved successfully');
      window.history.pushState({}, '', `/flowchart/${id}`);
    } catch (error) {
      toast.error('Failed to save flowchart');
    }
  };

  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      <Tabs defaultValue="flowchart" className="flex-1">
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            
            {user && flowchartId && flowchartData && (
              <ShareDialog 
                flowchartId={flowchartId} 
                sharedWith={flowchartData.sharedWith} 
              />
            )}
          </div>
        </div>
        
        <TabsContent value="flowchart" className="flex-1 mt-0">
          <FlowchartCanvas />
        </TabsContent>
        
        <TabsContent value="code" className="flex-1 mt-0 overflow-auto">
          <CodeGeneration flowDescription={useFlowchartContext()?.flowDescription || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
}