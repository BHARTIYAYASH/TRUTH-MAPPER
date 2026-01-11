"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArgumentNode } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompassViewProps {
    data: ArgumentNode[];
}

// Predefined label slot positions for clean infographic layout
// Against (Left side): 3 slots positioned on left arc
// For (Right side): 3 slots positioned on right arc
const LABEL_SLOTS = {
    against: [
        { x: '5%', y: '75%', align: 'left' as const },   // Bottom-left
        { x: '5%', y: '45%', align: 'left' as const },   // Mid-left
        { x: '20%', y: '15%', align: 'left' as const },  // Top-left
    ],
    for: [
        { x: '95%', y: '75%', align: 'right' as const }, // Bottom-right
        { x: '95%', y: '45%', align: 'right' as const }, // Mid-right
        { x: '80%', y: '15%', align: 'right' as const }, // Top-right
    ],
};

export function CompassView({ data }: CompassViewProps) {

    // Find thesis node at component level
    const thesis = data.find(n => n.type === 'thesis');

    // Helper: Describe Arc Path
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = angleInDegrees * Math.PI / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    // Calculate Weights & Segments
    const { forSegments, againstSegments, forWeight, againstWeight, totalWeight } = useMemo(() => {
        let fWeight = 0;
        let aWeight = 0;

        interface Segment { id: string; weight: number; content: string; startDeg: number; endDeg: number; color: string }
        const fSegs: Segment[] = [];
        const aSegs: Segment[] = [];

        // Color palettes
        const againstColors = ['#dc2626', '#ea580c', '#d97706', '#b91c1c', '#c2410c'];
        const forColors = ['#16a34a', '#0d9488', '#0284c7', '#15803d', '#0f766e'];

        // Weight calculation helper
        const getWeight = (nodeId: string): number => {
            const node = data.find(n => n.id === nodeId);
            if (!node) return 0;
            let weight = 1;
            const children = data.filter(n => n.parentId === nodeId);
            children.forEach(child => {
                if (child.type === 'evidence') weight += 0.5;
                else weight += getWeight(child.id);
            });
            return weight;
        };

        // Thesis is now defined in the main component scope
        // const thesis = data.find(n => n.type === 'thesis'); // REMOVED from here

        // Process Against Nodes
        const againstNodes = thesis
            ? data.filter(n => n.parentId === thesis.id && n.side === 'against')
            : data.filter(n => n.side === 'against');

        const againstNodeWeights = againstNodes.map(n => ({ node: n, weight: getWeight(n.id) }));
        const totalAgainst = againstNodeWeights.reduce((sum, item) => sum + item.weight, 0);
        aWeight = totalAgainst;

        let currentAngle = 180;
        againstNodeWeights.forEach((item, index) => {
            const sweep = totalAgainst > 0 ? (item.weight / totalAgainst) * 90 : 0;
            aSegs.push({
                id: item.node.id,
                weight: item.weight,
                content: item.node.content,
                startDeg: currentAngle,
                endDeg: currentAngle + sweep,
                color: againstColors[index % againstColors.length]
            });
            currentAngle += sweep;
        });

        // Process For Nodes
        const forNodes = thesis
            ? data.filter(n => n.parentId === thesis.id && n.side === 'for')
            : data.filter(n => n.side === 'for');

        const forNodeWeights = forNodes.map(n => ({ node: n, weight: getWeight(n.id) }));
        const totalFor = forNodeWeights.reduce((sum, item) => sum + item.weight, 0);
        fWeight = totalFor;

        currentAngle = 270;
        forNodeWeights.forEach((item, index) => {
            const sweep = totalFor > 0 ? (item.weight / totalFor) * 90 : 0;
            fSegs.push({
                id: item.node.id,
                weight: item.weight,
                content: item.node.content,
                startDeg: currentAngle,
                endDeg: currentAngle + sweep,
                color: forColors[index % forColors.length]
            });
            currentAngle += sweep;
        });

        return {
            forSegments: fSegs,
            againstSegments: aSegs,
            forWeight: fWeight,
            againstWeight: aWeight,
            totalWeight: fWeight + aWeight
        };
    }, [data]);

    // Calculate Needle Angle
    const ratio = totalWeight === 0 ? 0.5 : forWeight / totalWeight;
    const targetAngle = (ratio - 0.5) * 180;

    // Chart parameters - Increased for better visibility
    const chartRadius = 75;

    return (
        <div className="flex h-full flex-col items-center justify-center p-4">
            <Card className="w-full max-w-5xl border-2 border-border bg-card shadow-lg">
                <CardHeader className="text-center pb-4 border-b">
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        Directional Pressure on Truth
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative p-8">

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-start min-h-[400px]">

                        {/* LEFT COLUMN - Against Labels */}
                        <div className="flex flex-col justify-between h-full space-y-6 py-4">
                            {againstSegments.slice(0, 4).map((seg, index) => (
                                <div key={seg.id} className="flex items-start gap-3">
                                    <div
                                        className="w-4 h-4 rounded-sm shrink-0 mt-1 border border-foreground/10"
                                        style={{ backgroundColor: seg.color }}
                                    />
                                    <div className="text-left max-w-[200px]">
                                        <p className="text-sm font-bold text-foreground leading-tight mb-1">
                                            Argument {index + 1}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {seg.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {againstSegments.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No arguments against</p>
                            )}
                        </div>

                        {/* CENTER - Chart & Thesis */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-[400px] h-[280px] mx-auto">
                                <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">

                                    {/* Against Segments (Left Arc) */}
                                    {againstSegments.map((seg) => (
                                        <path
                                            key={seg.id}
                                            d={describeArc(100, 100, chartRadius, seg.startDeg, seg.endDeg)}
                                            fill="none"
                                            stroke={seg.color}
                                            strokeWidth="20"
                                            strokeLinecap="butt"
                                            className="opacity-90"
                                        />
                                    ))}

                                    {/* For Segments (Right Arc) */}
                                    {forSegments.map((seg) => (
                                        <path
                                            key={seg.id}
                                            d={describeArc(100, 100, chartRadius, seg.startDeg, seg.endDeg)}
                                            fill="none"
                                            stroke={seg.color}
                                            strokeWidth="20"
                                            strokeLinecap="butt"
                                            className="opacity-90"
                                        />
                                    ))}

                                    {/* Center Base Circle */}
                                    <circle cx="100" cy="100" r="20" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />

                                    {/* Needle Container */}
                                    <g transform="translate(100, 100)">
                                        <motion.g
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: targetAngle }}
                                            transition={{ type: "spring", stiffness: 30, damping: 15, mass: 2 }}
                                            style={{ originX: 0, originY: 0 }}
                                        >
                                            {/* Needle */}
                                            <line x1="0" y1="0" x2="0" y2={-chartRadius + 5} stroke="currentColor" className="text-foreground" strokeWidth="3" strokeLinecap="round" />
                                            {/* Arrow Head */}
                                            <polygon points="-5,-35 5,-35 0,-45" fill="currentColor" className="text-foreground" />
                                        </motion.g>
                                        {/* Center Dot */}
                                        <circle cx="0" cy="0" r="8" fill="hsl(var(--background))" stroke="currentColor" className="text-foreground" strokeWidth="2" />
                                    </g>

                                </svg>

                                {/* Force Labels Below Chart */}
                                <div className="absolute -bottom-10 left-0 right-0 flex justify-between px-8">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-red-600">{againstSegments.length}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Against</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{forSegments.length}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">For</p>
                                    </div>
                                </div>
                            </div>

                            {/* Thesis Statement - Fixed overlap by making it a flex item below the chart */}
                            {thesis && (
                                <div className="mt-16 pt-6 border-t border-border/50 w-full max-w-[400px]">
                                    <p className="text-xs font-bold text-muted-foreground uppercase text-center mb-2 tracking-widest">Thesis</p>
                                    <p className="text-sm text-center font-medium leading-relaxed px-4 text-foreground/90">
                                        {thesis.content}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN - For Labels */}
                        <div className="flex flex-col justify-between h-full space-y-6 py-4">
                            {forSegments.slice(0, 4).map((seg, index) => (
                                <div key={seg.id} className="flex items-start gap-3 justify-end">
                                    <div className="text-right max-w-[200px]">
                                        <p className="text-sm font-bold text-foreground leading-tight mb-1">
                                            Argument {index + 1}
                                        </p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {seg.content}
                                        </p>
                                    </div>
                                    <div
                                        className="w-4 h-4 rounded-sm shrink-0 mt-1 border border-foreground/10"
                                        style={{ backgroundColor: seg.color }}
                                    />
                                </div>
                            ))}
                            {forSegments.length === 0 && (
                                <p className="text-xs text-muted-foreground italic text-right">No arguments for</p>
                            )}
                        </div>

                    </div>

                    {/* Footer Interpretation */}
                    <div className="mt-16 text-center">
                        <div className="inline-block px-6 py-3 rounded-lg bg-muted border border-border">
                            <p className="text-sm font-medium text-foreground">
                                {Math.abs(targetAngle) < 10
                                    ? "The evidence is balanced."
                                    : targetAngle > 0
                                        ? "Evidence leans towards the thesis."
                                        : "Evidence leans against the thesis."
                                }
                            </p>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
