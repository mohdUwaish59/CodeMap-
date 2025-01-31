'use client';

import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { PenSquare } from 'lucide-react';

function CustomNode({ data, selected }: { data: { label: string; icon: React.ReactNode; type: string; description: string; width?: number; height?: number }; selected: boolean }) {
  const width = data.width || 150;
  const height = data.height || 80;
  const [resizing, setResizing] = useState(false);

  const handleResize = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    if (!resizing) return;

    const newWidth = Math.max(150, e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left);
    const newHeight = Math.max(80, e.clientY - (e.currentTarget as HTMLElement).getBoundingClientRect().top);

    data.width = newWidth;
    data.height = newHeight;
  };

  return (
    <div 
      className={`relative shadow-md rounded-md bg-white border border-border group
        ${data.type === 'decision' ? 'rotate-45' : ''}
      `}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        minWidth: '150px',
        minHeight: '80px'
      }}
      onMouseMove={(e) => handleResize(e, 'se')}
      onMouseUp={() => setResizing(false)}
    >
      <div className={`h-full flex flex-col p-4 ${data.type === 'decision' ? '-rotate-45' : ''}`}>
        <div className="flex items-center">
          <div className="mr-2">{data.icon}</div>
          <div className="text-sm font-medium flex-1">{data.label}</div>
          <div className="opacity-0 group-hover:opacity-100">
            <PenSquare className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        {data.description && (
          <div className="text-xs text-muted-foreground mt-1 flex-1 overflow-auto">
            {data.description}
          </div>
        )}
      </div>

      {/* Resize handle */}
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-primary"
          onMouseDown={(e) => {
            e.stopPropagation();
            setResizing(true);
          }}
        />
      )}

      {/* Handles on all sides */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-primary"
        style={{ top: '-4px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-primary"
        style={{ bottom: '-4px' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-primary"
        style={{ left: '-4px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-primary"
        style={{ right: '-4px' }}
      />
    </div>
  );
}

export default memo(CustomNode);