import { FlowchartTabs } from '@/components/flowchart/components/FlowchartTabs';
import { FlowchartProvider } from '@/components/flowchart/context/FlowchartContext';

export default function Home() {
  return (
    <FlowchartProvider>
      <FlowchartTabs />
    </FlowchartProvider>
  );
}