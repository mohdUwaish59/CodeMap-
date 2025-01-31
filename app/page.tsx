import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowchartCanvas } from '@/components/flowchart/components/FlowchartCanvas';
import { FlowchartProvider } from '@/components/flowchart/context/FlowchartContext';
import { FlowchartTabs } from '@/components/flowchart/components/FlowchartTabs';

export default function Home() {
  return (
    <FlowchartProvider>
      <FlowchartTabs />
    </FlowchartProvider>
  );
}