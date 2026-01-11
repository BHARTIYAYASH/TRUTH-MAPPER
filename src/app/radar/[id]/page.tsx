'use client';

import React, { useState } from 'react';
import { RADAR_TOPICS } from '@/lib/radar-data';
import { notFound } from 'next/navigation';
import { AnalysisAndSocialLayout } from '@/components/analysis/AnalysisAndSocialLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map } from 'lucide-react';

interface RadarDetailProps {
    params: Promise<{ id: string }>;
}

export default function RadarDetailPage({ params }: RadarDetailProps) {
    const { id } = React.use(params);
    const topic = RADAR_TOPICS.find(t => t.id === id);

    if (!topic) {
        notFound();
    }

    const handleReset = () => {
        // For Radar topics, reset just goes back to the list
        window.location.href = '/radar';
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Nav Bar */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border p-4">
                <div className="container mx-auto max-w-7xl flex items-center justify-between">
                    <Link href="/radar" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Narrative Radar
                    </Link>
                    <div className="font-bold text-lg hidden md:block">
                        {topic.title}
                    </div>
                    <Button asChild size="sm" className="gap-2">
                        <Link href="/">
                            <Map className="h-4 w-4" />
                            Map Your Own Topic
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Analysis & Social Layout - Handles the sidebar */}
            <div className="flex-grow overflow-hidden">
                <AnalysisAndSocialLayout
                    analysisData={topic.data}
                    onReset={handleReset}
                />
            </div>
        </div>
    );
}
