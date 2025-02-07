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
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { Node, Edge } from 'reactflow';
import { nanoid } from 'nanoid';

export interface FlowchartData {
  id: string;
  name: string;
  flow: {
    nodes: Node[];
    edges: Edge[];
    viewport?: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  createdBy: string;
  sharedWith: string[];
  lastModified: number;
  isPublic: boolean;
}

export const saveFlowchart = async (
  userId: string, 
  name: string,
  flow: any
): Promise<string> => {
  const flowchartId = nanoid();
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  
  // Clean up node data before saving
  const cleanNodes = flow.nodes.map((node: Node) => ({
    ...node,
    data: {
      ...node.data,
      icon: null // Remove icon React element before saving
    }
  }));
  
  const flowchart: FlowchartData = {
    id: flowchartId,
    name,
    flow: {
      nodes: cleanNodes,
      edges: flow.edges || [],
      viewport: flow.viewport
    },
    createdBy: userId,
    sharedWith: [],
    lastModified: Date.now(),
    isPublic: false
  };

  try {
    const sanitizedFlowchart = JSON.parse(JSON.stringify(flowchart));
    await setDoc(flowchartRef, sanitizedFlowchart);
    return flowchartId;
  } catch (error) {
    console.error('Error saving flowchart:', error);
    throw new Error('Failed to save flowchart');
  }
};

export const getFlowchart = async (flowchartId: string): Promise<{ data: FlowchartData } | null> => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  
  try {
    const snapshot = await getDoc(flowchartRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const data = snapshot.data() as FlowchartData;
    return { data };
  } catch (error) {
    console.error('Error getting flowchart:', error);
    throw new Error('Failed to get flowchart');
  }
};

export const updateFlowchartData = async (flowchartId: string, flow: any) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  
  // Clean up node data before saving
  const cleanNodes = flow.nodes.map((node: Node) => ({
    ...node,
    data: {
      ...node.data,
      icon: null // Remove icon React element before saving
    }
  }));
  
  try {
    const sanitizedFlow = JSON.parse(JSON.stringify({
      nodes: cleanNodes,
      edges: flow.edges || [],
      viewport: flow.viewport
    }));
    
    await updateDoc(flowchartRef, {
      flow: sanitizedFlow,
      lastModified: Date.now()
    });
  } catch (error) {
    console.error('Error updating flowchart:', error);
    throw new Error('Failed to update flowchart');
  }
};

export const shareFlowchart = async (flowchartId: string, userEmail: string) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  await updateDoc(flowchartRef, {
    sharedWith: arrayUnion(userEmail)
  });
};

export const removeSharedUser = async (flowchartId: string, userEmail: string) => {
  const flowchartRef = doc(db, 'flowcharts', flowchartId);
  await updateDoc(flowchartRef, {
    sharedWith: arrayRemove(userEmail)
  });
};

export const getUserFlowcharts = async (userId: string) => {
  const flowchartsRef = collection(db, 'flowcharts');
  const q = query(
    flowchartsRef, 
    where('createdBy', '==', userId)
  );
  
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FlowchartData);
  } catch (error) {
    console.error('Error getting user flowcharts:', error);
    throw new Error('Failed to get user flowcharts');
  }
};

export const getSharedFlowcharts = async (userEmail: string) => {
  const flowchartsRef = collection(db, 'flowcharts');
  const q = query(
    flowchartsRef, 
    where('sharedWith', 'array-contains', userEmail)
  );
  
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as FlowchartData);
  } catch (error) {
    console.error('Error getting shared flowcharts:', error);
    throw new Error('Failed to get shared flowcharts');
  }
};