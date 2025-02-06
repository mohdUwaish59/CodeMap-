'use client';

import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { Node, Edge } from 'reactflow';
import { nanoid } from 'nanoid';

export interface FlowchartData {
  id: string;
  name: string;
  nodes: string; // Store as JSON string
  edges: string; // Store as JSON string
  createdBy: string;
  sharedWith: string[];
  lastModified: number;
  isPublic: boolean;
}

export const saveFlowchart = async (
  userId: string, 
  name: string,
  nodes: Node[],
  edges: Edge[]
): Promise<string> => {
  const flowchartId = nanoid();
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  
  const flowchart: FlowchartData = {
    id: flowchartId,
    name,
    nodes: JSON.stringify(nodes),
    edges: JSON.stringify(edges),
    createdBy: userId,
    sharedWith: [],
    lastModified: Date.now(),
    isPublic: false
  };

  try {
    await setDoc(flowchartRef, flowchart);
    return flowchartId;
  } catch (error) {
    console.error('Error saving flowchart:', error);
    throw new Error('Failed to save flowchart');
  }
};

export const getFlowchart = async (flowchartId: string): Promise<{ 
  nodes: Node[]; 
  edges: Edge[]; 
  data: FlowchartData; 
} | null> => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  const snapshot = await getDoc(flowchartRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  const data = snapshot.data() as FlowchartData;
  
  try {
    return {
      nodes: JSON.parse(data.nodes) as Node[],
      edges: JSON.parse(data.edges) as Edge[],
      data
    };
  } catch (error) {
    console.error('Error parsing flowchart data:', error);
    return null;
  }
};

export const updateFlowchartData = async (
  flowchartId: string,
  nodes: Node[],
  edges: Edge[]
) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  try {
    await updateDoc(flowchartRef, {
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error updating flowchart:', error);
    throw new Error('Failed to update flowchart');
  }
};

export const shareFlowchart = async (flowchartId: string, userEmail: string) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  await updateDoc(flowchartRef, {
    sharedWith: arrayUnion(userEmail),
  });
};

export const removeSharedUser = async (flowchartId: string, userEmail: string) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  await updateDoc(flowchartRef, {
    sharedWith: arrayRemove(userEmail),
  });
};

export const subscribeToFlowchart = (
  flowchartId: string,
  callback: (nodes: Node[], edges: Edge[], data: FlowchartData) => void
) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  return onSnapshot(flowchartRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as FlowchartData;
      try {
        const nodes = JSON.parse(data.nodes) as Node[];
        const edges = JSON.parse(data.edges) as Edge[];
        callback(nodes, edges, data);
      } catch (error) {
        console.error('Error parsing flowchart data:', error);
      }
    }
  });
};

export const getUserFlowcharts = async (userId: string) => {
  const flowchartsRef = collection(db, 'flowcharts');
  const q = query(
    flowchartsRef, 
    where('createdBy', '==', userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data() as FlowchartData;
    try {
      return {
        ...data,
        nodes: JSON.parse(data.nodes),
        edges: JSON.parse(data.edges)
      };
    } catch (error) {
      console.error('Error parsing flowchart data:', error);
      return data;
    }
  });
};

export const getSharedFlowcharts = async (userEmail: string) => {
  const flowchartsRef = collection(db, 'flowcharts');
  const q = query(
    flowchartsRef, 
    where('sharedWith', 'array-contains', userEmail)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data() as FlowchartData;
    try {
      return {
        ...data,
        nodes: JSON.parse(data.nodes),
        edges: JSON.parse(data.edges)
      };
    } catch (error) {
      console.error('Error parsing flowchart data:', error);
      return data;
    }
  });
};