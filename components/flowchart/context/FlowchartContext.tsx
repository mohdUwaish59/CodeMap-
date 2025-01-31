'use client';

import { createContext, useContext, useState } from 'react';
import { Node, Edge } from 'reactflow';

interface FlowchartContextType {
  nodes: Node[];
  edges: Edge[];
  flowDescription: string;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setFlowDescription: (desc: string) => void;
}

const FlowchartContext = createContext<FlowchartContextType | null>(null);

export function FlowchartProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [flowDescription, setFlowDescription] = useState<string>('');

  return (
    <FlowchartContext.Provider 
      value={{ 
        nodes, 
        edges, 
        flowDescription,
        setNodes, 
        setEdges,
        setFlowDescription
      }}
    >
      {children}
    </FlowchartContext.Provider>
  );
}

export function useFlowchartContext() {
  const context = useContext(FlowchartContext);
  if (!context) {
    throw new Error('useFlowchartContext must be used within a FlowchartProvider');
  }
  return context;
}