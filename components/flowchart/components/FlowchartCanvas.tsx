'use client';

import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import Sidebar from './Sidebar';
import NodeEditor from './NodeEditor';
import JsonViewer from './JsonViewer';
import { useFlowchartContext } from '../context/FlowchartContext';

const nodeTypes = { custom: CustomNode };

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { strokeWidth: 2 },
};

function FlowchartCanvasContent() {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    setRfInstance,
    selectedNode,
    setSelectedNode 
  } = useFlowchartContext();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
    setSelectedNode(null);
  }, [setNodes, setSelectedNode]);

  return (
    <div className="w-full h-[calc(100vh-12rem)] flex">
      <Sidebar />
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodeClick={(_, node) => setSelectedNode(node)}
          fitView
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
      <JsonViewer />
    </div>
  );
}

export function FlowchartCanvas() {
  return (
    <ReactFlowProvider>
      <FlowchartCanvasContent />
    </ReactFlowProvider>
  );
}