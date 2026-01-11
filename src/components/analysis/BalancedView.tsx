"use client";

import { useMemo } from 'react';
import { ArgumentCard } from './ArgumentCard';
import { buildTree } from '@/lib/utils';
import type { ArgumentNode, ArgumentTree } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BalancedViewProps {
  data: ArgumentNode[];
}

const NodeWithChildren = ({ node, level = 0 }: { node: ArgumentTree; level?: number }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative w-full">
      <ArgumentCard node={node} />
      {hasChildren && (
        <div className="relative mt-6 pl-6">
          <div
            className={cn(
              "absolute left-3 top-0 h-full w-1",
              node.side === 'for' ? 'bg-argument-for' : 'bg-argument-against'
            )}
            aria-hidden="true"
          />
          <div className="flex flex-col items-start gap-6">
            {node.children.map((child) => (
               <div key={child.id} className="relative w-full pl-6">
                 <div
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 h-1 w-6",
                      node.side === 'for' ? 'bg-argument-for' : 'bg-argument-against'
                    )}
                    aria-hidden="true"
                  />
                 <NodeWithChildren node={child} level={level + 1} />
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export function BalancedView({ data }: BalancedViewProps) {
  const tree = useMemo(() => buildTree(data), [data]);
  
  const thesisNode = tree.find(node => node.type === 'thesis');
  const forNodes = thesisNode ? thesisNode.children.filter(n => n.side === 'for') : tree.filter(n => n.side === 'for' && n.type !== 'thesis');
  const againstNodes = thesisNode ? thesisNode.children.filter(n => n.side === 'against') : tree.filter(n => n.side === 'against' && n.type !== 'thesis');

  return (
    <div className="mx-auto max-w-7xl space-y-12">
      {thesisNode && (
        <div className="mb-16">
          <h2 className="text-center font-headline text-sm font-bold uppercase tracking-widest text-muted-foreground">Thesis</h2>
          <div className="mx-auto mt-4 max-w-3xl">
             <ArgumentCard node={thesisNode} isRoot />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
        {/* For Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b-4 border-argument-for pb-4">
            <h3 className="font-headline text-3xl font-bold text-argument-for">Arguments For</h3>
          </div>
          <ScrollArea className="h-full">
            <div className="flex flex-col items-start gap-6 pr-4">
                {forNodes.length > 0 ? (
                    forNodes.map(node => <NodeWithChildren key={node.id} node={node} />)
                ) : (
                    <p className="text-muted-foreground">No supporting arguments found.</p>
                )}
            </div>
          </ScrollArea>
        </div>

        {/* Against Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b-4 border-argument-against pb-4">
            <h3 className="font-headline text-3xl font-bold text-argument-against">Arguments Against</h3>
          </div>
          <ScrollArea className="h-full">
            <div className="flex flex-col items-start gap-6 pr-4">
                {againstNodes.length > 0 ? (
                    againstNodes.map(node => <NodeWithChildren key={node.id} node={node} />)
                ) : (
                    <p className="text-muted-foreground">No opposing arguments found.</p>
                )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
