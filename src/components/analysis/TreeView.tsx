"use client";

import { useMemo } from 'react';
import { ArgumentCard } from './ArgumentCard';
import { buildTree } from '@/lib/utils';
import type { ArgumentNode, ArgumentTree } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TreeViewProps {
  data: ArgumentNode[];
}

const TreeNode = ({ node }: { node: ArgumentTree }) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="relative flex flex-col items-center">
      <ArgumentCard node={node} isRoot={!node.parentId} />
      {hasChildren && (
        <>
          <div className="mt-4 h-8 w-px bg-border" />
          <div className="flex w-full justify-around gap-4">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="absolute -top-8 h-px w-full bg-border" />
                {index > 0 && <div className="absolute -left-full -top-8 h-px w-full bg-border" />}
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


import { MoveHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TreeView({ data }: TreeViewProps) {
  const tree = useMemo(() => buildTree(data), [data]);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Find the scroll container (parent of this component)
    const scrollContainer = document.querySelector('#analysis-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      if (!hasScrolled && scrollContainer.scrollLeft > 20) {
        setHasScrolled(true);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  return (
    <div className="px-8 py-12 relative w-fit min-w-full mx-auto">
      {tree.map(rootNode => (
        <div key={rootNode.id} className="relative flex flex-col items-center">
          <ArgumentCard node={rootNode} />

          {/* Scroll Indicator - Between Thesis and Children */}
          {!hasScrolled && rootNode.children && rootNode.children.length > 0 && (
            <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 z-20 animate-pulse pointer-events-none">
              <MoveHorizontal className="h-12 w-12 text-foreground/80" strokeWidth={1.5} />
            </div>
          )}

          {rootNode.children && rootNode.children.length > 0 && (
            <>
              <div className="mt-8 h-8 w-px bg-border" /> {/* Increased top margin to fit arrow */}
              <div className="flex w-full justify-around gap-4">
                {rootNode.children.map((child, index) => (
                  <div key={child.id} className="relative flex flex-col items-center">
                    <div className="absolute -top-8 h-px w-full bg-border" />
                    {index > 0 && <div className="absolute -left-full -top-8 h-px w-full bg-border" />}
                    <TreeNode node={child} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
