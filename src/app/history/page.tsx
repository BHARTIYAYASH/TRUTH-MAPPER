'use client';

import { useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import type { ArgumentMapDocument } from '@/lib/types';
import { collection, query, orderBy } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye } from 'lucide-react';

function HistoryItem({ item }: { item: ArgumentMapDocument }) {
  const formattedDate = item.creationDate
    ? formatDistanceToNow(item.creationDate.toDate(), { addSuffix: true })
    : 'a while ago';

  return (
    <Card className="hover:shadow-[4px_4px_0px_hsl(var(--primary))] transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg truncate">{item.name}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/analysis/${item.id}`}>
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View Analysis
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}


export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const historyCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'argumentMaps');
  }, [firestore, user]);

  const historyQuery = useMemoFirebase(() => {
    if (!historyCollectionRef) return null;
    return query(historyCollectionRef, orderBy('creationDate', 'desc'));
  }, [historyCollectionRef]);

  const { data: history, isLoading: isHistoryLoading, error } = useCollection<ArgumentMapDocument>(historyQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const renderContent = () => {
    if (isHistoryLoading) {
      return (
        <div className="flex w-full items-center justify-center py-12">
          <LoadingSpinner className="h-8 w-8" />
        </div>
      );
    }
    if (error) {
      return <p className="text-destructive">Error loading history: {error.message}</p>
    }
    if (!history || history.length === 0) {
      return <p className="text-muted-foreground">You have no saved analyses yet. Start a new analysis to see your history here.</p>
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map(item => <HistoryItem key={item.id} item={item} />)}
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Analysis History</h1>
        <p className="text-muted-foreground mt-2">Review your past argument analyses.</p>
      </div>
      {renderContent()}
    </div>
  );
}
