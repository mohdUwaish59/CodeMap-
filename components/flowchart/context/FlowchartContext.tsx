'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  FlowchartData, 
  getFlowchart, 
  updateFlowchartData, 
  subscribeToFlowchart 
} from '../services/flowchartService';

interface FlowchartContextType {
  nodes: Node[];
  edges: Edge[];
  flowDescription: string;
  flowchartData: FlowchartData | null;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setFlowDescription: (desc: string) => void;
}

const FlowchartContext = createContext<FlowchartContextType | null>(null);

interface FlowchartProviderProps {
  children: React.ReactNode;
  flowchartId?: string;
}

export function FlowchartProvider({ children, flowchartId }: FlowchartProviderProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [flowDescription, setFlowDescription] = useState<string>('');
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!flowchartId || !user) return;

    const loadFlowchart = async () => {
      const data = await getFlowchart(flowchartId);
      if (data) {
        setNodes(data.nodes);
        setEdges(data.edges);
        setFlowchartData(data.data);
      }
    };

    const unsubscribe = subscribeToFlowchart(flowchartId, (nodes, edges, data) => {
      setNodes(nodes);
      setEdges(edges);
      setFlowchartData(data);
    });

    loadFlowchart();
    return () => unsubscribe();
  }, [flowchartId, user]);

  useEffect(() => {
    if (!flowchartId || !user) return;

    const saveChanges = async () => {
      try {
        await updateFlowchartData(flowchartId, nodes, edges);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    };

    const debounceTimeout = setTimeout(saveChanges, 1000);
    return () => clearTimeout(debounceTimeout);
  }, [nodes, edges, flowchartId, user]);

  return (
    <FlowchartContext.Provider 
      value={{ 
        nodes, 
        edges, 
        flowDescription,
        flowchartData,
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