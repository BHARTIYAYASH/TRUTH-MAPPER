"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { RainbowButton } from '@/components/landing/ui/rainbow-button'
import { SpotlightCard } from '@/components/landing/ui/spotlight-card'

export default function AllSections() {
    return (
        <div className="bg-[#F5F0E1] dark:bg-[#0F1419] transition-colors duration-500">
            {/* Ticker Section */}
            <TickerSection />

            {/* Problem Section */}
            <ProblemSection />

            {/* How It Works */}
            <HowItWorksSection />

            {/* Live Demo */}
            <LiveDemoSection />

            {/* Features */}
            <FeaturesSection />

            {/* About Us */}
            <AboutSection />

            {/* Testimonials */}
            <TestimonialsSection />

            {/* Final CTA */}
            <CTASection />
        </div>
    )
}

// ==================== TICKER SECTION ====================
function TickerSection() {
    const headlines = [
        { source: "Pro-Gov Media", text: "Economic reforms show positive results" },
        { source: "Opposition Media", text: "Reforms fail to address core issues" },
        { source: "Independent", text: "Mixed reactions to new policy changes" },
        { source: "Pro-Gov Media", text: "Infrastructure development accelerates" },
        { source: "Opposition Media", text: "Questions raised over project delays" },
    ]

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#8FBC8F]/20 via-[#2D5016]/20 to-[#8FBC8F]/20 dark:from-[#5EEAD4]/10 dark:via-[#1A1F26]/20 dark:to-[#5EEAD4]/10 py-4 border-y border-[#2D5016]/20 dark:border-[#5EEAD4]/20">
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {[...headlines, ...headlines, ...headlines].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className="font-bold text-[#2D5016] dark:text-[#5EEAD4] text-sm">
                            {item.source}:
                        </span>
                        <span className="text-[#2D5016]/80 dark:text-[#E5E7EB]/80 text-sm">
                            {item.text}
                        </span>
                        <span className="text-[#8FBC8F] dark:text-[#98D8C8]">•</span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// ==================== PROBLEM SECTION ====================
function ProblemSection() {
    return (
        <section id="about" className="py-20 px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="font-poppins text-4xl md:text-5xl font-black text-[#2D5016] dark:text-white mb-4">
                    The Web of Info: India's{' '}
                    <span className="text-[#8FBC8F] dark:text-[#5EEAD4]">Polarized</span>{' '}
                    Media Landscape
                </h2>
                <p className="text-lg text-[#2D5016]/70 dark:text-[#E5E7EB]/70 max-w-3xl mx-auto">
                    Information flows through distinct clusters, creating echo chambers that distort reality
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Echo Chamber A */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <SpotlightCard className="p-8 h-full" spotlightColor="rgba(255, 107, 107, 0.3)">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-poppins text-2xl font-bold text-[#1a1a1a] dark:text-white">Echo Chamber A</h3>
                        </div>
                        <p className="text-[#2D2D2D] dark:text-white/80 mb-4">
                            Users only see perspectives that confirm their existing beliefs
                        </p>
                        <div className="space-y-2">
                            {['Same opinion bubble 1', 'Same opinion bubble 2', 'Same opinion bubble 3'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-[#4a4a4a] dark:text-white/60 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>
                </motion.div>

                {/* Echo Chamber B */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <SpotlightCard className="p-8 h-full" spotlightColor="rgba(59, 130, 246, 0.3)">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-poppins text-2xl font-bold text-[#1a1a1a] dark:text-white">Echo Chamber B</h3>
                        </div>
                        <p className="text-[#2D2D2D] dark:text-white/80 mb-4">
                            Opposing viewpoints create a completely different reality
                        </p>
                        <div className="space-y-2">
                            {['Opposing bubble 1', 'Opposing bubble 2', 'Opposing bubble 3'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-[#4a4a4a] dark:text-white/60 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>
                </motion.div>
            </div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid md:grid-cols-3 gap-6"
            >
                {[
                    { stat: '78%', label: 'of users only see one perspective' },
                    { stat: '5+', label: 'contradicting narratives on every major issue' },
                    { stat: 'Zero', label: 'tools to compare them side-by-side' },
                ].map((item, index) => (
                    <SpotlightCard key={index} className="p-6 text-center">
                        <div className="text-4xl font-black text-[#5EEAD4] mb-2">{item.stat}</div>
                        <div className="text-[#2D2D2D] dark:text-white/80">{item.label}</div>
                    </SpotlightCard>
                ))}
            </motion.div>
        </section>
    )
}

// ==================== HOW IT WORKS SECTION ====================
function HowItWorksSection() {
    const steps = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: 'Aggregate',
            description: 'We scan news anchors, YouTube influencers, digital portals, and social media across the political spectrum',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: 'Analyze',
            description: 'Our AI extracts claims, counter-claims, and evidence from each narrative, identifying contradictions and consensus',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            ),
            title: 'Visualize',
            description: 'You get a visual argument map showing all perspectives side-by-side, with evidence quality scores',
        },
    ]

    return (
        <section className="py-20 px-8 bg-gradient-to-b from-transparent to-[#8FBC8F]/10 dark:to-[#1A1F26]/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-poppins text-4xl md:text-5xl font-black text-[#2D5016] dark:text-white mb-4">
                        From Chaos to{' '}
                        <span className="text-[#8FBC8F] dark:text-[#5EEAD4]">Clarity</span>{' '}
                        in 3 Steps
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <SpotlightCard className="p-8 h-full group hover:scale-105 transition-transform duration-300">
                                <motion.div
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5EEAD4] to-[#98D8C8] flex items-center justify-center mb-6 text-[#0F1419]"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {step.icon}
                                </motion.div>
                                <h3 className="font-poppins text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-[#4a4a4a] dark:text-white/70 leading-relaxed">
                                    {step.description}
                                </p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ==================== LIVE DEMO SECTION ====================
function LiveDemoSection() {
    return (
        <section id="demo" className="py-20 px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-poppins text-4xl md:text-5xl font-black text-[#2D5016] dark:text-white mb-4">
                        See It In Action:{' '}
                        <span className="text-[#8FBC8F] dark:text-[#5EEAD4]">The Aravali Mining Controversy</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Pro-Government Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <SpotlightCard className="p-6 border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <h3 className="font-bold text-[#1a1a1a] dark:text-white">Pro-Government Narrative</h3>
                            </div>
                            <ul className="space-y-2 text-[#2D2D2D] dark:text-white/80 text-sm">
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Supreme Court mandated mining operations
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Economic development for local communities
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Strict environmental compliance measures
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Job creation and infrastructure growth
                                </li>
                            </ul>
                            <div className="mt-4 text-xs text-[#4a4a4a] dark:text-white/50">
                                Sources: 12 articles, 8 TV debates, 15 social posts
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    {/* Opposition Narrative */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <SpotlightCard className="p-6 border-l-4 border-orange-500">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <h3 className="font-bold text-[#1a1a1a] dark:text-white">Opposition Narrative</h3>
                            </div>
                            <ul className="space-y-2 text-[#2D2D2D] dark:text-white/80 text-sm">
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Environmental destruction of protected areas
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Corruption and illegal profit motives
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Displacement of indigenous communities
                                </li>
                                <li className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Long-term ecological damage
                                </li>
                            </ul>
                            <div className="mt-4 text-xs text-[#4a4a4a] dark:text-white/50">
                                Sources: 10 articles, 6 TV debates, 20 social posts
                            </div>
                        </SpotlightCard>
                    </motion.div>
                </div>

                {/* Argument Map Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <SpotlightCard className="p-12">
                        <div className="mb-6">
                            <svg className="w-24 h-24 mx-auto text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </div>
                        <h3 className="font-poppins text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4">
                            Interactive Argument Map
                        </h3>
                        <p className="text-[#4a4a4a] dark:text-white/70 mb-6 max-w-2xl mx-auto">
                            Click to explore the full visual map showing all claims, evidence, and connections between narratives
                        </p>
                        <RainbowButton href="/radar">
                            Try Your Own Topic
                        </RainbowButton>
                    </SpotlightCard>
                </motion.div>
            </div>
        </section>
    )
}

// ==================== FEATURES SECTION ====================
function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Break Echo Chambers',
            description: 'Expose yourself to perspectives you\'d never see in your feed',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: 'Evidence-Based',
            description: 'Every claim is linked to source material with credibility scores',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            ),
            title: 'Visual Clarity',
            description: 'Complex debates simplified into intuitive argument maps',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Real-Time Updates',
            description: 'Live tracking of evolving narratives as news breaks',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            ),
            title: 'Bias-Free AI',
            description: 'Our AI doesn\'t take sides—it just maps the battlefield',
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Indian Media Focus',
            description: 'Built specifically for India\'s unique media ecosystem',
        },
    ]

    return (
        <section id="features" className="py-20 px-8 bg-gradient-to-b from-[#8FBC8F]/10 to-transparent dark:from-[#1A1F26]/50 dark:to-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-poppins text-4xl md:text-5xl font-black text-[#2D5016] dark:text-white mb-4">
                        Why{' '}
                        <span className="text-[#8FBC8F] dark:text-[#5EEAD4]">Argument Cartographer</span>
                        ?
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <SpotlightCard className="p-6 h-full group hover:scale-105 transition-transform duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5EEAD4] to-[#98D8C8] flex items-center justify-center mb-4 text-[#0F1419]">
                                    {feature.icon}
                                </div>
                                <h3 className="font-poppins text-xl font-bold text-[#1a1a1a] dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[#4a4a4a] dark:text-white/70 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ==================== ABOUT SECTION ====================
function AboutSection() {
    return (
        <section className="py-20 px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-poppins text-4xl md:text-5xl font-black text-[#2D5016] dark:text-white mb-6">
                            Our Mission: Empowering Citizens in the Age of{' '}
                            <span className="text-[#8FBC8F] dark:text-[#5EEAD4]">5GW</span>
                        </h2>
                        <p className="text-lg text-[#2D5016]/80 dark:text-[#E5E7EB]/80 mb-6 leading-relaxed">
                            In 5th Generation Warfare, information is weaponized to manipulate public opinion.
                            We believe citizens deserve to see the full picture before forming opinions.
                        </p>
                        <p className="text-lg text-[#2D5016]/80 dark:text-[#E5E7EB]/80 mb-8 leading-relaxed">
                            Argument Cartographer is our contribution to a more informed democracy.
                        </p>
                        <RainbowButton href="#features">
                            Learn More About Us
                        </RainbowButton>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <SpotlightCard className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#5EEAD4]/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Transparency First</h4>
                                        <p className="text-[#4a4a4a] dark:text-white/70 text-sm">All sources and methodologies are open and verifiable</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#5EEAD4]/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Community Driven</h4>
                                        <p className="text-[#4a4a4a] dark:text-white/70 text-sm">Built with feedback from journalists, researchers, and citizens</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#5EEAD4]/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#1a1a1a] dark:text-white mb-2">Constantly Evolving</h4>
                                        <p className="text-[#4a4a4a] dark:text-white/70 text-sm">Regular updates to adapt to new manipulation tactics</p>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// ==================== TESTIMONIALS SECTION ====================
function TestimonialsSection() {
    const testimonials = [
        {
            quote: "Finally, I can see what both sides are actually saying without the filter of my social media bubble.",
            author: "Priya S.",
            role: "College Student",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
            ),
        },
        {
            quote: "Essential tool for journalists covering polarized topics. Saves hours of research time.",
            author: "Rahul M.",
            role: "Reporter",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            quote: "Reduced my confirmation bias by exposing blind spots I didn't even know I had.",
            author: "Dr. Anjali K.",
            role: "Researcher",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
    ]

    return (
        <section className="py-20 px-8 bg-gradient-to-b from-transparent to-[#8FBC8F]/10 dark:to-[#1A1F26]/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-poppins text-4xl md:text-5xl font-black text-[#2D5016] dark:text-white mb-4">
                        Early{' '}
                        <span className="text-[#8FBC8F] dark:text-[#5EEAD4]">Impact</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <SpotlightCard className="p-6 h-full">
                                <div className="w-12 h-12 rounded-full bg-[#5EEAD4]/20 flex items-center justify-center mb-4 text-[#5EEAD4]">
                                    {testimonial.icon}
                                </div>
                                <p className="text-[#2D2D2D] dark:text-white/90 italic mb-6 leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <div className="font-bold text-[#1a1a1a] dark:text-white">{testimonial.author}</div>
                                    <div className="text-[#4a4a4a] dark:text-white/60 text-sm">{testimonial.role}</div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

// ==================== CTA SECTION ====================
function CTASection() {
    return (
        <section className="py-32 px-8 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2D5016] via-[#8FBC8F] to-[#5EEAD4] dark:from-[#0F1419] dark:via-[#1A1F26] dark:to-[#5EEAD4] opacity-90" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-poppins text-5xl md:text-6xl font-black text-white mb-6">
                        Ready to See the Full Picture?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands mapping the information battlefield
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <RainbowButton href="/radar" className="text-lg px-12 py-4">
                            Start Your First Analysis
                        </RainbowButton>
                    </div>
                    <p className="text-white/70 text-sm mt-6">
                        Free account • No credit card required
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
