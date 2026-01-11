"use client";

import { useState, useRef } from 'react';
import { AnalysisToolbar } from './AnalysisToolbar';
import { BalancedView } from './BalancedView';
import type { AnalysisResult } from '@/lib/types';
import { TreeView } from './TreeView';
import { PillarView } from './PillarView';
import { CircularView } from './CircularView';
import { FlowMapView } from './FlowMapView';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CompassView } from './CompassView';

type VisualizationMode = 'balanced' | 'tree' | 'pillar' | 'circular' | 'flowchart' | 'compass';

interface AnalysisViewProps {
  analysisData: AnalysisResult;
  onReset: () => void;
  isSocialOpen: boolean;
  onSocialToggle: () => void;
}

export function AnalysisView({ analysisData, onReset, isSocialOpen, onSocialToggle }: AnalysisViewProps) {
  const [viewMode, setViewMode] = useState<VisualizationMode>('balanced');
  const exportRef = useRef<HTMLDivElement>(null);

  const renderView = () => {
    switch (viewMode) {
      case 'balanced':
        return <BalancedView data={analysisData.blueprint} />;
      case 'tree':
        return <TreeView data={analysisData.blueprint} />;
      case 'pillar':
        return <PillarView data={analysisData.blueprint} />;
      case 'circular':
        return <CircularView data={analysisData} />;
      case 'flowchart':
        return <FlowMapView data={analysisData} />;
      case 'compass':
        return <CompassView data={analysisData.blueprint} />;
      default:
        return (
          <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">Select a view mode.</p>
          </div>
        );
    }
  }

  return (
    <div className="grid h-full grid-rows-[auto,1fr]">
      <AnalysisToolbar
        currentView={viewMode}
        onViewChange={setViewMode}
        jsonData={analysisData.blueprint}
        onReset={onReset}
        exportRef={exportRef}
        isSocialOpen={isSocialOpen}
        onSocialToggle={onSocialToggle}
      />
      <ScrollArea className="flex-grow">
        <div ref={exportRef} className="bg-background p-4 md:p-8 export-container">
          {renderView()}
        </div>
      </ScrollArea>
    </div>
  );
}
