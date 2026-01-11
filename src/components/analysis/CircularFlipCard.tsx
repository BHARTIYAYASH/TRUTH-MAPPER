"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ArgumentNode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExternalLink, BookOpen, ScrollText } from 'lucide-react';

interface CircularFlipCardProps {
    node: ArgumentNode;
    className?: string;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onDrag?: (event: any, info: any) => void;
    containerRef?: React.RefObject<HTMLDivElement>;
    x?: number;
    y?: number;
}

export function CircularFlipCard({
    node,
    className,
    onDrag,
    onDragStart,
    onDragEnd,
    containerRef,
    x,
    y
}: CircularFlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => {
        setIsDragging(true);
        onDragStart?.();
    };

    const handleDragEnd = () => {
        // Small delay to prevent click triggering immediately after drag
        setTimeout(() => setIsDragging(false), 100);
        onDragEnd?.();
    };

    const handleClick = () => {
        if (!isDragging) {
            setIsFlipped(!isFlipped);
        }
    };

    const borderColor = node.side === 'for' ? 'border-sky-500' : 'border-rose-500';
    const badgeColor = node.side === 'for' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700';
    const label = node.side === 'for' ? 'CLAIM' : 'COUNTERCLAIM';
    const sideLabel = node.side === 'for' ? 'For' : 'Against';

    return (
        <motion.div
            className={cn("absolute w-64 h-64 cursor-grab active:cursor-grabbing", className)}
            style={{
                x: x,
                y: y,
                perspective: 1000
            }}
            drag
            dragElastic={0}
            dragMomentum={false}
            onDrag={onDrag}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // Removed dragConstraints to allow full screen movement as requested
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <motion.div
                className={cn(
                    "w-full h-full relative rounded-full border-[3px] bg-background shadow-xl transition-all duration-300",
                    borderColor
                )}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={handleClick}
            >
                {/* FRONT FACE */}
                <div
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center backface-hidden rounded-full bg-background"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="flex items-center justify-between w-full px-4 mb-2 absolute top-8">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full select-none", badgeColor)}>
                            {sideLabel}
                        </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
                        <p className="text-sm font-medium leading-relaxed line-clamp-6 select-none">
                            {node.content}
                        </p>
                    </div>

                    <div className="absolute bottom-8 text-xs text-muted-foreground flex items-center gap-1 opacity-60">
                        <BookOpen className="h-3 w-3" />
                        <span>Click to flip</span>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 text-center backface-hidden rounded-full bg-muted/10"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                        <ScrollText className="h-4 w-4" />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Evidence</h4>
                    </div>

                    <div className="flex-1 flex items-center justify-center overflow-hidden w-full mb-2">
                        <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-6 select-none">
                            "{node.sourceText || "No specific evidence text cited."}"
                        </p>
                    </div>

                    {node.source && (
                        <a
                            href={node.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 truncate max-w-full px-4"
                            onClick={(e) => e.stopPropagation()} // Prevent flip when clicking link
                        >
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{new URL(node.source).hostname}</span>
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
