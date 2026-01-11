
"use client";

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Download, Clipboard, Sun, Moon, X, FileJson, Image as ImageIcon, Code } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { getFontEmbedCSS } from 'html-to-image';
import { useTheme } from 'next-themes';
import React from 'react';

type ExportFormat = 'PNG' | 'SVG' | 'JSON';
type Resolution = '1x' | '2x' | '3x';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    jsonData: any;
    exportRef: React.RefObject<HTMLDivElement>;
}

const ToggleButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <Button
        variant="ghost"
        size="sm"
        className={cn(
            'h-auto rounded-md px-3 py-1.5 text-sm',
            active ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted'
        )}
        onClick={onClick}
    >
        {children}
    </Button>
);

export function ExportModal({ isOpen, onClose, jsonData, exportRef }: ExportModalProps) {
    const [format, setFormat] = useState<ExportFormat>('PNG');
    const [includeLogo, setIncludeLogo] = useState(true);
    const [includeBackground, setIncludeBackground] = useState(true);
    const [resolution, setResolution] = useState<Resolution>('1x');
    const { theme, systemTheme } = useTheme();
    const [colorMode, setColorMode] = useState<'Light' | 'Dark'>('Dark');
    const { toast } = useToast();

    useEffect(() => {
        const currentTheme = theme === 'system' ? systemTheme : theme;
        setColorMode(currentTheme === 'dark' ? 'Dark' : 'Light');
    }, [theme, systemTheme, isOpen]);

    const getExportOptions = () => {
        const scale = { '1x': 1, '2x': 2, '3x': 3 }[resolution];
        const isDark = colorMode === 'Dark';

        return {
            pixelRatio: scale,
            style: {
                ...(isDark && { backgroundColor: 'hsl(217 14% 10%)', color: 'hsl(40 50% 98%)' }),
                ...(!isDark && { backgroundColor: 'hsl(40 50% 98%)', color: 'hsl(217 14% 35%)' }),
            },
            backgroundColor: includeBackground ? (isDark ? 'hsl(217 14% 10%)' : 'hsl(40 50% 98%)') : 'transparent',
        };
    };

    // Helper function to prepare elements for export by disabling 3D transforms and setting transparency
    const prepareForExport = (element: HTMLElement) => {
        const originalStyles: { el: HTMLElement; styles: { [key: string]: string } }[] = [];

        // Handle Background Transparency
        if (!includeBackground) {
            originalStyles.push({
                el: element,
                styles: { background: element.style.background, backgroundColor: element.style.backgroundColor }
            });
            element.style.setProperty('background', 'transparent', 'important');
            element.style.setProperty('background-color', 'transparent', 'important');
        }

        const restoreStyles = (el: HTMLElement, styles: { [key: string]: string }) => {
            originalStyles.push({ el, styles });
        };

        // Disable perspective on card containers
        const perspectiveContainers = element.querySelectorAll('[class*="perspective"]');
        perspectiveContainers.forEach((container) => {
            const el = container as HTMLElement;
            originalStyles.push({
                el,
                styles: { perspective: el.style.perspective }
            });
            el.style.perspective = 'none';
        });

        // Disable 3D transform-style and transforms on card wrappers
        const cardWrappers = element.querySelectorAll('.group > div');
        cardWrappers.forEach((wrapper) => {
            const el = wrapper as HTMLElement;
            originalStyles.push({
                el,
                styles: {
                    transformStyle: el.style.transformStyle,
                    transform: el.style.transform,
                }
            });
            el.style.transformStyle = 'flat';
            el.style.transform = 'none';
        });

        // Hide back faces of cards (they have rotateY(180deg) which causes mirroring)
        const backFaces = element.querySelectorAll('[class*="rotateY"]');
        backFaces.forEach((backFace) => {
            const el = backFace as HTMLElement;
            originalStyles.push({
                el,
                styles: {
                    display: el.style.display,
                    visibility: el.style.visibility,
                }
            });
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        });

        // Also target elements with backface-visibility  
        const backfaceElements = element.querySelectorAll('[class*="backface"]');
        backfaceElements.forEach((bfEl) => {
            const el = bfEl as HTMLElement;
            // Only hide if it's an "absolute" positioned back face
            if (el.classList.contains('absolute')) {
                originalStyles.push({
                    el,
                    styles: { display: el.style.display }
                });
                el.style.display = 'none';
            }
        });

        return originalStyles;
    };

    // Helper function to restore original styles after export
    const restoreAfterExport = (originalStyles: { el: HTMLElement; styles: { [key: string]: string } }[]) => {
        originalStyles.forEach(({ el, styles }) => {
            Object.entries(styles).forEach(([prop, value]) => {
                el.style[prop as any] = value;
            });
        });
    };

    const handleDownload = async () => {
        if (!exportRef.current) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not find the content to export.",
            });
            return;
        }
        const element = exportRef.current;

        // Prepare elements for export (disable 3D transforms)
        const originalStyles = prepareForExport(element);

        if (format === 'JSON') {
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(jsonData, null, 2)
            )}`;
            const link = document.createElement("a");
            link.href = jsonString;
            link.download = `argument-atlas-export.json`;
            link.click();
            toast({ title: "JSON Exported", description: "Your JSON file has been downloaded." });
            restoreAfterExport(originalStyles);
            onClose();
            return;
        }

        toast({ title: "Exporting...", description: `Generating your ${format} file.` });

        try {
            const scale = { '1x': 1, '2x': 2, '3x': 3 }[resolution];
            const isDark = colorMode === 'Dark';

            const originalClassName = document.documentElement.className;
            const exportThemeClass = colorMode === 'Dark' ? 'dark' : '';
            document.documentElement.className = exportThemeClass;

            // Force a reflow
            void element.offsetHeight;

            // Try to get font embed CSS, but handle cross-origin errors gracefully
            let fontEmbedCss = '';
            try {
                fontEmbedCss = await getFontEmbedCSS(element);
            } catch (fontError) {
                console.warn('Could not embed fonts (cross-origin restriction):', fontError);
                // Continue without embedded fonts - the export will still work
            }

            const options = {
                pixelRatio: scale,
                backgroundColor: includeBackground
                    ? (isDark ? 'hsl(217, 14%, 10%)' : 'hsl(40, 50%, 98%)')
                    : 'transparent',
                style: {
                    ...(isDark && { backgroundColor: 'hsl(217, 14%, 10%)', color: 'hsl(40, 50%, 98%)' }),
                    ...(!isDark && { backgroundColor: 'hsl(40, 50%, 98%)', color: 'hsl(217, 14%, 35%)' }),
                },
                ...(fontEmbedCss && { fontEmbedCss }),
                // Skip font embedding if it causes issues
                skipFonts: !fontEmbedCss,
            };

            let dataUrl;
            const filename = "argument-atlas-export";

            switch (format) {
                case 'PNG':
                    dataUrl = await htmlToImage.toPng(element, options);
                    break;
                case 'SVG':
                    dataUrl = await htmlToImage.toSvg(element, options);
                    break;
            }

            if (dataUrl) {
                const link = document.createElement('a');
                link.download = `${filename}.${format.toLowerCase()}`;
                link.href = dataUrl;
                link.click();
                toast({ title: "Export Complete", description: `Your ${format} file has been downloaded.` });
            }

            document.documentElement.className = originalClassName;

        } catch (error) {
            console.error("Export failed:", error);
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: "An error occurred while generating the file.",
            });
        } finally {
            // Restore original styles
            restoreAfterExport(originalStyles);
            onClose();
        }
    };

    const handleCopyToClipboard = async () => {
        if (format === 'JSON') {
            navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
            toast({
                title: "Copied to Clipboard",
                description: "The JSON data has been copied to your clipboard.",
            });
            onClose();
            return;
        }

        if (!exportRef.current) return;

        const element = exportRef.current;

        // Prepare elements for export (disable 3D transforms)
        const originalStyles = prepareForExport(element);

        toast({ title: "Copying Image...", description: `Generating ${format} to copy.` });

        try {
            const scale = { '1x': 1, '2x': 2, '3x': 3 }[resolution];
            const isDark = colorMode === 'Dark';

            const originalClassName = document.documentElement.className;
            const exportThemeClass = colorMode === 'Dark' ? 'dark' : '';
            document.documentElement.className = exportThemeClass;

            // Force a reflow
            void element.offsetHeight;

            // Try to get font embed CSS, but handle cross-origin errors gracefully
            let fontEmbedCss = '';
            try {
                fontEmbedCss = await getFontEmbedCSS(element);
            } catch (fontError) {
                console.warn('Could not embed fonts (cross-origin restriction):', fontError);
            }

            const options = {
                pixelRatio: scale,
                backgroundColor: includeBackground
                    ? (isDark ? 'hsl(217, 14%, 10%)' : 'hsl(40, 50%, 98%)')
                    : 'transparent',
                style: {
                    ...(isDark && { backgroundColor: 'hsl(217, 14%, 10%)', color: 'hsl(40, 50%, 98%)' }),
                    ...(!isDark && { backgroundColor: 'hsl(40, 50%, 98%)', color: 'hsl(217, 14%, 35%)' }),
                },
                ...(fontEmbedCss && { fontEmbedCss }),
                skipFonts: !fontEmbedCss,
            };

            const blob = await htmlToImage.toBlob(element, options);
            if (blob) {
                await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                toast({ title: "Image Copied!", description: "The image has been copied to your clipboard." });
            }
            document.documentElement.className = originalClassName;
        } catch (error) {
            console.error("Copy to clipboard failed:", error);
            toast({
                variant: "destructive",
                title: "Copy Failed",
                description: "Could not copy the image to the clipboard.",
            });
        } finally {
            // Restore original styles
            restoreAfterExport(originalStyles);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-card text-card-foreground p-0">
                <DialogHeader className="p-6 pb-4">
                    <DialogTitle className="font-headline text-lg text-center">Export Visual</DialogTitle>
                </DialogHeader>

                <div className="px-6 space-y-6">
                    {/* Format Selector */}
                    <div className="space-y-3">
                        <Label className="font-medium">Format</Label>
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
                            <ToggleButton active={format === 'PNG'} onClick={() => setFormat('PNG')}>
                                <ImageIcon className="mr-2 h-4 w-4" /> PNG
                            </ToggleButton>
                            <ToggleButton active={format === 'SVG'} onClick={() => setFormat('SVG')}>
                                <Code className="mr-2 h-4 w-4" /> SVG
                            </ToggleButton>
                            <ToggleButton active={format === 'JSON'} onClick={() => setFormat('JSON')}>
                                <FileJson className="mr-2 h-4 w-4" /> JSON
                            </ToggleButton>
                        </div>
                    </div>

                    {format !== 'JSON' && (
                        <>
                            {/* Settings Section */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="background-toggle">Background</Label>
                                    <Switch id="background-toggle" checked={includeBackground} onCheckedChange={setIncludeBackground} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Color mode</Label>
                                    <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                                        <ToggleButton active={colorMode === 'Light'} onClick={() => setColorMode('Light')}>
                                            <Sun className="h-4 w-4" />
                                        </ToggleButton>
                                        <ToggleButton active={colorMode === 'Dark'} onClick={() => setColorMode('Dark')}>
                                            <Moon className="h-4 w-4" />
                                        </ToggleButton>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Resolution</Label>
                                    <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                                        <ToggleButton active={resolution === '1x'} onClick={() => setResolution('1x')}>1x</ToggleButton>
                                        <ToggleButton active={resolution === '2x'} onClick={() => setResolution('2x')}>2x</ToggleButton>
                                        <ToggleButton active={resolution === '3x'} onClick={() => setResolution('3x')}>3x</ToggleButton>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Area */}
                            <div className="space-y-2">
                                <Label className="font-medium">Preview</Label>
                                <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/50 h-32">
                                    <p className="text-sm text-muted-foreground">Export preview coming soon</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex-col gap-4 p-6 bg-muted/50 sm:flex-col">
                    {/* Social Share Section */}
                    <div className="flex w-full flex-col gap-2">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Share Analysis</Label>
                        <div className="grid grid-cols-4 gap-2">
                            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.open('https://twitter.com/intent/tweet?text=Check%20out%20this%20argument%20analysis%20I%20created%20with%20Argument%20Atlas!%20%23ArgumentAtlas', '_blank')}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                <span className="sr-only">X</span>
                            </Button>
                            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://argument-atlas.vercel.app', '_blank')}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">LinkedIn</span>
                            </Button>
                            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.open('https://wa.me/?text=Check%20out%20this%20argument%20analysis%20from%20Argument%20Atlas!', '_blank')}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12c0 1.95.53 3.77 1.44 5.35L2 22l4.81-1.26C8.36 21.52 10.13 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.63 0-3.17-.43-4.52-1.18l-.32-.18-3.35.88.89-3.26-.19-.32C3.93 14.54 3.5 13.06 3.5 12 3.5 7.31 7.31 3.5 12 3.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">WhatsApp</span>
                            </Button>
                            <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => window.open('https://t.me/share/url?url=https://argument-atlas.vercel.app&text=Check%20out%20this%20argument%20analysis!', '_blank')}>
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"></path></svg>
                                <span className="sr-only">Telegram</span>
                            </Button>

                        </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-4">
                        <Button variant="ghost" onClick={handleCopyToClipboard} className="flex-1 gap-2 text-muted-foreground hover:text-foreground">
                            <Clipboard className="h-4 w-4" />
                            Copy
                        </Button>
                        <Button onClick={handleDownload} className="flex-1 bg-primary text-primary-foreground gap-2">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </DialogFooter>
                <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            </DialogContent>
        </Dialog>
    );
}
