import {
  Globe,
  Network,
  Boxes,
  Server,
  Scale,
  Code2,
  Cpu,
  Database,
  MessageSquare,
  HardDrive,
  Cloud,
  Lock,
  Users,
} from 'lucide-react';
import { ComponentCategory } from '../types/flowchart.types';
import { Node, Edge } from 'reactflow';

export const componentCategories: ComponentCategory[] = [
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

export const initialNodes: Node[] = [
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

export const initialEdges: Edge[] = [];

export const defaultEdgeOptions = {
  type: 'smoothstep',
  style: {
    strokeWidth: 2,
  },
};