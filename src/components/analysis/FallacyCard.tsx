'use client';

import React, { useState } from 'react';
import { DetectedFallacy } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen, ShieldCheck, Quote, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FallacyCardProps {
    fallacy: DetectedFallacy;
}

export function FallacyCard({ fallacy }: FallacyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const severityColors = {
        'Critical': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        'Major': 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
        'Minor': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    };

    return (
        <Card className="border border-border shadow-sm overflow-hidden bg-white dark:bg-card">
            <div
                className="p-4 flex items-start justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={cn("rounded-sm border font-semibold px-2 py-0.5", severityColors[fallacy.severity])}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {fallacy.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                            {fallacy.category}
                        </Badge>
                    </div>
                    <h4 className="font-bold text-lg text-foreground mb-1">
                        {fallacy.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        {fallacy.definition.split('.')[0]}. {/* Brief definition preview */}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {fallacy.location && (
                            <span className="flex items-center gap-1">
                                📍 {fallacy.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            🎯 Confidence: {Math.round(fallacy.confidence * 100)}%
                        </span>
                    </div>
                </div>
                <div className="pt-2">
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 border-t border-border/50 bg-slate-50/50 dark:bg-muted/10 space-y-6 pt-4">

                            {/* Problematic Text & Why */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <Quote className="h-3 w-3" /> Problematic Text
                                    </h5>
                                    <div className="p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md text-sm italic text-foreground/90 font-serif">
                                        "{fallacy.problematicText}"
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-2">
                                        <Info className="h-3 w-3" /> Why This Is Problematic
                                    </h5>
                                    <div className="p-3 bg-white dark:bg-card border border-border rounded-md text-sm text-muted-foreground leading-relaxed">
                                        {fallacy.explanation}
                                    </div>
                                </div>
                            </div>

                            {/* Definition & Avoidance */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                        <BookOpen className="h-3 w-3" /> Definition
                                    </h5>
                                    <div className="p-3 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-md text-sm text-foreground/80">
                                        {fallacy.definition}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-2">
                                        <ShieldCheck className="h-3 w-3" /> How to Avoid
                                    </h5>
                                    <div className="p-3 bg-green-50/30 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-md text-sm text-foreground/80">
                                        {fallacy.avoidance}
                                    </div>
                                </div>
                            </div>

                            {/* Suggested Improvement */}
                            <div className="space-y-2">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-2">
                                    ✨ Suggested Improvement
                                </h5>
                                <div className="p-3 bg-teal-50/30 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-md text-sm text-foreground/90">
                                    {fallacy.suggestion}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
