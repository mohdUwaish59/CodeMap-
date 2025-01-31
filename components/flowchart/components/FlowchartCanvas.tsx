'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import Sidebar from './Sidebar';
import NodeEditor from './NodeEditor';
import JsonViewer from './JsonViewer';
import { generateFlowDescription } from '../utils/flowchartUtils';
import { useFlowchartContext } from '../context/FlowchartContext';

const nodeTypes = { custom: CustomNode };

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: '#000',
  },
  style: { strokeWidth: 2 },
};

export function FlowchartCanvas() {
  const { nodes, edges, setNodes, setEdges, setFlowDescription } = useFlowchartContext();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    const description = generateFlowDescription(nodes, edges);
    setFlowDescription(description);
  }, [nodes, edges, setFlowDescription]);

  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    params => setEdges(eds => addEdge({ ...params, ...defaultEdgeOptions }, eds)),
    [setEdges]
  );

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes(nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    ));
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen flex">
      <Sidebar nodes={nodes} setNodes={setNodes} />
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodeClick={(_, node) => setSelectedNode(node)}
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
      <JsonViewer flowDescription={generateFlowDescription(nodes, edges)} />
    </div>
  );
}