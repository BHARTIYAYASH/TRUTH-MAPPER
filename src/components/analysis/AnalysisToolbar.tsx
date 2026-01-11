"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LayoutGrid, Download, Repeat, Columns, Rows3, CircleDot, Share2, MessageSquare, Gauge } from 'lucide-react';
import { ExportModal } from './ExportModal';
import type { ArgumentNode } from '@/lib/types';
import React from 'react';

type VisualizationMode = 'balanced' | 'tree' | 'pillar' | 'circular' | 'flowchart' | 'compass';

interface AnalysisToolbarProps {
  currentView: VisualizationMode;
  onViewChange: (view: VisualizationMode) => void;
  jsonData: ArgumentNode[];
  onReset: () => void;
  exportRef: React.RefObject<HTMLDivElement>;
  isSocialOpen: boolean;
  onSocialToggle: () => void;
}

export function AnalysisToolbar({
  currentView,
  onViewChange,
  jsonData,
  onReset,
  exportRef,
  isSocialOpen,
  onSocialToggle,
}: AnalysisToolbarProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const viewModes: { id: VisualizationMode, label: string, icon: React.ElementType }[] = [
    { id: 'balanced', label: 'Balanced', icon: Columns },
    { id: 'tree', label: 'Tree', icon: LayoutGrid },
    { id: 'pillar', label: 'Pillar', icon: Rows3 },
    { id: 'circular', label: 'Circular', icon: CircleDot },
    { id: 'flowchart', label: 'Flow Map', icon: Share2 },
    { id: 'compass', label: 'Compass', icon: Gauge },
  ];

  return (
    <>
      <div className="z-30 flex h-16 items-center justify-between gap-4 border-b-4 bg-background px-4 md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border-2 bg-background p-1">
            {viewModes.map(mode => (
              <Button
                key={mode.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(mode.id)}
                className={cn(
                  'h-8 gap-2 rounded-sm',
                  currentView === mode.id && 'bg-foreground text-background shadow-none hover:bg-foreground',
                )}
              >
                <mode.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={isSocialOpen ? "secondary" : "outline"} size="sm" onClick={onSocialToggle} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)} className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Separator orientation="vertical" className="h-6 bg-border" />
          <Button variant="ghost" size="icon" onClick={onReset} className="text-muted-foreground hover:text-primary">
            <Repeat className="h-5 w-5" />
            <span className="sr-only">New Analysis</span>
          </Button>
        </div>
      </div>
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        jsonData={jsonData}
        exportRef={exportRef}
      />
    </>
  );
}
