"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, BookOpen, Link2, AlertTriangle, ChevronsRight } from 'lucide-react';
import type { ArgumentNode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DetailPanelProps {
  node: ArgumentNode;
  evidence: ArgumentNode[];
  onClose: () => void;
}

export function DetailPanel({ node, evidence, onClose }: DetailPanelProps) {

  const sideColor = node.side === 'for' ? 'text-argument-for' : 'text-argument-against';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-20 right-0 h-[calc(100vh-80px)] w-full max-w-md z-40"
    >
      <Card className="h-full w-full flex flex-col rounded-l-lg rounded-r-none border-l-2 shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <Badge variant={node.side === 'for' ? 'default' : 'destructive'} className={cn(node.side === 'for' ? 'bg-argument-for' : 'bg-argument-against', 'capitalize')}>
                    {node.type}
                </Badge>
                <CardTitle className="mt-2 font-headline text-xl">{node.content}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-4 shrink-0">
                <X className="h-5 w-5" />
            </Button>
        </CardHeader>

        <ScrollArea className="flex-grow">
            <CardContent className="space-y-6">
                {/* Logical Role */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center"><ChevronsRight className="h-4 w-4 mr-2 text-accent"/> Logical Role</h4>
                    <p className="text-muted-foreground text-sm">{node.logicalRole}</p>
                </div>
                
                <Separator />

                {/* Evidence List */}
                {evidence.length > 0 && (
                     <div className="space-y-4">
                        <h4 className="font-semibold text-sm flex items-center"><BookOpen className="h-4 w-4 mr-2 text-accent"/> Evidence</h4>
                        <div className="space-y-4">
                        {evidence.map(item => (
                            <Card key={item.id} className="bg-muted/50">
                                <CardContent className="p-4 space-y-2">
                                    <blockquote className="border-l-2 pl-3 text-sm italic">
                                        "{item.sourceText}"
                                    </blockquote>
                                    {item.source && (
                                        <a
                                            href={item.source}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <Link2 className="h-3 w-3" />
                                            <span>{new URL(item.source).hostname}</span>
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        </div>
                    </div>
                )}
               
                {/* Fallacy Check */}
                {node.fallacies.length > 0 && (
                    <>
                     <Separator />
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center"><AlertTriangle className="h-4 w-4 mr-2 text-destructive"/> Logical Fallacies</h4>
                        <div className="flex flex-wrap gap-2">
                            {node.fallacies.map(fallacy => (
                                <Badge key={fallacy} variant="destructive">{fallacy}</Badge>
                            ))}
                        </div>
                    </div>
                    </>
                )}

            </CardContent>
        </ScrollArea>

        <CardFooter className="flex items-center justify-between border-t p-4">
             <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Link2 className="h-3 w-3" />
                <span>Source: {node.source ? new URL(node.source).hostname : 'N/A'}</span>
            </div>
             <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
