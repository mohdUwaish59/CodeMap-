'use client';

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginButton } from '@/components/auth/LoginButton';
import { FlowchartTabs } from '@/components/flowchart/components/FlowchartTabs';
import { getFlowchart } from '@/components/flowchart/services/flowchartService';
import { FlowchartProvider } from '@/components/flowchart/context/FlowchartContext';

type FlowchartPageState = {
  flowchartExists: boolean;
  error: string | null;
  isLoading: boolean;
};

export default function FlowchartPage() {
  const params = useParams();
  // Debug: Log the params object
  console.log('Raw params:', params);
  console.log('Stringified params:', JSON.stringify(params));
  
  // Convert params.id to string explicitly
  const flowchartId = params?.id ? String(params.id) : '';
  console.log('Extracted flowchartId:', flowchartId);
  
  const { user, loading: authLoading } = useAuth();
  
  const [state, setState] = useState<FlowchartPageState>({
    flowchartExists: false,
    error: null,
    isLoading: false
  });

  const { flowchartExists, error, isLoading } = state;

  useEffect(() => {
    if (!flowchartId || authLoading) return;

    const fetchFlowchart = async () => {
      if (!user) {
        setState(prev => ({ ...prev, error: "Please log in to view this flowchart." }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true }));

      try {
        const flowchart = await getFlowchart(flowchartId);
        
        if (!flowchart) {
          setState(prev => ({
            ...prev,
            error: "Flowchart not found",
            isLoading: false
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          flowchartExists: true,
          isLoading: false
        }));
      } catch (err) {
        console.error("Fetch error:", err);
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : "An unknown error occurred.",
          isLoading: false
        }));
      }
    };

    fetchFlowchart();
  }, [flowchartId, user, authLoading]);

  // Debug: log the values that will be passed to child components
  console.log('Values passed to children:', {
    flowchartId,
    flowchartExists,
    error,
    isLoading
  });

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={String(error)} />;
  }

  if (!user) {
    return <LoginPrompt />;
  }

  if (!flowchartExists) {
    return <NotFoundMessage />;
  }

  return (
    <FlowchartProvider flowchartId={flowchartId}>
      <FlowchartTabs flowchartId={flowchartId} />
    </FlowchartProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
      <p className="text-lg text-muted-foreground">{message}</p>
      <div className="pl-4">
        <LoginButton />
      </div>
    </div>
  );
}

function LoginPrompt() {
  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col items-center justify-center gap-4">
      <p className="text-lg text-muted-foreground">Please sign in to view this flowchart</p>
      <LoginButton />
    </div>
  );
}

function NotFoundMessage() {
  return (
    <div className="h-[calc(100vh-9rem)] flex items-center justify-center">
      <p className="text-lg text-muted-foreground">Flowchart not found</p>
    </div>
  );
}