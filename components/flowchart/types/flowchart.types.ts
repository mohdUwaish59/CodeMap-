import { Node, Edge } from 'reactflow';
import { DivideIcon as LucideIcon } from 'lucide-react';

export interface ComponentConfig {
  type: string;
  icon: LucideIcon;
  description: string;
}

export interface ComponentCategory {
  title: string;
  components: ComponentConfig[];
}

export interface FlowDescription {
  nodes: {
    id: string;
    type: string;
    label: string;
    description: string;
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
  }[];
  connections: {
    source: {
      id: string;
      node: string | undefined;
    };
    target: {
      id: string;
      node: string | undefined;
    };
    relationship: string;
  }[];
  systemArchitecture: {
    flowchart: any[];
    frontend: any[];
    backend: any[];
    data: any[];
    infrastructure: any[];
  };
}

export interface NodeData {
  label: string;
  icon: React.ReactNode;
  type: string;
  description: string;
  width?: number;
  height?: number;
}

export interface CustomNodeProps {
  data: NodeData;
  selected: boolean;
}

export interface NodeEditorProps {
  node: Node;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

export interface JsonViewerProps {
  flowDescription: string;
}