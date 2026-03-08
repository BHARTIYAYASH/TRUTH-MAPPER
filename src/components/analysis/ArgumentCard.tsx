"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ArgumentNode } from '@/lib/types';
import { BookOpen, Repeat2, Link } from 'lucide-react';

interface ArgumentCardProps {
  node: ArgumentNode;
  isRoot?: boolean;
  className?: string;
}

const typeColors = {
  thesis: 'bg-primary text-primary-foreground',
  claim: 'bg-secondary text-secondary-foreground',
  counterclaim: 'bg-secondary text-secondary-foreground',
  evidence: 'bg-muted text-muted-foreground',
};

const sideBorderColors = {
  for: 'border-argument-for',
  against: 'border-argument-against'
}

// Helper to safely extract hostname from a URL
function getHostname(url: string | undefined | null): string {
  if (!url || url === 'null' || url.trim() === '') return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return ''; // Invalid URL, return empty string
  }
}

export function ArgumentCard({ node, isRoot = false, className }: ArgumentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const hostname = getHostname(node.source);
  const isValidSource = hostname !== '' && node.source && node.source !== 'null';

  return (
    <div className={cn("group [perspective:1000px]", className)}>
      <div
        className={cn(
          'relative h-full w-full rounded-sm transition-transform duration-500 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        )}
      >
        {/* Front Face */}
        <Card className={cn(
          'relative h-full w-full [backface-visibility:hidden]',
          'flex flex-col border-4 bg-card shadow-[4px_4px_0px_hsl(var(--border))] group-hover:shadow-[8px_8px_0px_hsl(var(--border))] transition-shadow duration-200',
          sideBorderColors[node.side]
        )}>
          <CardHeader className="flex-row items-center justify-between space-y-0 p-3">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {node.type}
            </CardTitle>
            <Badge className={cn(
              'capitalize rounded-sm border-2 text-xs',
              node.side === 'for' ? 'border-argument-for bg-argument-for/10 text-argument-for' : 'border-argument-against bg-argument-against/10 text-argument-against'
            )}>{node.side}</Badge>
          </CardHeader>
          <CardContent className="flex-grow p-4 pt-0">
            <p className={cn('text-foreground', isRoot ? 'font-headline text-2xl font-bold' : 'text-base')}>{node.content}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-3 pt-0">
            {node.sourceText && (
              <Button variant="ghost" size="sm" onClick={() => setIsFlipped(true)} className="gap-2 text-xs text-muted-foreground hover:bg-muted-foreground/10">
                <BookOpen className="h-4 w-4" />
                Evidence
              </Button>
            )}
            {isValidSource && (
              <a
                href={node.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Link className="h-3 w-3" />
                <span className="truncate">{hostname}</span>
              </a>
            )}
          </CardFooter>
        </Card>

        {/* Back Face */}
        <Card className={cn(
          'absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden]',
          'flex flex-col border-4 bg-card',
          sideBorderColors[node.side]
        )}>
          <CardHeader className="flex-row items-center justify-between space-y-0 p-3">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Source Evidence
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto p-4 pt-0">
            <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
              {node.sourceText}
            </blockquote>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-3 pt-0">
            <Button variant="ghost" size="sm" onClick={() => setIsFlipped(false)} className="gap-2 text-xs text-muted-foreground hover:bg-muted-foreground/10">
              <Repeat2 className="h-4 w-4" />
              Argument
            </Button>
            {isValidSource && (
              <a
                href={node.source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Link className="h-3 w-3" />
                <span className="truncate">{hostname}</span>
              </a>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
