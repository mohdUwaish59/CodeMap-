'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { 
  Box, 
  ArrowRight, 
  Database, 
  Code2, 
  Settings2, 
  Download,
  Globe,
  Server,
  HardDrive,
  Network,
  Cpu,
  Lock,
  Users,
  MessageSquare,
  Boxes,
  Cloud,
  Scale
} from 'lucide-react';
import CustomNode from './CustomNode';
import NodeEditor from './NodeEditor';

const nodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#000',
  },
  style: {
    strokeWidth: 2,
  },
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Client',
      icon: <Globe className="w-5 h-5" />,
      type: 'client',
      description: 'Client application entry point',
      width: 150,
      height: 80,
    },
  },
];

const initialEdges: Edge[] = [];

const componentCategories = [
  {
    title: 'Frontend',
    components: [
      { type: 'Client', icon: Globe, description: 'Client application' },
      { type: 'CDN', icon: Network, description: 'Content Delivery Network' },
      { type: 'UI Component', icon: Boxes, description: 'User interface component' },
    ]
  },
  {
    title: 'Backend',
    components: [
      { type: 'API Gateway', icon: Server, description: 'API Gateway service' },
      { type: 'Load Balancer', icon: Scale, description: 'Load distribution service' },
      { type: 'Microservice', icon: Code2, description: 'Microservice component' },
      { type: 'Cache', icon: Cpu, description: 'Caching layer' },
    ]
  },
  {
    title: 'Data',
    components: [
      { type: 'Database', icon: Database, description: 'Data storage' },
      { type: 'Queue', icon: MessageSquare, description: 'Message queue' },
      { type: 'Storage', icon: HardDrive, description: 'File storage service' },
    ]
  },
  {
    title: 'Infrastructure',
    components: [
      { type: 'Cloud', icon: Cloud, description: 'Cloud service' },
      { type: 'Security', icon: Lock, description: 'Security component' },
      { type: 'Auth', icon: Users, description: 'Authentication service' },
    ]
  }
];

export default function FlowchartEditor() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowDescription, setFlowDescription] = useState<string>('');

  const generateFlowDescription = useCallback(() => {
    const description = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        description: node.data.description,
        position: node.position,
        dimensions: {
          width: node.data.width,
          height: node.data.height
        }
      })),
      connections: edges.map(edge => ({
        source: {
          id: edge.source,
          node: nodes.find(n => n.id === edge.source)?.data.label
        },
        target: {
          id: edge.target,
          node: nodes.find(n => n.id === edge.target)?.data.label
        },
        relationship: "flows_to"
      })),
      systemArchitecture: {
        frontend: nodes
          .filter(node => ['client', 'cdn', 'ui component'].includes(node.data.type))
          .map(node => ({
            component: node.data.label,
            description: node.data.description,
            connections: edges
              .filter(edge => edge.source === node.id || edge.target === node.id)
              .map(edge => ({
                type: edge.source === node.id ? 'outgoing' : 'incoming',
                component: nodes.find(n => n.id === (edge.source === node.id ? edge.target : edge.source))?.data.label
              }))
          })),
        backend: nodes
          .filter(node => ['api gateway', 'load balancer', 'microservice', 'cache'].includes(node.data.type))
          .map(node => ({
            service: node.data.label,
            description: node.data.description,
            dependencies: edges
              .filter(edge => edge.target === node.id)
              .map(edge => nodes.find(n => n.id === edge.source)?.data.label)
          })),
        data: nodes
          .filter(node => ['database', 'queue', 'storage'].includes(node.data.type))
          .map(node => ({
            store: node.data.label,
            description: node.data.description,
            accessedBy: edges
              .filter(edge => edge.target === node.id)
              .map(edge => nodes.find(n => n.id === edge.source)?.data.label)
          })),
        infrastructure: nodes
          .filter(node => ['cloud', 'security', 'auth'].includes(node.data.type))
          .map(node => ({
            component: node.data.label,
            description: node.data.description,
            interactions: edges
              .filter(edge => edge.source === node.id || edge.target === node.id)
              .map(edge => ({
                direction: edge.source === node.id ? 'provides' : 'consumes',
                component: nodes.find(n => n.id === (edge.source === node.id ? edge.target : edge.source))?.data.label
              }))
          }))
      }
    };
    
    return JSON.stringify(description, null, 2);
  }, [nodes, edges]);

  useEffect(() => {
    setFlowDescription(generateFlowDescription());
  }, [nodes, edges, generateFlowDescription]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: defaultEdgeOptions.markerEnd }, eds)),
    []
  );

  const addNode = (type: string, IconComponent: any, description: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'custom',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      data: {
        label: type,
        icon: <IconComponent className="w-5 h-5" />,
        type: type.toLowerCase(),
        description: description,
        width: 150,
        height: 80,
      },
    };
    setNodes([...nodes, newNode]);
  };

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    ));
    setSelectedNode(null);
  };

  const downloadJson = () => {
    const blob = new Blob([flowDescription], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-architecture.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">System Components</h2>
        <div className="space-y-6">
          {componentCategories.map((category) => (
            <div key={category.title} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {category.title}
              </h3>
              {category.components.map((component) => (
                <Button
                  key={component.type}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addNode(component.type, component.icon, component.description)}
                >
                  <component.icon className="mr-2 h-4 w-4" />
                  {component.type}
                </Button>
              ))}
            </div>
          ))}

          <div className="pt-4 border-t border-border mt-4">
            <Button
              variant="default"
              className="w-full justify-start"
              onClick={downloadJson}
            >
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Flow Editor */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onNodeClick={(_, node) => setSelectedNode(node)}
            fitView
            className="bg-background"
          >
            <Background />
            <Controls />
          </ReactFlow>

          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={updateNodeData}
            />
          )}
        </div>

        {/* JSON View */}
        <div className="w-96 border-l border-border bg-card p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Architecture JSON</h3>
            <Button variant="outline" size="sm" onClick={downloadJson}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <textarea
            value={flowDescription}
            readOnly
            className="flex-1 w-full p-4 font-mono text-sm bg-background border rounded-md"
            style={{ resize: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}