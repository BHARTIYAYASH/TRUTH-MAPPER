'use client';

import { useState } from 'react';
import { InputForm } from '@/components/home/InputForm';
import { AnalysisAndSocialLayout } from '@/components/analysis/AnalysisAndSocialLayout';
import { handleAnalysis } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { AnalysisResult } from '@/lib/types';

export function DashboardContent({ authToken }: { authToken: string | null }) {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const { toast } = useToast();

    const handleFormAction = async (formData: FormData) => {
        try {
            const result = await handleAnalysis(null, formData);
            if (result.error) {
                toast({
                    title: 'Analysis Failed',
                    description: result.error,
                    variant: 'destructive'
                });
            } else if (result.data) {
                setAnalysisResult(result.data);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'destructive'
            });
        }
    };

    if (analysisResult) {
        return <AnalysisAndSocialLayout analysisData={analysisResult} onReset={() => setAnalysisResult(null)} />;
    }

    return (
        <div className="container mx-auto max-w-4xl py-20 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-6 font-headline tracking-tight">
                    Uncover the Structure of <span className="border-b-4 border-primary">Any Argument</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Input a topic, URL, or document. Our AI will deconstruct it into a clear, interactive map of claims, counterclaims, and evidence.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <InputForm formAction={handleFormAction} authToken={authToken} />
            </div>
        </div>
    );
}
