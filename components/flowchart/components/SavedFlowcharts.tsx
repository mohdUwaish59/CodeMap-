'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserFlowcharts, getSharedFlowcharts, FlowchartData } from '../services/flowchartService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Share2, Pencil } from 'lucide-react';
import Link from 'next/link';

export function SavedFlowcharts() {
  const { user } = useAuth();
  const [myFlowcharts, setMyFlowcharts] = useState<FlowchartData[]>([]);
  const [sharedFlowcharts, setSharedFlowcharts] = useState<FlowchartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlowcharts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [owned, shared] = await Promise.all([
          getUserFlowcharts(user.uid),
          getSharedFlowcharts(user.email!)
        ]);

        setMyFlowcharts(owned);
        setSharedFlowcharts(shared);
      } catch (error) {
        console.error('Error loading flowcharts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFlowcharts();
  }, [user]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Please sign in to view your flowcharts</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const FlowchartList = ({ flowcharts }: { flowcharts: FlowchartData[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {flowcharts.map((flowchart) => (
        <Card key={flowchart.id} className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{flowchart.name}</h3>
              <p className="text-sm text-muted-foreground">
                Last modified {formatDistanceToNow(flowchart.lastModified, { addSuffix: true })}
              </p>
            </div>
            <div className="flex gap-2">
              {flowchart.sharedWith.length > 0 && (
                <div className="text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
          <Link href={`/flowchart/${flowchart.id}`} passHref>
            <Button className="w-full gap-2">
              <Pencil className="h-4 w-4" />
              Open
            </Button>
          </Link>
        </Card>
      ))}
      {flowcharts.length === 0 && (
        <p className="text-muted-foreground col-span-full text-center py-8">
          No flowcharts found
        </p>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="my-flowcharts" className="w-full">
      <div className="border-b px-4">
        <TabsList>
          <TabsTrigger value="my-flowcharts">My Flowcharts</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="my-flowcharts">
        <FlowchartList flowcharts={myFlowcharts} />
      </TabsContent>
      
      <TabsContent value="shared">
        <FlowchartList flowcharts={sharedFlowcharts} />
      </TabsContent>
    </Tabs>
  );
}