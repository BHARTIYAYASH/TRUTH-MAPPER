"use client";

import { useMemo } from 'react';
import { ArgumentCard } from './ArgumentCard';
import { buildTree } from '@/lib/utils';
import type { ArgumentNode, ArgumentTree } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PillarViewProps {
  data: ArgumentNode[];
}

const PillarColumn = ({ title, nodes, side }: { title: string; nodes: ArgumentTree[]; side: 'for' | 'against' }) => {
    return (
        <div className="space-y-6">
            <div className={`flex items-center gap-3 border-b-2 pb-4 border-${side === 'for' ? 'argument-for' : 'argument-against'}`}>
                <span className={`flex h-3 w-3 rounded-full bg-${side === 'for' ? 'argument-for' : 'argument-against'}`} />
                <h3 className={`font-headline text-2xl font-semibold text-${side === 'for' ? 'argument-for' : 'argument-against'}`}>{title}</h3>
            </div>
            <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="flex flex-col gap-4 pr-4">
                    {nodes.length > 0 ? (
                        nodes.map(node => (
                            <ArgumentCard key={node.id} node={node} />
                        ))
                    ) : (
                        <p className="text-muted-foreground">No {title.toLowerCase()} found.</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

export function PillarView({ data }: PillarViewProps) {
  const tree = useMemo(() => buildTree(data), [data]);
  
  const thesisNode = tree.find(node => node.type === 'thesis');
  const forClaims = data.filter(node => node.type === 'claim' && node.side === 'for');
  const againstClaims = data.filter(node => node.type === 'claim' && node.side === 'against');
  const forEvidence = data.filter(node => node.type === 'evidence' && node.side === 'for');
  const againstEvidence = data.filter(node => node.type === 'evidence' && node.side === 'against');


  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {thesisNode && (
        <div className="mb-12">
          <h2 className="text-center font-headline text-3xl font-semibold">Thesis</h2>
          <div className="mx-auto mt-4 max-w-3xl">
             <ArgumentCard node={thesisNode} isRoot />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
        <PillarColumn title="Claims For" nodes={forClaims as ArgumentTree[]} side="for" />
        <PillarColumn title="Claims Against" nodes={againstClaims as ArgumentTree[]} side="against" />
        <PillarColumn title="Evidence For" nodes={forEvidence as ArgumentTree[]} side="for" />
        <PillarColumn title="Evidence Against" nodes={againstEvidence as ArgumentTree[]} side="against" />
      </div>
    </div>
  );
}
