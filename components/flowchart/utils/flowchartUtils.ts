import { Node, Edge } from 'reactflow';

export function generateFlowDescription(nodes: Node[], edges: Edge[]) {
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
}