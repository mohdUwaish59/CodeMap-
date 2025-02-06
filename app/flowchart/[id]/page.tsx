'use client';

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginButton } from '@/components/auth/LoginButton';
import { FlowchartTabs } from '@/components/flowchart/components/FlowchartTabs';
import { getFlowchart } from '@/components/flowchart/services/flowchartService';
import { FlowchartProvider } from '@/components/flowchart/context/FlowchartContext';

export default function FlowchartPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [flowchartExists, setFlowchartExists] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log("User Debug:", user);
  console.log("Type of User:", typeof user);
  console.log("Error Debug:", error);
  console.log("Type of Error:", typeof error);
  console.log("Flowchart Exists:", flowchartExists);
  console.log("Type of Flowchart Exists:", typeof flowchartExists);

  useEffect(() => {
    if (!id || loading) return;

    const fetchFlowchart = async () => {
      try {
        const flowchart = await getFlowchart(id as string);
        if (!flowchart) {
          setError("Flowchart not found"); // ✅ Ensuring error is a string
          return;
        }
        setFlowchartExists(true);
      } catch (err) {
        console.error("Fetch error:", err);
        // ✅ Ensuring the error is always a string
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    };

    if (user) {
      fetchFlowchart();
    } else {
      setError("Please log in to view this flowchart.");
    }
  }, [id, user, loading]);

  // ✅ Prevent rendering until Firebase Auth is ready
  if (loading) {
    return (
      <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ✅ Convert error to a string before rendering
  if (error) {
    return (
      <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
        <p className="text-lg text-muted-foreground">{String(error)}</p> 
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[calc(100vh-9rem)] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Please sign in to view this flowchart</p>
        <LoginButton />
      </div>
    );
  }

  if (!flowchartExists) {
    return (
      <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Flowchart not found</p>
      </div>
    );
  }

  return (
    <FlowchartProvider flowchartId={id as string}>
      <FlowchartTabs flowchartId={id as string} />
    </FlowchartProvider>
  );
}
