"use client";

import { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArgumentCard } from './ArgumentCard';
import type { AnalysisResult, ArgumentNode } from '@/lib/types';
import { CircularFlipCard } from './CircularFlipCard';

interface CircularViewProps {
  data: AnalysisResult;
}

interface NodePosition {
  x: number;
  y: number;
}

export function CircularView({ data }: CircularViewProps) {
  const { blueprint, summary, analysis } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 800 });

  const thesisNode = useMemo(() => blueprint.find(node => node.type === 'thesis'), [blueprint]);
  const claims = useMemo(() => blueprint.filter(n => n.type === 'claim' || n.type === 'counterclaim'), [blueprint]);

  // State to track positions of all nodes. 
  // Key = node.id (or 'thesis'), Value = {x, y} relative to container center
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});

  // Initialize positions on mount
  useEffect(() => {
    const radius = 300;
    const center = { x: 0, y: 0 }; // We treat 0,0 as center of container for calculations

    // Thesis starts at center
    const newPositions: Record<string, NodePosition> = {
      'thesis': { x: 0, y: 0 }
    };

    // Distribute claims in a circle
    claims.forEach((node, index) => {
      const angle = (index / claims.length) * 2 * Math.PI; // - Math.PI / 2 to start top?
      newPositions[node.id] = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });

    setNodePositions(newPositions);
  }, [claims]);


  const handleDrag = (id: string, info: any) => {
    // We update state to trigger re-render of lines. 
    // For smoother performance with many nodes, we could use useMotionValue but React state is fine for <20 nodes.
    setNodePositions(prev => ({
      ...prev,
      [id]: {
        x: prev[id].x + info.delta.x,
        y: prev[id].y + info.delta.y
      }
    }));
  };

  // Center of the container (assuming 800x800 for drawing context)
  const CENTER_OFFSET = 400;

  return (
    <div
      className="w-full min-h-[850px] flex flex-col items-center justify-start p-12 relative overflow-hidden bg-background"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Main Visualization Canvas */}
      <div
        ref={containerRef}
        className="relative w-[800px] h-[800px] flex items-center justify-center"
      >

        {/* Dynamic Connection Lines Layer */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
          {/* Outer Ring guide (optional, maybe fade it out or remove since it's interactive now) */}
          <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="8 8" />

          {claims.map((node) => {
            const thesisPos = nodePositions['thesis'] || { x: 0, y: 0 };
            const claimPos = nodePositions[node.id] || { x: 0, y: 0 };

            return (
              <line
                key={`line-${node.id}`}
                x1={CENTER_OFFSET + thesisPos.x}
                y1={CENTER_OFFSET + thesisPos.y}
                x2={CENTER_OFFSET + claimPos.x}
                y2={CENTER_OFFSET + claimPos.y}
                stroke={node.side === 'for' ? '#0ea5e9' : '#f43f5e'} // sky-500 / rose-500
                strokeWidth="2"
                strokeDasharray="5 5"
                opacity="0.6"
              />
            )
          })}
        </svg>

        {/* Thesis Node (Rectangular) */}
        {thesisNode && (
          <motion.div
            className="absolute z-20 w-80 h-auto cursor-grab active:cursor-grabbing"
            drag
            dragElastic={0}
            dragMomentum={false}
            // Sync drag delta to state
            onDrag={(e, info) => handleDrag('thesis', info)}
            // Use x/y from checks to keep in sync if re-rendered
            style={{ x: nodePositions['thesis']?.x || 0, y: nodePositions['thesis']?.y || 0 }}
          >
            <ArgumentCard node={thesisNode} isRoot className="shadow-2xl border-primary border-4" />
          </motion.div>
        )}

        {/* Claim Nodes (Circular Flip Cards) */}
        {claims.map((node) => {
          const pos = nodePositions[node.id] || { x: 0, y: 0 };
          return (
            <CircularFlipCard
              key={node.id}
              node={node}
              x={pos.x}
              y={pos.y}
              onDrag={(e, info) => handleDrag(node.id, info)}
              containerRef={containerRef}
            />
          );
        })}
      </div>
    </div>
  );
}
