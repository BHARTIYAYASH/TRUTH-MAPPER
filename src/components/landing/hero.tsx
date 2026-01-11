"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"

// Typewriter Effect Component
function TypewriterText({ isDarkMode }: { isDarkMode: boolean }) {
    const words = ['Mind', 'Truth', 'Reality', 'Perspective', 'Clarity']
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const word = words[currentWordIndex]
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < word.length) {
                    setCurrentText(word.slice(0, currentText.length + 1))
                } else {
                    setTimeout(() => setIsDeleting(true), 2000)
                }
            } else {
                if (currentText.length > 0) {
                    setCurrentText(currentText.slice(0, -1))
                } else {
                    setIsDeleting(false)
                    setCurrentWordIndex((prev) => (prev + 1) % words.length)
                }
            }
        }, isDeleting ? 50 : 150)

        return () => clearTimeout(timeout)
    }, [currentText, isDeleting, currentWordIndex, words])

    return (
        <span className="block font-light italic text-white/95 relative">
            {currentText}
            <motion.span
                className="inline-block w-0.5 h-12 md:h-14 lg:h-16 bg-[#5EEAD4] ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
            />
        </span>
    )
}

// Main Component
export default function ArgumentCartographerHero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isActive, setIsActive] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme, resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'

    useEffect(() => {
        setMounted(true)

        const handleMouseEnter = () => setIsActive(true)
        const handleMouseLeave = () => setIsActive(false)

        const container = containerRef.current
        if (container) {
            container.addEventListener("mouseenter", handleMouseEnter)
            container.addEventListener("mouseleave", handleMouseLeave)
        }

        return () => {
            if (container) {
                container.removeEventListener("mouseenter", handleMouseEnter)
                container.removeEventListener("mouseleave", handleMouseLeave)
            }
        }
    }, [])

    const toggleTheme = () => {
        setTheme(isDarkMode ? 'light' : 'dark')
    }

    // Prevent hydration mismatch
    if (!mounted) return <div className="min-h-screen bg-black" />

    return (
        <div
            ref={containerRef}
            className="min-h-screen relative overflow-hidden"
        >
            {/* Animated CSS Gradient Background */}
            <div className="absolute inset-0 w-full h-full">
                {/* Base animated gradient */}
                <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isDarkMode ? 'opacity-100' : 'opacity-0'
                        }`}
                    style={{
                        backgroundImage: 'linear-gradient(135deg, #0F1419 0%, #1A1F26 15%, #2D5016 30%, #5EEAD4 50%, #98D8C8 65%, #1A1F26 85%, #0F1419 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradient-shift 20s ease infinite',
                    }}
                />

                <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isDarkMode ? 'opacity-0' : 'opacity-100'
                        }`}
                    style={{
                        backgroundImage: 'linear-gradient(135deg, #FFF8E7 0%, #F5F0E1 15%, #8FBC8F 30%, #2D5016 50%, #A8D5BA 65%, #F5F0E1 85%, #FFF8E7 100%)',
                        backgroundSize: '400% 400%',
                        animation: 'gradient-shift 20s ease infinite',
                    }}
                />

                {/* Radial gradient overlays */}
                <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isDarkMode ? 'opacity-40' : 'opacity-30'
                        }`}
                    style={{
                        backgroundImage: isDarkMode
                            ? 'radial-gradient(circle at 20% 30%, rgba(94, 234, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(152, 216, 200, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(45, 80, 22, 0.2) 0%, transparent 70%)'
                            : 'radial-gradient(circle at 30% 40%, rgba(143, 188, 143, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(168, 213, 186, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(45, 80, 22, 0.2) 0%, transparent 60%)',
                        backgroundSize: '200% 200%',
                        animation: 'gradient-shift 15s ease infinite reverse',
                    }}
                />

                {/* Mesh pattern overlay */}
                <div
                    className="absolute inset-0 w-full h-full opacity-10"
                    style={{
                        backgroundImage: isDarkMode
                            ? 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(94, 234, 212, 0.05) 3px, rgba(94, 234, 212, 0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(94, 234, 212, 0.05) 3px, rgba(94, 234, 212, 0.05) 6px)'
                            : 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(45, 80, 22, 0.05) 3px, rgba(45, 80, 22, 0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(45, 80, 22, 0.05) 3px, rgba(45, 80, 22, 0.05) 6px)',
                    }}
                />

                {/* Noise texture */}
                <div
                    className="absolute inset-0 w-full h-full opacity-5"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                    }}
                />
            </div>

            <svg className="absolute inset-0 w-0 h-0">
                <defs>
                    <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
                        <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
                            result="tint"
                        />
                    </filter>
                    <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            {/* Header/Navbar */}
            <header className="relative z-20 flex items-center justify-between px-8 py-4">
                {/* Logo */}
                <motion.div
                    className="flex items-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <motion.div className="flex items-center space-x-2">
                        <motion.svg
                            width="32"
                            height="32"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-colors duration-300 ${isDarkMode ? 'text-[#5EEAD4]' : 'text-black'
                                }`}
                            style={{ filter: "url(#logo-glow)" }}
                            whileHover={{
                                rotate: [0, 10, -10, 0],
                                transition: { duration: 0.6, ease: "easeInOut" },
                            }}
                        >
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="2" />
                            <path d="M50 50 L70 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="50" cy="50" r="5" fill="currentColor" />
                        </motion.svg>

                        <div className={`font-bold text-base leading-tight transition-colors duration-300 ${isDarkMode ? 'text-[#E5E7EB]' : 'text-black'
                            }`}>
                            Argument<br />Cartographer
                        </div>
                    </motion.div>
                </motion.div>

                {/* Navigation Links */}
                <nav className="flex items-center space-x-1">
                    <a
                        href="#home"
                        className={`text-base font-medium px-3 py-2 rounded-full transition-all duration-200 ${isDarkMode
                            ? 'text-[#E5E7EB]/80 hover:text-[#E5E7EB] hover:bg-[#5EEAD4]/10'
                            : 'text-black hover:text-black hover:bg-[#8FBC8F]/20'
                            }`}
                    >
                        Home
                    </a>
                    <a
                        href="#about"
                        className={`text-base font-medium px-3 py-2 rounded-full transition-all duration-200 ${isDarkMode
                            ? 'text-[#E5E7EB]/80 hover:text-[#E5E7EB] hover:bg-[#5EEAD4]/10'
                            : 'text-black hover:text-black hover:bg-[#8FBC8F]/20'
                            }`}
                    >
                        About Us
                    </a>
                    <a
                        href="#features"
                        className={`text-base font-medium px-3 py-2 rounded-full transition-all duration-200 ${isDarkMode
                            ? 'text-[#E5E7EB]/80 hover:text-[#E5E7EB] hover:bg-[#5EEAD4]/10'
                            : 'text-black hover:text-black hover:bg-[#8FBC8F]/20'
                            }`}
                    >
                        Why Us
                    </a>
                    <Link
                        href="/radar"
                        className={`text-base font-medium px-3 py-2 rounded-full transition-all duration-200 ${isDarkMode
                            ? 'text-[#E5E7EB]/80 hover:text-[#E5E7EB] hover:bg-[#5EEAD4]/10'
                            : 'text-black hover:text-black hover:bg-[#8FBC8F]/20'
                            }`}
                    >
                        Analyze
                    </Link>
                </nav>

                {/* Right Side: Theme Toggle + Login/Register */}
                <div className="flex items-center space-x-2">
                    {/* Theme Toggle Button */}
                    <motion.button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-all duration-300 ${isDarkMode
                            ? 'bg-[#1A1F26] hover:bg-[#5EEAD4]/20'
                            : 'bg-white/50 hover:bg-[#8FBC8F]/20'
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? (
                            <svg className="w-4 h-4 text-[#5EEAD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </motion.button>

                    {/* Login Button */}
                    <Link
                        href="/login"
                        className={`px-4 py-1.5 rounded-full border-2 font-medium text-base transition-all duration-300 ${isDarkMode
                            ? 'border-[#5EEAD4] text-[#5EEAD4] hover:bg-[#5EEAD4]/10'
                            : 'border-[#8FBC8F] text-black hover:bg-[#8FBC8F]/10'
                            }`}
                    >
                        Login / Register
                    </Link>
                </div>
            </header>

            {/* Hero Content */}
            <main className="absolute bottom-12 left-8 right-8 z-20 max-w-4xl">
                <div className="text-left space-y-6">
                    {/* Premium Badge */}
                    <motion.div
                        className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-md relative border shadow-xl"
                        style={{
                            background: isDarkMode
                                ? 'linear-gradient(135deg, rgba(94, 234, 212, 0.1) 0%, rgba(26, 31, 38, 0.8) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(143, 188, 143, 0.2) 100%)',
                            borderColor: isDarkMode ? 'rgba(94, 234, 212, 0.3)' : 'rgba(45, 80, 22, 0.2)',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.span
                            className="text-white text-xs font-semibold relative z-10 tracking-wider flex items-center gap-2"
                            animate={{
                                textShadow: [
                                    '0 0 20px rgba(94, 234, 212, 0.5)',
                                    '0 0 40px rgba(94, 234, 212, 0.8)',
                                    '0 0 20px rgba(94, 234, 212, 0.5)',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-base">🛡️</span>
                            5GW Defense Edition
                        </motion.span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        className="font-poppins font-black text-white leading-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{
                            textShadow: '0 4px 30px rgba(0, 0, 0, 0.5), 0 0 60px rgba(94, 234, 212, 0.3)',
                        }}
                    >
                        <motion.span
                            className="block font-light text-3xl md:text-4xl lg:text-5xl mb-2"
                            style={{
                                background: "linear-gradient(135deg, #FFFFFF 0%, #5EEAD4 30%, #98D8C8 50%, #FFFFFF 70%, #5EEAD4 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                backgroundSize: "300% 300%",
                                filter: "drop-shadow(0 0 30px rgba(94, 234, 212, 0.6))",
                            }}
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            The Iron Dome
                        </motion.span>

                        <span className="block text-4xl md:text-5xl lg:text-6xl mb-1">
                            for Your
                        </span>

                        <span className="block text-4xl md:text-5xl lg:text-6xl">
                            <TypewriterText isDarkMode={isDarkMode} />
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        className="font-poppins text-lg md:text-xl font-semibold text-white leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        style={{
                            textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        Navigate the Information Battlefield.{' '}
                        <span className="text-[#5EEAD4] font-bold">See Every Side.</span>{' '}
                        Decide for Yourself.
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        className="font-poppins text-sm md:text-base font-normal text-white/90 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        style={{
                            textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)',
                        }}
                    >
                        Stop being manipulated by echo chambers. Argument Cartographer maps polarized narratives from across the{' '}
                        <span className="font-semibold text-[#98D8C8]">Indian media ecosystem</span>, showing you claims, counter-claims, and evidence—all in one visual map.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex items-center gap-4 flex-wrap pt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >


                        <Link
                            href="/radar"
                            className="group relative px-8 py-3 rounded-full font-poppins font-bold text-sm overflow-hidden cursor-pointer shadow-xl"
                            style={{
                                background: 'linear-gradient(135deg, #5EEAD4 0%, #98D8C8 50%, #5EEAD4 100%)',
                                backgroundSize: '200% 200%',
                            }}
                        >
                            <span className="relative z-10 text-[#0F1419] flex items-center gap-2">
                                Start Mapping
                                <motion.svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </main>

            {/* Rotating Badge - CSS Version */}
            {mounted && (
                <div className="absolute bottom-8 right-8 z-30">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        {/* Pulsing border effect with CSS */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: isDarkMode
                                    ? 'conic-gradient(from 0deg, #5EEAD4, #98D8C8, #A8D5BA, #5EEAD4)'
                                    : 'conic-gradient(from 0deg, #8FBC8F, #2D5016, #A8D5BA, #8FBC8F)',
                                animation: 'spin 3s linear infinite',
                            }}
                        />
                        <div
                            className={`absolute inset-1 rounded-full ${isDarkMode ? 'bg-[#0F1419]' : 'bg-[#FFF8E7]'
                                }`}
                        />

                        <motion.svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{ transform: "scale(1.5)" }}
                        >
                            <defs>
                                <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                            </defs>
                            <text className={`text-[10px] font-semibold ${isDarkMode ? 'fill-[#5EEAD4]/80' : 'fill-[#2D5016]/80'
                                }`}>
                                <textPath href="#circle" startOffset="0%">
                                    Break Echo Chambers • See All Sides • Truth Over Narrative •
                                </textPath>
                            </text>
                        </motion.svg>
                    </div>
                </div>
            )}
        </div>
    )
}
