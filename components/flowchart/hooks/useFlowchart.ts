import { useState, useCallback } from 'react';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, addEdge, Connection } from 'reactflow';

export default function useFlowchart(initialNodes = [], initialEdges = []) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    []
  );

  return { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChang
