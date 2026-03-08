
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        // TODO: Notify backend if necessary to re-fetch/translate content
        console.log(`Language changed to ${lng}`);
    };

    const currentLanguage = i18n.language || 'en';
    const languageNames: { [key: string]: string } = {
        en: 'English',
        hi: 'हिंदी',
        mr: 'मराठी',
        te: 'తెలుగు',
        ta: 'தமிழ்'
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[100px] justify-between font-semibold border-2">
                    <Globe className="h-4 w-4" />
                    <span>{languageNames[currentLanguage] || 'English'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                    🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('hi')}>
                    🇮🇳 हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('mr')}>
                    🇮🇳 मराठी (Marathi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('te')}>
                    🇮🇳 తెలుగు (Telugu)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('ta')}>
                    🇮🇳 தமிழ் (Tamil)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
