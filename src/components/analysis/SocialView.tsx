
'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Twitter, MessageSquare, LayoutDashboard } from 'lucide-react';
import { TweetCard } from './TweetCard';
import { FallacyCard } from './FallacyCard';
import type { Tweet, DetectedFallacy, AnalysisResult } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { AnalysisSummary } from './AnalysisSummary';
import { AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskMoreChat } from './AskMoreChat';

interface SocialViewProps {
  socialPulse: string;
  tweets: Tweet[];
  isOpen: boolean;
  onToggle: () => void;
  credibilityScore?: number;
  brutalHonestTake?: string;
  keyPoints?: string[];
  summary?: string;
  fallacies?: DetectedFallacy[];
  analysisResult: AnalysisResult; // Added full object for Chat
}

export function SocialView({
  socialPulse,
  tweets,
  isOpen,
  onToggle: _onToggle,
  credibilityScore,
  brutalHonestTake,
  keyPoints,
  summary,
  fallacies,
  analysisResult
}: SocialViewProps) {

  const fallbackMessages = [
    "X seems shy right now. Check back soon!",
    "The feed’s taking a quick power nap.",
    "No trending tweets at the moment — maybe it’s a Zen hour.",
    "Looks like a quiet moment on the timeline. Enjoy the calm!",
    "The digital town square is empty. Let's start a conversation!"
  ];

  const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-full bg-background border-l flex flex-col"
        >
          <Tabs defaultValue="analysis" className="flex-1 flex flex-col h-full">
            {/* Header with Tabs */}
            <div className="flex-none px-4 py-3 bg-background/80 backdrop-blur-md border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Ask More
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content: Analysis Overview */}
            <TabsContent value="analysis" className="flex-1 overflow-hidden data-[state=inactive]:hidden mt-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-8 pb-20">

                  {/* 1. New AI Summary Features */}
                  <AnalysisSummary
                    summary={summary || "No summary available."}
                    credibilityScore={credibilityScore}
                    brutalHonestTake={brutalHonestTake}
                    keyPoints={keyPoints}
                  />

                  {/* 1.5 Logical Fallacies Section */}
                  {fallacies && fallacies.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2 text-amber-600 dark:text-amber-500">
                          <AlertTriangle className="h-4 w-4" /> Logical Fallacy Detection
                        </h3>
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          {fallacies.length} Issues Found
                        </span>
                      </div>
                      <div className="space-y-3">
                        {fallacies.map(fallacy => (
                          <FallacyCard key={fallacy.id} fallacy={fallacy} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-bold tracking-widest">
                        On Social Media
                      </span>
                    </div>
                  </div>

                  {/* 3. Social Pulse Section */}
                  <div>
                    {socialPulse && (
                      <div className="mb-4 rounded-xl bg-blue-500/10 p-4 border border-blue-500/20">
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">X / Twitter Pulse</h3>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{socialPulse}</p>
                      </div>
                    )}

                    <div className="divide-y divide-border">
                      {(tweets && tweets.length > 0) ? (
                        tweets.map(tweet => <TweetCard key={tweet.id} tweet={tweet} />)
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Twitter className="h-6 w-6 opacity-50" />
                          </div>
                          <p className="text-sm">{socialPulse ? 'No individual tweets available.' : randomFallback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Content: Ask More Chat */}
            <TabsContent value="chat" className="flex-1 overflow-hidden data-[state=inactive]:hidden mt-0 h-full">
              <AskMoreChat analysisResult={analysisResult} />
            </TabsContent>

          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
