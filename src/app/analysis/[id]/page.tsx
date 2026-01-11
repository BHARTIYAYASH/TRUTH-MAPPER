'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { getSavedAnalysis } from '@/lib/actions';
import { AnalysisAndSocialLayout } from '@/components/analysis/AnalysisAndSocialLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';

export default function SavedAnalysisPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const docId = params.id as string;

    useEffect(() => {
        if (!isUserLoading && !user) {
            router.push('/login');
            return;
        }

        if (user && docId) {
            loadAnalysis();
        }
    }, [user, isUserLoading, docId]);

    const loadAnalysis = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await user?.getIdToken();
            if (!token) {
                setError('Authentication required.');
                setIsLoading(false);
                return;
            }

            const result = await getSavedAnalysis(docId, token);

            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setAnalysisData(result.data);
            }
        } catch (e: any) {
            setError(e.message || 'Failed to load analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isUserLoading || isLoading) {
        return (
            <div className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-4">
                <LoadingSpinner className="h-10 w-10" />
                <p className="text-muted-foreground">Loading analysis...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-2">Error</h2>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button onClick={() => router.push('/history')} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to History
                    </Button>
                </div>
            </div>
        );
    }

    if (!analysisData) {
        return (
            <div className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-6">
                <p className="text-muted-foreground">No analysis data found.</p>
                <Button onClick={() => router.push('/history')} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to History
                </Button>
            </div>
        );
    }

    return (
        <AnalysisAndSocialLayout
            analysisData={analysisData}
            onReset={() => router.push('/history')}
        />
    );
}
