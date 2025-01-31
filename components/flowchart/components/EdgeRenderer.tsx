'use client';

import { memo } from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <BaseEdge id={id} path={edgePath} style={style} />
  );
}

export default memo(CustomEdge);
