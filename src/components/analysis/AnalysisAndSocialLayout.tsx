'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnalysisView } from './AnalysisView';
import { SocialView } from './SocialView';
import type { AnalysisResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface AnalysisAndSocialLayoutProps {
  analysisData: AnalysisResult;
  onReset: () => void;
}

export function AnalysisAndSocialLayout({ analysisData, onReset }: AnalysisAndSocialLayoutProps) {
  const [isSocialOpen, setIsSocialOpen] = useState(true);
  const { i18n } = useTranslation();
  const [translatedData, setTranslatedData] = useState<AnalysisResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      // If English, clear translation and use original
      if (i18n.language === 'en') {
        setTranslatedData(null);
        return;
      }

      setIsTranslating(true);
      try {
        const response = await fetch('http://localhost:8000/translate_ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            json_data: analysisData,
            target_lang: i18n.language
          })
        });

        if (!response.ok) throw new Error('Translation failed');

        const data = await response.json();
        setTranslatedData(data.translated_json);
      } catch (error) {
        console.error("Translation Error:", error);
        // Fallback to original if translation fails
        setTranslatedData(null);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [i18n.language, analysisData]);

  const currentData = translatedData || analysisData;

  return (
    <div className={cn(
      "grid h-[calc(100vh-80px)] w-full transition-all duration-300",
      isSocialOpen ? "grid-cols-[1fr,420px]" : "grid-cols-[1fr,0px]"
    )}>
      <div
        className="flex-1 overflow-x-auto overflow-y-auto relative scroll-smooth bg-background"
      >
        <AnalysisView
          analysisData={currentData}
          onReset={onReset}
          isSocialOpen={isSocialOpen}
          onSocialToggle={() => setIsSocialOpen(!isSocialOpen)}
        />
        {isTranslating && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm z-50">
            Translating...
          </div>
        )}
      </div>

      <div className={cn(
        "transition-all duration-300 ease-in-out overflow-hidden border-l",
        isSocialOpen ? 'w-[420px]' : 'w-0'
      )}>
        <div className="h-full w-[420px]">
          <SocialView
            socialPulse={currentData.socialPulse}
            tweets={currentData.tweets}
            isOpen={isSocialOpen}
            onToggle={() => setIsSocialOpen(!isSocialOpen)}
            credibilityScore={currentData.credibilityScore}
            brutalHonestTake={currentData.brutalHonestTake}
            keyPoints={currentData.keyPoints}
            summary={currentData.summary}
            fallacies={currentData.fallacies}
            analysisResult={currentData}
          />
        </div>
      </div>
    </div>
  );
}
