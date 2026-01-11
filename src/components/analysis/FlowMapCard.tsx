"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ArgumentNode } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, ScrollText, Repeat2 } from 'lucide-react';

interface FlowMapCardProps {
    node: ArgumentNode;
    type?: 'reason' | 'objection' | 'evidence' | 'rebuttal';
    className?: string;
    flipped?: boolean;
}

const typeStyles = {
    reason: {
        border: 'border-l-4 border-l-emerald-500',
        bg: 'bg-emerald-50/50',
        badge: 'bg-emerald-100 text-emerald-800',
        label: 'Reason'
    },
    objection: {
        border: 'border-l-4 border-l-rose-500',
        bg: 'bg-rose-50/50',
        badge: 'bg-rose-100 text-rose-800',
        label: 'Objection'
    },
    rebuttal: {
        border: 'border-l-4 border-l-orange-500',
        bg: 'bg-orange-50/50',
        badge: 'bg-orange-100 text-orange-800',
        label: 'Rebuttal'
    },
    evidence: {
        border: 'border-l-4 border-l-blue-500',
        bg: 'bg-blue-50/50',
        badge: 'bg-blue-100 text-blue-800',
        label: 'Evidence'
    }
};

export function FlowMapCard({ node, type = 'reason', className }: FlowMapCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const styles = typeStyles[type];

    // Map node side to type if not explicitly provided
    const inferredType = type;
    // You might want logic here: e.g. if node.side === 'against' -> type = 'objection'

    const hostname = node.source ? new URL(node.source).hostname.replace('www.', '') : '';

    return (
        <div className={cn("group w-64 [perspective:1000px]", className)}>
            <motion.div
                className={cn(
                    "relative w-full transition-all duration-500 [transform-style:preserve-3d]",
                    "grid grid-cols-1 grid-rows-1" // Grid stack magic
                )}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* FRONT FACE */}
                <div
                    className={cn(
                        "col-start-1 row-start-1 h-full w-full [backface-visibility:hidden]",
                        "flex flex-col bg-card shadow-sm border border-slate-200 rounded-lg overflow-hidden",
                        "min-h-[160px]", // Minimum valid height
                        styles.border,
                        styles.bg
                    )}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="px-3 py-2 border-b border-slate-100/50 flex justify-between items-center bg-white/50">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", styles.badge)}>
                            {styles.label}
                        </span>
                        {node.sourceText && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground opacity-60 cursor-pointer hover:opacity-100">
                                <BookOpen className="h-3 w-3" />
                                <span>Signal</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex items-center justify-center flex-grow cursor-pointer">
                        <p className="text-sm font-medium text-slate-800 leading-relaxed text-center">
                            {node.content}
                        </p>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className={cn(
                        "col-start-1 row-start-1 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden]",
                        "flex flex-col bg-slate-800 text-slate-100 shadow-md rounded-lg overflow-hidden border border-slate-700",
                        "min-h-[160px]"
                    )}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className="px-3 py-2 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <ScrollText className="h-3 w-3" /> Evidence
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer hover:text-slate-300">
                            <Repeat2 className="h-3 w-3" />
                            <span>Return</span>
                        </div>
                    </div>
                    <div className="p-3 overflow-y-auto custom-scrollbar flex-grow cursor-pointer">
                        <p className="text-xs italic text-slate-300 leading-relaxed">
                            "{node.sourceText || "No direct evidence cited."}"
                        </p>
                    </div>
                    {node.source && (
                        <div className="p-2 bg-slate-900/80 border-t border-slate-700">
                            <a
                                href={node.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 hover:underline truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{hostname}</span>
                            </a>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
