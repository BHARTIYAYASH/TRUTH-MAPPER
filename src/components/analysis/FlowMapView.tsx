"use client";

import { useMemo } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { FlowMapCard } from './FlowMapCard';
import { Separator } from '@/components/ui/separator';

interface FlowMapViewProps {
    data: AnalysisResult;
}

export function FlowMapView({ data }: FlowMapViewProps) {
    const { blueprint } = data;

    const thesis = useMemo(() => blueprint.find(n => n.type === 'thesis'), [blueprint]);

    // Group 1: Arguments For (Reasons)
    const reasons = useMemo(() =>
        blueprint.filter(n => n.parentId === thesis?.id && n.side === 'for'),
        [blueprint, thesis]);

    // Group 2: Objections (Against)
    const objections = useMemo(() =>
        blueprint.filter(n => n.parentId === thesis?.id && n.side === 'against'),
        [blueprint, thesis]);

    // Helper to find evidence for a node
    const getEvidence = (parentId: string) =>
        blueprint.filter(n => n.parentId === parentId && n.type === 'evidence');

    return (
        <div className="mx-auto w-full min-h-[800px] flex flex-col items-center bg-slate-50/50 p-8 rounded-xl border border-slate-100 shadow-inner">

            {/* 1. TOP BAR: Argument / Contention */}
            <div className="w-full max-w-5xl mb-16 relative">
                <div className="bg-slate-900 text-slate-50 px-6 py-4 rounded-lg shadow-lg text-center relative z-10">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Central Contention</h2>
                    <p className="text-xl font-serif font-medium leading-normal">
                        {thesis?.content || "No Thesis Found"}
                    </p>
                </div>
                {/* Main Stem Line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full h-16 w-1 bg-slate-300"></div>
            </div>

            {/* 2. MIDDLE REASONING LANES */}
            <div className="flex w-full max-w-7xl justify-center gap-12 relative">
                {/* Horizontal Distribution Line */}
                <div className="absolute top-0 left-12 right-12 h-1 bg-slate-300 -translate-y-[1px]"></div>

                {/* Lane 1: Supporting Reasons (Left) */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="h-8 w-1 bg-slate-300"></div> {/* Stem from distro line */}

                    <div className="mb-4 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        Supporting Reasons
                    </div>

                    <div className="space-y-12 w-full flex flex-col items-center">
                        {reasons.length === 0 && <p className="text-slate-400 italic">No supporting reasons found.</p>}
                        {reasons.map(reason => (
                            <div key={reason.id} className="relative flex flex-col items-center">
                                <FlowMapCard node={reason} type="reason" />

                                {/* Connection to Evidence */}
                                {getEvidence(reason.id).length > 0 && (
                                    <div className="h-8 w-1 bg-slate-300"></div>
                                )}

                                {/* Evidence Nodes */}
                                <div className="flex flex-col gap-4">
                                    {getEvidence(reason.id).map(ev => (
                                        <FlowMapCard key={ev.id} node={ev} type="evidence" className="w-60" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lane 2: Objections & Rebuttals (Right) */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="h-8 w-1 bg-slate-300"></div> {/* Stem from distro line */}

                    <div className="mb-4 bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        Objections & Rebuttals
                    </div>

                    <div className="space-y-12 w-full flex flex-col items-center">
                        {objections.length === 0 && <p className="text-slate-400 italic">No objections found.</p>}
                        {objections.map(obj => (
                            <div key={obj.id} className="relative flex flex-col items-center">
                                <FlowMapCard node={obj} type="objection" />

                                {/* Connection to Evidence/Rebuttal */}
                                {getEvidence(obj.id).length > 0 && (
                                    <div className="h-8 w-1 bg-slate-300"></div>
                                )}

                                {/* Evidence Nodes (acting as rebuttals potentially) */}
                                <div className="flex flex-col gap-4">
                                    {getEvidence(obj.id).map(ev => (
                                        <FlowMapCard key={ev.id} node={ev} type="rebuttal" className="w-60" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 3. BOTTOM BAR: Conclusion */}
            <div className="w-full max-w-4xl mt-24 relative">
                {/* Converging Lines */}
                <div className="absolute -top-12 left-1/4 h-12 w-1 bg-slate-300/50"></div>
                <div className="absolute -top-12 right-1/4 h-12 w-1 bg-slate-300/50"></div>

                <div className="bg-slate-100 text-slate-600 px-8 py-6 rounded-xl border border-slate-200 text-center">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Conclusion</h3>
                    <p className="text-lg leading-relaxed text-slate-800">
                        {data.summary}
                    </p>
                </div>
            </div>
        </div>
    );
}
