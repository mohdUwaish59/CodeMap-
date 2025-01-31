'use client';

import { Button } from '@/components/ui/button';
import { Globe, Network, Boxes, Server, Scale, Code2, Cpu, Database, MessageSquare, HardDrive, Cloud, Lock, Users } from 'lucide-react';
import { ComponentCategory } from '../types/flowchart.types';
import { componentCategories } from '../constants/constants'
import { Node } from 'reactflow';

interface SidebarProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
}

export default function Sidebar({ nodes, setNodes }: SidebarProps) {
  

  const addNode = (type: string, IconComponent: any, description: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type: 'custom',
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: {
        label: type,
        icon: <IconComponent className="w-5 h-5" />,
        type: type.toLowerCase(),
        description,
        width: 150,
        height: 80,
      }
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="w-64 bg-card p-4">
      <h2 className="text-lg font-semibold mb-4">System Components</h2>
      {componentCategories.map(({ title, components }) => (
        <div key={title} className="mb-4">
          <h3 className="text-sm font-medium">{title}</h3>
          {components.map(({ type, icon: IconComponent, description }) => (
            <Button
              key={type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => addNode(type, IconComponent, description)}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {type}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}