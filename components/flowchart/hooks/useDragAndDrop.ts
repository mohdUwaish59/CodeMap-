import { useState } from 'react';

export default function useDragAndDrop() {
  const [dragging, setDragging] = useState(false);

  const startDrag = () => setDragging(true);
  const stopDrag = () => setDragging(false);

  return { dragging, startDrag, stopDrag };
}
