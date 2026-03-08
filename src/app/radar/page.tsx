'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { RADAR_TOPICS } from '@/lib/radar-data';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RadarPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header Section */}
            <div className="bg-slate-900 text-slate-50 py-20 px-4">
                <div className="container mx-auto max-w-6xl text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold tracking-widest uppercase text-sm">
                        <Activity className="h-4 w-4" />
                        <span>{t('live_feed')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-headline">
                        {t('radar_title')}<span className="text-emerald-500">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        {t('radar_subtitle')}
                    </p>
                    <div className="pt-8">
                        <Badge variant="outline" className="text-slate-300 border-slate-700 px-4 py-1">
                            {t('updated_live')}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Topics Grid */}
            <div className="container mx-auto max-w-7xl px-4 py-16 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {RADAR_TOPICS.map((topic, index) => (
                        <Link href={`/radar/${topic.id}`} key={topic.id} className="group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                            >
                                {/* MOCK IMAGE PLACEHOLDER AREA */}
                                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden group-hover:opacity-90 transition-opacity">
                                    <h2 className="text-4xl font-black text-slate-300/50 absolute top-4 left-4 z-0 pointer-events-none">
                                        0{index + 1}
                                    </h2>
                                    <div className="z-10 text-center px-6">
                                        <span className="text-6xl">⚔️</span>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                                        <TrendingUp className="h-3 w-3 text-red-500" /> {t('high_activity')}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors font-headline">
                                        {t(`radar_title_${topic.id}`) || topic.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                                        {t(`radar_subtitle_${topic.id}`) || topic.subtitle}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                            {t('click_explore')}
                                        </span>
                                        <div className="bg-slate-900 text-white p-2 rounded-full group-hover:bg-primary group-hover:text-black transition-colors">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="text-center pb-20 text-slate-400 text-sm">
                {t('app_name')} - Public Demo
                <br />
                <Link href="/signup" className="underline hover:text-primary">{t('signup')}</Link>
            </div>
        </div>
    );
}
