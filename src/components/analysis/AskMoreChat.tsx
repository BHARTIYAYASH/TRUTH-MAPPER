'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { AnalysisResult } from '@/lib/types';
import { handleAskMore } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';

interface AskMoreChatProps {
    analysisResult: AnalysisResult;
}

type Message = {
    id: string;
    role: 'user' | 'model';
    content: string;
};

export function AskMoreChat({ analysisResult }: AskMoreChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'model',
            content: "I'm ready to dig deeper. Ask me anything about this analysis, or request more evidence on a specific claim."
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API
            const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));

            const { answer, error } = await handleAskMore(userMsg.content, analysisResult, historyForApi);

            if (error) {
                throw new Error(error);
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: answer || "I couldn't generate an answer. Please try again."
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err: any) {
            console.error("Chat error:", err);
            // Add error message
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                content: "**Error:** " + (err.message || "Something went wrong.")
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col h-full bg-background border-l border-border/50">
            {/* Header */}
            <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    <h3 className="font-semibold text-sm">Ask More</h3>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Beta</span>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-3 text-sm max-w-[90%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            <div className={cn(
                                "p-3 rounded-lg leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-muted/50 border border-border/50 rounded-tl-none prose prose-sm dark:prose-invert"
                            )}>
                                {msg.role === 'user' ? (
                                    msg.content
                                ) : (
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 text-sm max-w-[90%] mr-auto">
                            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 animate-pulse">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg rounded-tl-none border border-border/50 flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Analysing & Searching...</span>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border/40 bg-background/50 backdrop-blur-sm">
                <div className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a follow-up question..."
                        className="min-h-[80px] resize-none pr-12 bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary/20"
                    />
                    <Button
                        size="icon"
                        className="absolute bottom-2 right-2 h-8 w-8"
                        onClick={handleSubmit}
                        disabled={!input.trim() || isLoading}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">
                    AI can make mistakes. Verify important info.
                </p>
            </div>
        </div>
    );
}
