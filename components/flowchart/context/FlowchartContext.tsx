'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Node, Edge, ReactFlowInstance } from 'reactflow';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  FlowchartData, 
  getFlowchart, 
  updateFlowchartData
} from '../services/flowchartService';
import { generateFlowDescription } from '../utils/flowchartUtils';

interface FlowchartContextType {
  nodes: Node[];
  edges: Edge[];
  flowDescription: string;
  flowchartData: FlowchartData | null;
  rfInstance: ReactFlowInstance | null;
  selectedNode: Node | null;
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  setFlowDescription: (desc: string) => void;
  setRfInstance: (instance: ReactFlowInstance | null) => void;
  setSelectedNode: (node: Node | null) => void;
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
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { user } = useAuth();

  // Load flowchart data
  useEffect(() => {
    if (!flowchartId) return;

    const loadFlowchart = async () => {
      try {
        const data = await getFlowchart(flowchartId);
        if (data) {
          const flow = data.data.flow;
          
          // Ensure nodes and edges are properly formatted
          const formattedNodes = (flow.nodes || []).map(node => ({
            ...node,
            data: {
              ...node.data,
              icon: typeof node.data.icon === 'string' ? null : node.data.icon
            }
          }));
          
          setNodes(formattedNodes);
          setEdges(flow.edges || []);
          setFlowchartData(data.data);
          
          // Update flow description
          const description = generateFlowDescription(formattedNodes, flow.edges || []);
          setFlowDescription(description);

          // Restore viewport if available and rfInstance is ready
          if (rfInstance && flow.viewport) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            rfInstance.setViewport({ x, y, zoom });
          }
        }
      } catch (error) {
        console.error('Error loading flowchart:', error);
      }
    };

    loadFlowchart();
  }, [flowchartId, rfInstance]);

  // Update flow description when nodes or edges change
  useEffect(() => {
    const description = generateFlowDescription(nodes, edges);
    setFlowDescription(description);
  }, [nodes, edges]);

  // Auto-save changes
  const saveChanges = useCallback(async () => {
    if (!flowchartId || !user || !rfInstance) return;

    try {
      const flow = rfInstance.toObject();
      await updateFlowchartData(flowchartId, flow);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }, [flowchartId, user, rfInstance]);

  // Debounced auto-save
  useEffect(() => {
    if (!flowchartId || !user) return;
    const debounceTimeout = setTimeout(saveChanges, 1000);
    return () => clearTimeout(debounceTimeout);
  }, [nodes, edges, saveChanges]);

  return (
    <FlowchartContext.Provider 
      value={{ 
        nodes, 
        edges, 
        flowDescription,
        flowchartData,
        rfInstance,
        selectedNode,
        setNodes, 
        setEdges,
        setFlowDescription,
        setRfInstance,
        setSelectedNode
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