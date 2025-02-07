'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowchartCanvas } from './FlowchartCanvas';
import CodeGeneration from './CodeGeneration';
import { ShareDialog } from './ShareDialog';
import { SaveDialog } from './SaveDialog';
import { SavedFlowcharts } from './SavedFlowcharts';
import { useAuth } from '@/components/auth/AuthProvider';
import { useFlowchartContext } from '../context/FlowchartContext';

interface FlowchartTabsProps {
  flowchartId?: string;
}

export function FlowchartTabs({ flowchartId }: FlowchartTabsProps) {
  const { user } = useAuth();
  const { flowchartData, flowDescription } = useFlowchartContext();

  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      <Tabs defaultValue="flowchart" className="flex-1">
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
            <TabsTrigger value="saved">Saved Flowcharts</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <SaveDialog />
            
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
          <CodeGeneration flowDescription={flowDescription} />
        </TabsContent>

        <TabsContent value="saved" className="flex-1 mt-0 overflow-auto">
          <SavedFlowcharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}