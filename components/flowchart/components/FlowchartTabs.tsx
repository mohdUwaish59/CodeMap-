'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowchartCanvas } from './FlowchartCanvas';
import CodeGeneration from './CodeGeneration';
import { useFlowchartContext } from '../context/FlowchartContext';

export function FlowchartTabs() {
  const { flowDescription } = useFlowchartContext();

  return (
    <Tabs defaultValue="flowchart" className="h-screen flex flex-col">
      <div className="border-b px-4">
        <TabsList>
          <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
          <TabsTrigger value="code">Generated Code</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="flowchart" className="flex-1 mt-0">
        <FlowchartCanvas />
      </TabsContent>
      
      <TabsContent value="code" className="flex-1 mt-0 overflow-auto">
        <CodeGeneration flowDescription={flowDescription} />
      </TabsContent>
    </Tabs>
  );
}